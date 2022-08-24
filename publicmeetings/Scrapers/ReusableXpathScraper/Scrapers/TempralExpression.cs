namespace Scrapers;

public class TempralExpression
{
    public string Raw { get; init; }

    public TempralExpression(string timeExpression)
	{
        Raw = timeExpression;
    }

    public DateTime NextOccurance(DateTime after)
    {
        if(DateTime.TryParse(Raw, out var rawAsDate))
            return rawAsDate;

        return after; //todo
    }
}
