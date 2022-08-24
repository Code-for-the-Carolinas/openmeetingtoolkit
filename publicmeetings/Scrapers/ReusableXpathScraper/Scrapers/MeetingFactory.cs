namespace Scrapers;
using Geo.MapBox.Models.Parameters;
using Geo.MapBox.Abstractions;
using System.Text.RegularExpressions;
using Geo.MapBox.Models.Responses;
using System.Globalization;

//TODO learn more here https://docs.google.com/document/d/1cXzcGdHkvUBlQ8bvSnZd6G09ZMGDF6apxYlsPsRqmSY/edit
//TODO populate https://docs.google.com/spreadsheets/d/1MOgzArardJB3TeZAEys9UewUqZUG7jgI08GbSdMNOcc/edit#gid=0
public class MeetingFactory
{
    protected IMapBoxGeocoding Mapbox { get; }

    public MeetingFactory(IMapBoxGeocoding mapbox)
    {
        Mapbox = mapbox;
    }

    public async Task<MappableMeeting> GetMappableMeeting(ScrapedMeeting meeting)
    {
        var anchoredLocation = AnchorLocation(meeting.Location, meeting.County, "NC");

        var bestLocation = await ResolveLocation(anchoredLocation);
        var coords = new Location(bestLocation.Geometry.Coordinate.Longitude, bestLocation.Geometry.Coordinate.Latitude);

        //var nextSpecificTime = TimeOnly.FromDateTime(new TempralExpression(meeting.Time).NextOccurance(DateTime.Now));
        TimeOnly? nextSpecificTime = null;

        var betterMeeting = new Meeting(
            Government: meeting.County,
            Publicbody: meeting.Name,
            Location: meeting.Location,
            Address: bestLocation.PlaceInformation.First().PlaceName,
            Schedule: meeting.Time,
            Start: nextSpecificTime,
            End: nextSpecificTime,
            Remote: "",
            MoreInfo: meeting.MoreInfo)
        {
        };

        return new MappableMeeting(betterMeeting, coords);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="location"></param>
    /// <param name="anchorLocation">assumed to be in ADDRESS order (more specific to least specific)</param>
    /// <returns></returns>
    protected string AnchorLocation(string? location, params string[] anchors)
    {
        if (string.IsNullOrWhiteSpace(location))
            return string.Join(" ", anchors);

        var toAdd = anchors.Reverse()
            .TakeWhile(anchor => !location.Contains(anchor))
            .Reverse();

        return string.Join(" ", new[] { location }.Concat(toAdd));
    }

    public virtual async Task<Feature> ResolveLocation(string locationQuery)
    {
        var cleaner = new Regex(@"[^A-Za-z0-9]"); //library isn't url encoding properly
        var cleanQuery = cleaner.Replace(locationQuery, " ");
        var query = new GeocodingParameters { Query = cleanQuery,  };
        query.Countries.Add(RegionInfo.CurrentRegion);
        var response = await Mapbox.GeocodingAsync(query);
        var best = response.Features.OrderBy(f => f.Relevance).First();
        return best;
    }
}

