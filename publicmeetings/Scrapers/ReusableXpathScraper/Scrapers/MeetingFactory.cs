namespace Scrapers;
using CsvHelper;
using Geo.MapBox.Models.Parameters;
using Geo.MapBox.Abstractions;

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
        var coords = await ResolveLocation(meeting.Location);
        var betterMeeting = new Meeting(meeting.Name, meeting.Location, meeting.Location, meeting.Time, DateTime.Now, DateTime.Now, "", meeting.MoreInfo);
        return new MappableMeeting(betterMeeting, coords);
    }

    public async Task<Location> ResolveLocation(string locationQuery)
    {
        var response = await Mapbox.GeocodingAsync(new GeocodingParameters { Query = locationQuery });
        var best = response.Features.OrderBy(f => f.Relevance).First().Geometry.Coordinate;
        
        return new Location(best.Longitude, best.Latitude);
    }
}

