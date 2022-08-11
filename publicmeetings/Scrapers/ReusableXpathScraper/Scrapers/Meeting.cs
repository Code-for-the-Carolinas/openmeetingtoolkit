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
    /*
           {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [-82.54826026293046, 35.598922154690385]
            },
            'properties': {
            	'government': 'Asheville-Buncombe County',
              'publicbody': 'AB Tech/Buncombe County Joint Capital Advisory Committee',
              'location': 'County Administration Building',
              'address': '200 College Street, Asheville, NC 28801',
              'schedule': 'As needed',
              'start': '',
              'end': '',
              'remote':'Zoom',
              'id':'3'
            }
     */

}
