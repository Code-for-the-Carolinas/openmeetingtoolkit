namespace Scrapers;

public record MappableMeeting(Meeting Properties, Location Geometry)
{
    public string Type { get; } = "Feature";
}

public record Location(double Longitude, double Latitude)
{
    public double[] Coordinates { get; } = new[] { Longitude, Latitude };
    public string Type { get; } = "Point";
}

public record Meeting(
    string Name,
    string Location,
    string Address,
    string Schedule,
    DateTime Start,
    DateTime End,
    string Remote,
    string MoreInfo)
{
}
