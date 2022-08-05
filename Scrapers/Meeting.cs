namespace Scrapers;

public record Meeting(string Name, string Location, string Time, string MoreInfo)
{
    //TODO any more fields? maybe more info url/blurb?
    //TODO parse strings to get at better representations ie Time could be some sort of list of DateTimes or the temporal expression that generates them, Location could be an address or even long&lat

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
