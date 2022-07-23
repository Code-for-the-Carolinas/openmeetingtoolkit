namespace Scrapers;

public record ScrapeTarget(string Name, string Url, string RowXPath, string NameXpath, string LocationXpath, string TimeXPath);

public static partial class NorthCarolinaScrapeTarget
{
    public static ScrapeTarget Alamance =>
        new ScrapeTarget("Alamance", "https://www.alamance-nc.com/boardscommittees/",
            RowXPath: "//*[@id=\"pe-maincontent\"]/article/div/div/div/ul/li/a",
            NameXpath: ".//*[@id=\"pe-maincontent\"]/article/header/h1",
            LocationXpath: ".//*[@id=\"pe-maincontent\"]/article/div/p[starts-with(.,'Meeting Location:')]", //GOTCHA starts-with handled by ExtractSingleNode
            TimeXPath: ".//*[@id=\"pe-maincontent\"]/article/div/p[starts-with(.,'Meeting Schedule:')]"); //tempral expression
    // "//*[@id="pe-maincontent"]/article/div/p[4]"; //Contact Person and Phone:

    public static ScrapeTarget Cumberland =>
        new ScrapeTarget("Cumberland","https://www.cumberlandcountync.gov/departments/commissioners-group/commissioners/appointed-boards/board-descriptions",
            ".//li[@data-sf-provider = 'OpenAccessProvider']",
            ".//button",
            ".//div[@data-sf-field = 'Location']", //listed as a tempral expression
            ".//div[@data-sf-field = 'Meetings']");

    public static ScrapeTarget NewHannover =>
        new ScrapeTarget("New Hannover", "http://commissioners.nhcgov.com/?plugin=all-in-one-event-calendar&controller=ai1ec_exporter_controller&action=export_events&xml=true",
            "//vevent",
            ".//summary/text",
            ".//location/text", //or .//geo/latitude .//geo/longitude
            ".//dtstart/date-time"); //listed per each date

}
