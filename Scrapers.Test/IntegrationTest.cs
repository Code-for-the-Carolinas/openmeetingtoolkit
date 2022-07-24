using Xunit;
using Xunit.Abstractions;
using FluentAssertions;

namespace Scrapers.Test;

public class IntegrationTest
{
    private Scraper Client;
    private ITestOutputHelper TestConsole;

    public IntegrationTest(ITestOutputHelper testOutput)
    {
        TestConsole = testOutput;
        Client = new Scraper();
    }

    [Fact]
    public async Task CumberlandTest()
    {
        var meetings = await Client.Scrape(NorthCarolinaScrapeTarget.Cumberland).ToListAsync();
        Log(meetings);

        meetings[0].Should().BeEquivalentTo(
            new Meeting("A.B.C. Board",
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
            new Meeting("Adult Care Home Community Advisory Committee",
            "JR Kernodle Senior Center",
            "2:00 p.m. the third Tuesday of each quarter",
            "Tracy Warner, Ombudsman, (336) 904-0300")); //or should we stick to the url pattern?

        meetings[2].Should().BeEquivalentTo(
            new Meeting("Board of Health",
            "Alamance County, NC",
            "",
            "https://www.alamance-nc.com/boardscommittees/boards-and-committees/human-services/board-of-health/")); //GOTCHA the url on this page has a typo

        //TODO this one doesn't follow the standard format see https://www.alamance-nc.com/em/lepc/
        //meetings[10].Should().BeEquivalentTo(
        //    new Meeting("Local Emergency Planning Committee",
        //    "Family Justice Center 1950 Martin St, Burlington, N.C",
        //    "August 26th, 2022",
        //    "https://www.alamance-nc.com/em/lepc/"));

        meetings.Count().Should().Be(36);
    }

    [Fact]
    public async Task NewHannoverTest()
    {
        var meetings = await Client.Scrape(NorthCarolinaScrapeTarget.NewHannover).ToListAsync();
        Log(meetings);

        meetings.Count().Should().Be(123);
    }

    protected void Log(List<Meeting> meetings) => LogArray(meetings);

    protected void LogCsv(List<Meeting> meetings)
    {
        TestConsole.WriteLine(meetings.ToCsv());
    }

    protected void LogArray(List<Meeting> meetings)
    {
        var i = 0;
        foreach (var meeting in meetings)
        {
            TestConsole.WriteLine(
                meeting.ToString()
                .Replace("\n", "\\n")
                .Insert(7, $"[{i++}]"));
        }
    }
}