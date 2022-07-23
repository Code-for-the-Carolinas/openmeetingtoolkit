namespace Scrapers;

using HtmlAgilityPack;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text.RegularExpressions;

public class Scraper
{
    public HttpClient Client; //GOTCHA do not dispose, google it

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

    public async IAsyncEnumerable<Meeting> Scrape(ScrapeTarget target)
    {
        var html = await Client.GetStringAsync(target.Url);

        var dom = new HtmlDocument();
        dom.LoadHtml(html);

        var meetingChunks = dom.DocumentNode.SelectNodes(target.RowXPath)
            .ToAsyncEnumerable()
            .SelectAwait(async r => await ClickThroughIfLink(r));


        var meetings =  meetingChunks.Select(r =>
        new Meeting(
            Name: r.ExtractSingleNode(target.NameXpath),
            Location: r.ExtractSingleNode(target.LocationXpath),
            Time: r.ExtractSingleNode(target.TimeXPath)
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

        return newDom.DocumentNode;
    }
}

public static class ScrapeHelper
{
    public static string ExtractSingleNode(this HtmlNode node, string xPath)
    {
        var nodeText = node.SelectSingleNode(xPath)?.InnerText;

        var hasStartsWith = new Regex(@"starts-with\(\.,\s*'([^']+)'"); //tried to do from xpath via replace or start-after but could not figure it out
        var found = hasStartsWith.Match(xPath);
        if (nodeText != null && found.Success)
            nodeText = nodeText.Replace(found.Groups[1].Value, string.Empty);

        return HtmlEntity.DeEntitize(nodeText)?.Trim()
            ?? "";
    }
}