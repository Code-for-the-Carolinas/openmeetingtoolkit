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

    public static List<MeetingCorrection> FromCsv(this string meetingCsv)
    {
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            PrepareHeaderForMatch = args => args.Header.ToLowerInvariant().Replace(" ", ""),
            ShouldSkipRecord = row => row.ToString()?.Trim()?.All(c => c == ',' || c == ' ' ) ?? true,
        };

        using var reader = new StreamReader(meetingCsv);
        using var csv = new CsvReader(reader, config);
        return csv.GetRecords<MeetingCorrection>().ToList();
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

    public static string ToCsv(this IEnumerable<MappableMeeting> meetings)
    {

        var flatMeetings = meetings.Select(m => new
        {
            m.Properties.Government,
            Public_body = m.Properties.Publicbody,
            On_Map = "",
            m.Properties.Location,
            m.Properties.Address,
            m.Geometry.Latitude,
            m.Geometry.Longitude,
            m.Properties.Schedule,
            Start_time = m.Properties.Start,
            End_time = m.Properties.End,
            Remote_options = m.Properties.Remote,
            Source = m.Properties.MoreInfo
        });
        var writer = new StringWriter();
        using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
        csv.WriteRecords(flatMeetings);
        csv.Flush();
        var csvData = writer.ToString();
        csvData = string.Join(Environment.NewLine, csvData.Split(Environment.NewLine).Select((r, i) => i == 0 ? r.Replace('_', ' ') : r)); //there has to be an easy way to do this with csvhelper but I don't see it
        return csvData;
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