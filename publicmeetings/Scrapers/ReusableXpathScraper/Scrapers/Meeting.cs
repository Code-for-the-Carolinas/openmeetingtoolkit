namespace Scrapers;

public record MappableMeetingCollection(IEnumerable<MappableMeeting> Features)
{
    string Type { get; init; } = "FeatureCollection";
}

public record MappableMeeting(Meeting Properties, Location Geometry)
{
    public string Type { get; init; } = "Feature";
}

public record Location(double Longitude, double Latitude)
{
    public double[] Coordinates { get; } = new[] { Longitude, Latitude };
    public string Type { get; init; } = "Point";
}

public record Meeting(
    string Government,
    string Publicbody,
    string Location,
    string Address,
    string Schedule,
    string Start,
    string End,
    string Remote,
    string MoreInfo) //moreinfo is gone too
{
    public Guid Id { get; } = Guid.NewGuid();
}
