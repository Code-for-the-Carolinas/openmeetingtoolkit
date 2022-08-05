using Xunit;
using Xunit.Abstractions;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;

namespace Scrapers.Test;

public class IntegrationTest : TestLogger
{
    private Scraper Client;

    public IntegrationTest(ITestOutputHelper testOutput)
        : base(testOutput)
    {
        Client = new Scraper();
    }

    [Fact]
    public async Task CumberlandTest()
    {
        var meetings = await Client.Scrape(NorthCarolinaScrapeTarget.Cumberland).ToListAsync();
        Log(meetings);

        meetings[0].Should().BeEquivalentTo(
            new ScrapedMeeting("A.B.C. Board",
            "ABC Board Office Conference Room \n424 Person Street\nFayetteville, NC",
            "Second Monday of each month at 6:00 p.m. The average length of a meeting is approximately two hours.",
            "https://www.cumberlandcountync.gov/departments/commissioners-group/commissioners/appointed-boards/board-descriptions"));

        meetings.Count().Should().Be(34);
    }

    [Fact]
    public async Task AlamanceTest()
    {
        var meetings = await Client.Scrape(NorthCarolinaScrapeTarget.Alamance).ToListAsync();
        Log(meetings);

        meetings[0].Should().BeEquivalentTo(
            new ScrapedMeeting("Adult Care Home Community Advisory Committee",
            "JR Kernodle Senior Center",
            "2:00 p.m. the third Tuesday of each quarter",
            "Tracy Warner, Ombudsman, (336) 904-0300")); //or should we stick to the url pattern?

        meetings[2].Should().BeEquivalentTo(
            new ScrapedMeeting("Board of Health",
            "Alamance County, NC",
            "",
            "https://www.alamance-nc.com/boardscommittees/boards-and-committees/human-services/board-of-health/")); //GOTCHA the url on this page has a typo

        //TODO this one doesn't follow the standard format see https://www.alamance-nc.com/em/lepc/
        //meetings[10].Should().BeEquivalentTo(
        //    new Meeting("Local Emergency Planning Committee",
        //    "Family Justice Center 1950 Martin St, Burlington, N.C",
        //    "August 26th, 2022",
        //    "https://www.alamance-nc.com/em/lepc/"));

        meetings.Count().Should().Be(38);
    }

    [Fact]
    public async Task AveryTest()
    {
        var meetings = (await Client.ScrapeICal(NorthCarolinaScrapeTarget.Avery))
            .ToList();

        Log(meetings);

        meetings[334].Should().BeEquivalentTo(new ScrapedMeeting("Board Workshop Wed. July 20, 2022 @ 1:00 p.m. Commissioners Board Room, 175 Linville Street, Newland, NC.&nbsp; See front page for details of the meeting",
            "",//TODO parse event name?
            "7/20/2022 1:00:00 PM America/New_York",
            "")); //TODO use website listing instead of this ical?

        meetings.Count().Should().Be(335);
    }

    [Fact]
    public async Task NewHannoverTest()
    {
        var meetings = await Client.Scrape(NorthCarolinaScrapeTarget.NewHannover).ToListAsync();
        Log(meetings);

        meetings[35].Should().BeEquivalentTo(new ScrapedMeeting("Board of Commissioners Regular Meeting",
            "NHC Courthouse - Room 301 @ 24 N 3rd St, Wilmington, NC 28401, USA",
            "2020-10-05T16:00:00", //could be parsed as datetime
            "https://commissioners.nhcgov.com/event/board-of-commissioners-regular-meeting-118/"));

        meetings.Count().Should().Be(123);
    }

    [Fact]
    public async Task CountyCoordinateLookup()
    {
        var host = Services.Initalize();
        var poo = host.Services.GetRequiredService<Writer>();
        var example = new ScrapedMeeting("Board of Commissioners", "New Hannover County, NC", "every two weeks on monday", "more info and remote");
        var result = await poo.DeCrapify(example);
        result.Geometry.Coordinates.Should().BeEquivalentTo(new[] { -77.86, 34.18 });
    }

    protected void LogCsv(List<Meeting> meetings)
    {
        TestConsole.WriteLine(meetings.ToCsv());
    }
}