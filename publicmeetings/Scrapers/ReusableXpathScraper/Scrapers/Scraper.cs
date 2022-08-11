namespace Scrapers;

using HtmlAgilityPack;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text.RegularExpressions;

public class Scraper
{
    protected HttpClient Client;

    public Scraper()
        : this(new HttpClient())
    {

    }
    public Scraper(HttpClient client)
    {
        Client = client;

        var productValue = new ProductInfoHeaderValue("Code-for-the-Carolinas", "1.0");
        var commentValue = new ProductInfoHeaderValue("(+https://github.com/Code-for-the-Carolinas/openmeetingtoolkit)");
        Client.DefaultRequestHeaders.UserAgent.Add(productValue);
        Client.DefaultRequestHeaders.UserAgent.Add(commentValue);
    }

    public async Task<IEnumerable<ScrapedMeeting>> ScrapeICal(ScrapeTarget target) //TODO merge with Scrape, have to figure out how to pass through IAsyncEnumerable calls
    {
        var ical = (await Client.GetStringAsync(target.Url))
            .Replace("COUNT=-1;", ""); //fix spec violation

        var calenadar = Ical.Net.Calendar.Load(ical);

        return calenadar.Events.Select(e => new ScrapedMeeting(
            e.Summary,
            e.Location ?? e.Name,
            e.DtStart.ToString() ?? "",
            ""));
    }

    public async IAsyncEnumerable<ScrapedMeeting> Scrape(ScrapeTarget target)
    {
        var html = await Client.GetStringAsync(target.Url);

        var dom = new HtmlDocument();
        dom.LoadHtml(html);

        var meetingChunks = dom.DocumentNode.SelectNodes(target.RowXPath)
            .ToAsyncEnumerable()
            .SelectAwait(async r => await ClickThroughIfLink(r));

        var meetings = meetingChunks.Select(r =>
        new ScrapedMeeting(
            Name: r.ExtractSingleNode(target.NameXpath)
                ?? "",
            Location: r.ExtractSingleNode(target.LocationXpath) + " " + target.Name,
            Time: r.ExtractSingleNode(target.TimeXPath)
                ?? "",
            MoreInfo: r.ExtractSingleNode(target.MoreInfoXPath)
                ?? r.SelectSingleNode("/").GetAttributeValue("page-url", null) //hack to catch new url
                ?? target.Url
            ));

        //there has got to be a better way?!
        await foreach (var meeting in meetings)
        {
            yield return meeting;
        }

    }
    public async Task<HtmlNode> ClickThroughIfLink(HtmlNode node)
    {
        var href = node.Attributes["href"];
        if (href == null)
            return node;

        var newHtml = await Client.GetStringAsync(href.Value);
        var newDom = new HtmlDocument();
        newDom.LoadHtml(newHtml);

        newDom.DocumentNode.SetAttributeValue("page-url", href.Value); //hack to pass back new url

        return newDom.DocumentNode;
    }
}

public static class ScrapeHelper
{
    public static string? ExtractSingleNode(this HtmlNode node, string xPath)
    {
        if (xPath == string.Empty)
            return null;

        var nodeText = node.SelectSingleNode(xPath)?.InnerText;

        var hasStartsWith = new Regex(@"starts-with\(\.,\s*'([^']+)'"); //tried to do from xpath via replace or start-after but could not figure it out
        var found = hasStartsWith.Match(xPath);
        if (nodeText != null && found.Success)
            nodeText = nodeText.Replace(found.Groups[1].Value, string.Empty);

        return HtmlEntity.DeEntitize(nodeText)?.Trim();
    }
}