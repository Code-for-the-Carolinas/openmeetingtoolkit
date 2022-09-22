namespace Scrapers;

public record MeetingCorrection(string OldGovernment, string OldPublicBody, string OldLocation, double Latitude, double Longitude);

public static class MeetingCorrectionHelpers
{
    public static bool Matches(this MeetingCorrection correction, MappableMeeting meeting)
        => correction.OldPublicBody == meeting.Properties.Publicbody
        && correction.OldLocation == meeting.Properties.Location
        && correction.OldGovernment == meeting.Properties.Government;

    public static MappableMeeting Merge(this MappableMeeting meeting, MeetingCorrection correction)
        => meeting with
        {
            Geometry = meeting.Geometry with
            {
                Longitude = correction.Longitude,
                Latitude = correction.Latitude
            }
        };
}