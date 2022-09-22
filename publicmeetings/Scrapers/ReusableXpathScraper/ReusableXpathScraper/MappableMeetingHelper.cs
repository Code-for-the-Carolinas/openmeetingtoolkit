using Scrapers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

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

    public static IEnumerable<MappableMeeting> MergeCorrections(this List<MappableMeeting> meetings, List<MeetingCorrection> corrections)
    {
        foreach (var meeting in meetings)
        {
            var foundMatch = false;
            foreach (var correction in corrections)
            {
                if (correction.Matches(meeting))
                {
                    foundMatch = true;
                    yield return meeting.Merge(correction);
                }
            }
            if(!foundMatch)
                yield return meeting;
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

                    if (mappedResult.IsCurrent(calendar.Now))
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