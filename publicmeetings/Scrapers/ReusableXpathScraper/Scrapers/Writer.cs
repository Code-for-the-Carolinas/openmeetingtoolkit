namespace Scrapers;
using CsvHelper;
using Geo.MapBox.Models.Parameters;
using Geo.MapBox.Abstractions;

public class Writer
{
    protected IMapBoxGeocoding Mapbox { get; }

    public Writer(IMapBoxGeocoding mapbox)
    {
        Mapbox = mapbox;
    }
    //TODO learn more here https://docs.google.com/document/d/1cXzcGdHkvUBlQ8bvSnZd6G09ZMGDF6apxYlsPsRqmSY/edit
    //TODO populate https://docs.google.com/spreadsheets/d/1MOgzArardJB3TeZAEys9UewUqZUG7jgI08GbSdMNOcc/edit#gid=0

    public async Task<Wrapper> DeCrapify(ScrapedMeeting meeting)
    {
        var response = await Mapbox.GeocodingAsync(new GeocodingParameters{ Query = meeting.Location});
        var best = response.Features.OrderBy(f => f.Relevance).First().Geometry.Coordinate;
        var betterMeeting = new Meeting(meeting.Name, meeting.Location, meeting.Location, meeting.Time, DateTime.Now, DateTime.Now, "", meeting.MoreInfo);
        var coords = new Location(best.Longitude, best.Latitude);
        return new Wrapper(betterMeeting, coords);
    }
}

public static class WriterHelper
{
    public static string ToCsv(this IEnumerable<Meeting> meetings)
    {
        using var writer = new StringWriter();
        using var csv = new CsvWriter(writer, System.Globalization.CultureInfo.InvariantCulture);
        csv.WriteRecords(meetings);
        csv.Flush();
        return writer.ToString();
    }
}
