namespace Scrapers;
using Geo.MapBox.Abstractions;
using Geo.MapBox.Models.Responses;
using System.Linq;

public class CachingMeetingFactory : MeetingFactory
{

    public CachingMeetingFactory(IMapBoxGeocoding mapbox)
        : base(mapbox)
    {
    }

    protected Dictionary<string, Feature> Cache { get; set; } = new();
    public void AddCache(IEnumerable<MappableMeeting> cache)
    {
        Cache = cache
            .GroupBy(m=> m.Properties.Location)
            .ToDictionary(
            m => m.Key,
            m => m.First().AsFeature());
    }

    public override async Task<Feature> ResolveLocation(string locationQuery)
    {
        if (Cache.ContainsKey(locationQuery))
            return Cache[locationQuery];

        var coords = await base.ResolveLocation(locationQuery);

        Cache.Add(locationQuery, coords);

        return coords;
    }
}

public static class MeetingFactoryHelper
{
    public static Feature AsFeature(this MappableMeeting meeting)
    {
        var asFeature = new Feature
        {
            Geometry = new Geometry
            {
                Coordinate = new Geo.MapBox.Models.Coordinate
                {
                    Latitude = meeting.Geometry.Latitude,
                    Longitude = meeting.Geometry.Longitude
                }
            }
        };

        asFeature.PlaceInformation.Add(new PlaceInformation { PlaceName = meeting.Properties.Address });

        return asFeature;
    }
}

