namespace Scrapers;

public record Meeting(string Name, string Location, string Time, string MoreInfo)
{
    //TODO any more fields? maybe more info url/blurb?
    //TODO parse strings to get at better representations ie Time could be some sort of list of DateTimes or the temporal expression that generates them, Location could be an address or even long&lat
}
