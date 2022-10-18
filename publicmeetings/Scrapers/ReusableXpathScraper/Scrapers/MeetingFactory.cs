namespace Scrapers;
using Geo.MapBox.Models.Parameters;
using Geo.MapBox.Abstractions;
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

    public async Task<MappableMeeting> GetMappableMeeting(ManualMeeting meeting)
    {
        Location geometry;
        if (meeting.Latitude is null || meeting.Longitude is null)
        {
            var anchoredLocation = AnchorLocation(meeting.Location, meeting.Government, "NC");
            var bestLocation = await ResolveLocation(anchoredLocation);
            geometry = new Location(bestLocation.Geometry.Coordinate.Longitude, bestLocation.Geometry.Coordinate.Latitude);
        }
        else
            geometry = new Location(meeting.Longitude.Value, meeting.Latitude.Value);

        var properties = new Meeting(meeting.Government, meeting.PublicBody, meeting.Location, meeting.Address, meeting.Schedule, meeting.StartTime, meeting.EndTime, meeting.RemoteOptions, meeting.Source);
        return new MappableMeeting(properties, geometry);
    }

    public async Task<MappableMeeting> GetMappableMeeting(ScrapedMeeting meeting)
    {
        var anchoredLocation = AnchorLocation(meeting.Location, meeting.County, "NC");

        var bestLocation = await ResolveLocation(anchoredLocation);
        var coords = new Location(bestLocation.Geometry.Coordinate.Longitude, bestLocation.Geometry.Coordinate.Latitude);

        var betterMeeting = new Meeting(
            Government: meeting.County + " County",
            Publicbody: meeting.Name,
            Location: meeting.Location,
            Address: bestLocation.PlaceInformation.First().PlaceName,
            Schedule: meeting.Time,
            Start: "", //TODO
            End: "", //TODO
            Remote: "", //TODO
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
        var badLocations = new[] { "as called", "various locations", "vevent" };

        if (string.IsNullOrWhiteSpace(location)
            || badLocations.Contains(location.ToLower()))
            return string.Join(" ", anchors);

        var toAdd = anchors.Reverse()
            .TakeWhile(anchor => !location.Contains(anchor))
            .Reverse();

        return string.Join(" ", new[] { location }.Concat(toAdd));
    }

    public virtual async Task<Feature> ResolveLocation(string locationQuery)
    {
        var query = new GeocodingParameters { Query = locationQuery, };
        query.Countries.Add(RegionInfo.CurrentRegion);
        var response = await Mapbox.GeocodingAsync(query);
        var best = response.Features.OrderBy(f => f.Relevance).First();
        return best;
    }
}

