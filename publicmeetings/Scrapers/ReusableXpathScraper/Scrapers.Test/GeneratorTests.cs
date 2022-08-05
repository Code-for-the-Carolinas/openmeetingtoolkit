using Xunit;
using Scrapers;
using FluentAssertions;
using Xunit.Abstractions;

namespace Scrapers.Test;

public class GeneratorTests : TestLogger
{
    public GeneratorTests(ITestOutputHelper testOutput)
        : base(testOutput)
    {
    }

    [Fact]
    public void AsheTest()
    {
        var meetings = NorthCarolinaGenerators.Ashe(new DateOnly(2022, 1, 1), new DateOnly(2023, 1, 1))
            .ToList();
        Log(meetings);
        meetings.Count.Should().Be(24);
    }
}
