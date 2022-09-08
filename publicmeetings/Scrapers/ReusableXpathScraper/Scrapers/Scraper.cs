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

    public IAsyncEnumerable<ScrapedMeeting> Scrape(ScrapeTarget target)
    {
        if (target is ICalScrapeTarget)
            return ScrapeICal((ICalScrapeTarget)target);
        return ScrapeWeb(target);
    }

    protected async IAsyncEnumerable<ScrapedMeeting> ScrapeICal(ICalScrapeTarget target)
    {
        var ical = (await Client.GetStringAsync(target.Url))
            .Replace("COUNT=-1;", ""); //fix spec violation

        var calenadar = Ical.Net.Calendar.Load(ical);

        foreach (var e in calenadar.Events)
        {
            yield return new ScrapedMeeting(
            target.County,
            e.Summary,
            e.Location ?? e.Name,
            e.DtStart.ToString() ?? "",
            "");
        }
    }

    protected async IAsyncEnumerable<ScrapedMeeting> ScrapeWeb(ScrapeTarget target)
    {
        var html = await Client.GetStringAsync(target.Url);

        var dom = new HtmlDocument();
        dom.LoadHtml(html);

        var meetingChunks = dom.DocumentNode.SelectNodes(target.RowXPath)
            .ToAsyncEnumerable()
            .SelectAwait(async r => await ClickThroughIfLink(r, target.Url));

        var meetings = meetingChunks.Select(r =>
        new ScrapedMeeting(
            County: target.County,
            Name: r.ExtractSingleNode(target.NameXpath)
                ?? "",
            Location: r.ExtractSingleNode(target.LocationXpath) ?? target.County + " " + target.StateCode,
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

    public async Task<HtmlNode> ClickThroughIfLink(HtmlNode node, string ParentUrl)
    {
        var href = node.Attributes["href"];
        if (href == null)
            return node;

        var hrefUrl = new Uri(href.Value, UriKind.RelativeOrAbsolute);
        if (!hrefUrl.IsAbsoluteUri)
            hrefUrl = new Uri(new Uri(ParentUrl), hrefUrl);

        var newHtml = await Client.GetStringAsync(hrefUrl);
        var newDom = new HtmlDocument();
        newDom.LoadHtml(newHtml);

        newDom.DocumentNode.SetAttributeValue("page-url", hrefUrl.ToString()); //hack to pass back new url

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