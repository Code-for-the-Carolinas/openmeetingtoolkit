using Ical.Net;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;

namespace Scrapers;

public static class NorthCarolinaGenerators
{
    public static IEnumerable<ScrapedMeeting> Ashe(DateOnly start, DateOnly end)
    {
        //The Ashe County Board of Commissioners holds regular meetings on the first and third Monday of each month at 9:00 a.m.
        //If a regular meeting is a holiday on which county offices are closed, the meeting will be held on the next business day.
        var meetingTime = new TimeOnly(9, 0);//24 hour time
        var startDateTime = start.ToDateTime(meetingTime);
        var endDateTime = end.ToDateTime(meetingTime);

        var schedule = new RecurrencePattern(FrequencyType.Monthly) {
            ByDay = new List<WeekDay> {
                new WeekDay(DayOfWeek.Monday, 1),
                new WeekDay(DayOfWeek.Monday, 3)
            }
        };

        var meeting = new CalendarEvent()
        {
            Start = new CalDateTime(startDateTime),
            End = new CalDateTime(endDateTime),
    };
        meeting.RecurrenceRules.Add(schedule);
        //meeting.ExceptionDates.Add(new RecurrencePattern); 

        var calendar = new Calendar();
        calendar.Events.Add(meeting);
        var dates = calendar.GetOccurrences(startDateTime, endDateTime)
            .Skip(1); //the first one is always the start date which is actually expected to be a exclusive range

        
        return dates.Select(d=>
        new ScrapedMeeting("Ashe", "Commissioner Meeting",
        "150 Government Circle Suite 2500 Jefferson, NC 28640", //Commissioners Meeting Room (small courtroom) on the third floor
        d.Period.StartTime.ToString()!,
        "https://www.ashecountygov.com/commissioners/commissioner-meetings"));
    }
}
