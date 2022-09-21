namespace ReusableXpathScraper;
using Geo.MapBox.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Scrapers;

public static class Services
{
    public static IHost Initalize(string[]? args = null)
    {
        var config = new ConfigurationBuilder()
            .AddUserSecrets<Meeting>()
            .AddJsonFile("appsettings.json")
            .Build();

        var host = Host.CreateDefaultBuilder(args)
            .ConfigureServices((_, services) => services
            .AddLocalization()
            .AddHttpClient()
            .AddMapBoxServices(o => o.UseKey(config.GetSection("MapBox")["Key"]))
            .Configure<FilePaths>(config.GetRequiredSection(nameof(FilePaths)))
            .AddScoped<CalendarService>()
            .AddScoped<MeetingFactory>()
            .AddScoped<CachingMeetingFactory>()
            .AddScoped(s => new Scraper(s.GetRequiredService<HttpClient>()))
            ).Build();

        return host;
    }
}
