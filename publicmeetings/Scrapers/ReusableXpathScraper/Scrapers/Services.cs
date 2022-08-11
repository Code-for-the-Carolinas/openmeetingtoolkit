using Geo.MapBox.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Scrapers;

public static class Services
{
    public static IHost Initalize(string[]? args = null)
    {
        var config = new ConfigurationBuilder()
            .AddUserSecrets<Meeting>()
            .Build()
            .GetSection("MapBox")["Key"];

        var host = Host.CreateDefaultBuilder(args)
            .ConfigureServices((_, services) => services
            .AddLocalization()
            .AddHttpClient()
            .AddMapBoxServices(o => o.UseKey(config))
            .AddScoped<MeetingFactory>()
            .AddScoped(s => new Scraper(s.GetRequiredService<HttpClient>()))
            ).Build();

        return host;
    }
}
