using Scrapers;
using Microsoft.Extensions.DependencyInjection;

var host = Services.Initalize(args);

var scraper = host.Services.GetRequiredService<Scraper>();
var meetingFactory = host.Services.GetRequiredService<MeetingFactory>();

var targets = NorthCarolinaScrapeTarget.All;
targets = new[] { NorthCarolinaScrapeTarget.Cumberland };

var mapMeetings = new List<MappableMeeting>(500);
foreach (var target in targets)
{
	var results = scraper.Scrape(target)
		.Take(1); //TODO limit what we're doing just as a proof of concept and to go easy on the geocoder service
	await foreach (var result in results)
	{
		var mappedResult = await meetingFactory.GetMappableMeeting(result);

        mapMeetings.Add(mappedResult);
    }
}

await File.WriteAllTextAsync("../../../../../../../toolkit-site/meetings.json", mapMeetings.ToJson());