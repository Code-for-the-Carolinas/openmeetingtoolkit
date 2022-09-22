using Scrapers;
using Microsoft.Extensions.DependencyInjection;
using ReusableXpathScraper;
using Microsoft.Extensions.Options;

var host = Services.Initalize(args);

var settings = host.Services.GetRequiredService<IOptions<FilePaths>>().Value;

var existingMeetings = File.ReadAllText(settings.MeetingSaveFile)
    .FromJson();

var meetingFactory = host.Services.GetRequiredService<CachingMeetingFactory>();
meetingFactory.AddCache(existingMeetings);

var mapMeetings = new List<MappableMeeting>(1000);
await mapMeetings.AddManualMeetings(settings.ManualMeetingFile, host);
await mapMeetings.AddScrapedMeetings(NorthCarolinaScrapeTarget.All, host);

var corrections = settings.ManualCorrectionsFile.FromCsv();
mapMeetings = mapMeetings.MergeCorrections(corrections)
    .ToList();

await File.WriteAllTextAsync(settings.MeetingSaveFile, mapMeetings.ToJson());

await File.WriteAllTextAsync(settings.MeetingSaveBaserowFile, mapMeetings.ToCsv());
