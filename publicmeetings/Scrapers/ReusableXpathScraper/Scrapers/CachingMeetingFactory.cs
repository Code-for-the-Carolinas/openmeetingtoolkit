namespace Scrapers;
using Geo.MapBox.Abstractions;

public class CachingMeetingFactory : MeetingFactory
{
    
    public CachingMeetingFactory(IMapBoxGeocoding mapbox)
        :base(mapbox)
    {
    }

    protected Dictionary<string, Location> Cache { get; set; } = new();
    public void AddCache(IEnumerable<MappableMeeting> cache)
    {
        Cache = cache.ToDictionary(m => m.Properties.Location, m=>m.Geometry);
    }

    public override async Task<Location> ResolveLocation(string locationQuery)
    {
        if (Cache.ContainsKey(locationQuery))
            return Cache[locationQuery];

        var coords = await base.ResolveLocation(locationQuery);

        Cache.Add(locationQuery, coords);

        return coords;
    }
}

