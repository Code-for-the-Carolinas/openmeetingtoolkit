using Xunit.Abstractions;

namespace Scrapers.Test;

public abstract class TestLogger
{
    protected ITestOutputHelper TestConsole;

    protected TestLogger(ITestOutputHelper testOutput)
    {
        TestConsole = testOutput;
    }
    protected void Log(string? message) => TestConsole.WriteLine(message);

    protected void Log(IEnumerable<object> messages)
    {
        var i = 0;
        foreach (var meeting in messages)
        {
            Log( i++ + meeting?.ToString()
                ?.Replace("\n", "\\n"));
        }
    }
}