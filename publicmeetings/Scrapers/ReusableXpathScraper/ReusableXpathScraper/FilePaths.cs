namespace ReusableXpathScraper;

public record FilePaths
{
    public string MeetingSaveFile { get; init; } = String.Empty;
    public string MeetingSaveBaserowFile { get; init; } = String.Empty;
    public string ManualMeetingFile { get; init; } = String.Empty;
    public string ManualCorrectionsFile { get; init; } = String.Empty;
}
