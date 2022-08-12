﻿using CsvHelper;
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


    public static IEnumerable<MappableMeeting> FromJson(this string meetingJson)
        => JsonSerializer.Deserialize<MappableMeetingCollection>(meetingJson)?.Features
        ?? Array.Empty<MappableMeeting>();

    public static string ToJson(this IEnumerable<MappableMeeting> meetings)
        => JsonSerializer.Serialize(new MappableMeetingCollection(meetings), new JsonSerializerOptions { WriteIndented = true });
}