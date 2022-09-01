using CsvHelper;
using CsvHelper.Configuration;
using System.Text.Json;
using System.Globalization;

namespace Scrapers;

public static class Serializer
{
    public static string ToCsv(this IEnumerable<Meeting> meetings)
    {
        using var writer = new StringWriter();
        using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
        csv.WriteRecords(meetings);
        csv.Flush();
        return writer.ToString();
    }

    public static async IAsyncEnumerable<MappableMeeting> FromCsv(this string meetingCsv, MeetingFactory factory)
    {
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            PrepareHeaderForMatch = args => args.Header.ToLowerInvariant().Replace(" ", ""),
        };

        using var reader = new StreamReader(meetingCsv);
        using var csv = new CsvReader(reader, config);
        var meetings = csv.GetRecords<ManualMeeting>();
        foreach (var item in meetings)
        {
            yield return await factory.GetMappableMeeting(item);
        }
    }

    private static JsonSerializerOptions JsonOptions()
    {
        var option = new JsonSerializerOptions(JsonSerializerDefaults.Web) { WriteIndented = true };
        option.Converters.Add(new TimeOnlyConverter());
        return option;
    }

    public static IEnumerable<MappableMeeting> FromJson(this string meetingJson)
        => JsonSerializer.Deserialize<MappableMeetingCollection>(meetingJson, JsonOptions())?.Features
        ?? Array.Empty<MappableMeeting>();

    public static string ToJson(this IEnumerable<MappableMeeting> meetings)
        => JsonSerializer.Serialize(new MappableMeetingCollection(meetings), JsonOptions());
}

//Government,Public body,On map,Location,Address,Latitude,Longitude,Schedule,Start time,End time,Remote options,Source
public record ManualMeeting(string Government, string PublicBody, string OnMap, string Location, string Address, double? Latitude, double? Longitude, string Schedule, string StartTime, string EndTime, string RemoteOptions, string Source);