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

        return after; ///TODO need to actually parse expression
    }
}

public class CalendarService
{
    public DateTime Now { get; } = DateTime.Now;
}