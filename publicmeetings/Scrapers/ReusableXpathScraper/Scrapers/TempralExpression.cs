using System.Globalization;

namespace Scrapers;

public class TempralExpression
{
    public string Raw { get; init; }

    public TempralExpression(string timeExpression)
	{
        Raw = timeExpression;
    }

    public DateTime? NextOccurance(DateTime after)
    {
        if(DateTime.TryParse(Raw, out var rawAsDate))
        {
            if (rawAsDate < after)
                return null;
            return rawAsDate;
        }
        else if(DateTime.TryParseExact(Raw, "M/d/yyyy h:mm:ss tt \"America/New_York\"", CultureInfo.CurrentCulture, DateTimeStyles.AllowWhiteSpaces, out var longDate))
        {//        12/24/2012 12:00:00 AM America/New_York
            if (longDate < after)
                return null;
            return longDate;
        }

        return after; ///TODO need to actually parse expression
    }
}

public class CalendarService
{
    public DateTime Now { get; } = DateTime.Now;
}