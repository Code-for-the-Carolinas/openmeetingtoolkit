using Scrapers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var meetingSaveFile = "../../../../../../../toolkit-site/meetings.json";

var manualMeetingFile = "../../../../../../meetings.csv";

var host = Services.Initalize(args);

var existingMeetings = File.ReadAllText(meetingSaveFile)
    .FromJson();

var meetingFactory = host.Services.GetRequiredService<CachingMeetingFactory>();
meetingFactory.AddCache(existingMeetings);

var mapMeetings = new List<MappableMeeting>(1000);
await mapMeetings.AddManualMeetings(manualMeetingFile, host);
await mapMeetings.AddScrapedMeetings(NorthCarolinaScrapeTarget.All, host);

await File.WriteAllTextAsync(meetingSaveFile, mapMeetings.ToJson());

public static class MappableMeetingHelper
{
    public static async Task AddManualMeetings(this List<MappableMeeting> meetings, string manualMeetingFile, IHost host)
    {
        var meetingFactory = host.Services.GetRequiredService<CachingMeetingFactory>();
        await foreach (var meeting in manualMeetingFile.FromCsv(meetingFactory))
        {
            meetings.Add(meeting);
        }
    }

    public static async Task AddScrapedMeetings(this List<MappableMeeting> meetings, IEnumerable<ScrapeTarget> targets, IHost host)
    {
        var calendar = host.Services.GetRequiredService<CalendarService>();
        var scraper = host.Services.GetRequiredService<Scraper>();
        var meetingFactory = host.Services.GetRequiredService<CachingMeetingFactory>();

        foreach (var target in targets)
        {
            try
            {
                var results = scraper.Scrape(target);
                await foreach (var result in results)
                {
                    var mappedResult = await meetingFactory.GetMappableMeeting(result);

                    if(mappedResult.IsCurrent(calendar.Now))
                        meetings.Add(mappedResult);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"IGNORED {target.County} because {e.Message}");
            }
        }
    }
}