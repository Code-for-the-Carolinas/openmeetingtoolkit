namespace Scrapers;
using Geo.MapBox.Models.Parameters;
using Geo.MapBox.Abstractions;
using System.Text.RegularExpressions;
using Geo.MapBox.Models.Responses;

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
        var bestLocation = await ResolveLocation(meeting.Location);
        var coords = new Location(bestLocation.Geometry.Coordinate.Longitude, bestLocation.Geometry.Coordinate.Latitude);

        var nextSpecificTime = new TempralExpression(meeting.Time).NextOccurance(DateTime.Now);

        var betterMeeting = new Meeting(
            Name: meeting.Name,
            Location: meeting.Location,
            Address: bestLocation.PlaceInformation.First().PlaceName,
            Schedule: meeting.Time,
            Start: nextSpecificTime,
            End: nextSpecificTime,
            Remote: "",
            MoreInfo: meeting.MoreInfo);

        return new MappableMeeting(betterMeeting, coords);
    }

    public virtual async Task<Feature> ResolveLocation(string locationQuery)
    {
        var cleaner = new Regex(@"[^A-Za-z0-9]"); //library isn't url encoding properly
        var cleanQuery = cleaner.Replace(locationQuery, " ");
        var response = await Mapbox.GeocodingAsync(new GeocodingParameters { Query = cleanQuery });
        var best = response.Features.OrderBy(f => f.Relevance).First();
        return best;
    }
}

