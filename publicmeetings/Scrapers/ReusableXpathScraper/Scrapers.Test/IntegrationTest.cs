using Xunit;
using Xunit.Abstractions;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using ReusableXpathScraper;

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
            new ScrapedMeeting("Cumberland", "A.B.C. Board",
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
            new ScrapedMeeting("Alamance", "Adult Care Home Community Advisory Committee",
            "JR Kernodle Senior Center",
            "2:00 p.m. the third Tuesday of each quarter",
            "Tracy Warner, Ombudsman, (336) 904-0300")); //or should we stick to the url pattern?

        meetings[2].Should().BeEquivalentTo(
            new ScrapedMeeting("Alamance", "Board of Health",
            "Alamance NC",
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
        var meetings = await Client.Scrape(NorthCarolinaScrapeTarget.Avery).ToListAsync();

        Log(meetings);

        meetings[334].Should().BeEquivalentTo(new ScrapedMeeting("Avery", "Board Workshop Wed. July 20, 2022 @ 1:00 p.m. Commissioners Board Room, 175 Linville Street, Newland, NC.&nbsp; See front page for details of the meeting",
            "VEVENT",//TODO
            "7/20/2022 1:00:00 PM America/New_York",
            "")); //TODO use website listing instead of this ical?

        meetings.Count().Should().Be(337);
    }

    [Fact]
    public async Task NewHannoverTest()
    {
        var meetings = await Client.Scrape(NorthCarolinaScrapeTarget.NewHannover).ToListAsync();
        Log(meetings);

        meetings.Should().ContainEquivalentOf(new ScrapedMeeting(
            "New Hannover",
            "Board of Commissioners Regular Meeting",
            "NHC Courthouse - Room 301 @ 24 N 3rd St, Wilmington, NC 28401, USA",
            "2022-12-05T16:00:00", //could be parsed as datetime
            "https://commissioners.nhcgov.com/event/board-of-commissioners-regular-meeting-163/"));

        meetings.Count().Should().BeGreaterThan(50); //like 120
    }

    [Fact]
    public async Task OrangeTest()
    {
        var meetings = await Client.Scrape(NorthCarolinaScrapeTarget.Orange).ToListAsync();
        Log(meetings);

        meetings.Count().Should().BeGreaterThan(10); //like 120
    }

    [Fact]
    public async Task CountyCoordinateLookup()
    {
        var host = Services.Initalize();
        var resolver = host.Services.GetRequiredService<MeetingFactory>();
        var result = await resolver.ResolveLocation("New Hannover County, NC");
        result.Geometry.Coordinate.Longitude.Should().BeApproximately(-77.86, .1);
        result.Geometry.Coordinate.Latitude.Should().BeApproximately(34.18, .1);
    }

    [Fact]
    public async Task CountyCoordinateLookupWeirdAnchor()
    {
        var host = Services.Initalize();
        var resolver = host.Services.GetRequiredService<MeetingFactory>();
        var example = new ScrapedMeeting("Cumberland", "Mid-Carolina Aging Advisory Council",
            "Various locations in the three county region (Cumberland, Harnett and Sampson counties)",
            "1st Thursday of the last month of each quarter",
            "https://www.cumberlandcountync.gov/departments/commissioners-group/commissioners/appointed-boards/board-descriptions");
        var result = await resolver.GetMappableMeeting(example);
        result.Geometry.Longitude.Should().BeApproximately(-78.37, .1);
        result.Geometry.Latitude.Should().BeApproximately(34.99, .1);
    }

    protected void LogCsv(List<Meeting> meetings)
    {
        TestConsole.WriteLine(meetings.ToCsv());
    }
}