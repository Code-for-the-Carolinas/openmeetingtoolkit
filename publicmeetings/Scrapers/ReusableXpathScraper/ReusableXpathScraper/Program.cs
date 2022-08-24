using Scrapers;
using Microsoft.Extensions.DependencyInjection;

var meetingSaveFile = "../../../../../../../toolkit-site/meetings.json";

var host = Services.Initalize(args);

var targets = NorthCarolinaScrapeTarget.All;
targets = new[] { NorthCarolinaScrapeTarget.Cumberland };

var scraper = host.Services.GetRequiredService<Scraper>();
var meetingFactory = host.Services.GetRequiredService<CachingMeetingFactory>();

var existingMeetings = File.ReadAllText(meetingSaveFile)
    .FromJson();

meetingFactory.AddCache(existingMeetings);

var mapMeetings = new List<MappableMeeting>(500);
foreach (var target in targets)
{
    try
    {
        var results = scraper.Scrape(target);
        await foreach (var result in results)
        {
            var mappedResult = await meetingFactory.GetMappableMeeting(result);

            mapMeetings.Add(mappedResult);
        }
    }
    catch (Exception e)
    {
        Console.WriteLine($"IGNORED {target.County} because {e.Message}");
    }
}

await File.WriteAllTextAsync(meetingSaveFile, mapMeetings.ToJson());