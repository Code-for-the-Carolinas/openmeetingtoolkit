using CsvHelper;
using System.Text.Json;

namespace Scrapers;

public static class Serializer
{
    public static string ToCsv(this IEnumerable<Meeting> meetings)
    {
        using var writer = new StringWriter();
        using var csv = new CsvWriter(writer, System.Globalization.CultureInfo.InvariantCulture);
        csv.WriteRecords(meetings);
        csv.Flush();
        return writer.ToString();
    }

    public static string ToJson(this IEnumerable<MappableMeeting> meetings) => JsonSerializer.Serialize(meetings);
}
