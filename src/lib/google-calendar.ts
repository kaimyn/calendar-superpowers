import { CalendarEvent } from "./schema";

const CALENDAR_API = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

function toGoogleEvent(event: CalendarEvent, timeZone: string) {
  if (event.allDay || !event.start.includes("T")) {
    const startDate = event.start.split("T")[0];
    const endDate = event.end ? event.end.split("T")[0] : startDate;
    // Google Calendar requires exclusive end dates — advance by 1 day when start === end
    const exclusiveEnd = startDate === endDate
      ? new Date(new Date(startDate + "T00:00:00").getTime() + 86400000).toISOString().split("T")[0]
      : endDate;
    return {
      summary: event.title,
      location: event.location,
      description: event.description,
      start: { date: startDate },
      end: { date: exclusiveEnd },
    };
  }
  return {
    summary: event.title,
    location: event.location,
    description: event.description,
    start: { dateTime: event.start, timeZone },
    end: { dateTime: event.end ?? event.start, timeZone },
  };
}

export async function addEventToCalendar(
  accessToken: string,
  event: CalendarEvent,
  timeZone = "UTC"
): Promise<{ ok: boolean; title: string; link?: string }> {
  try {
    const res = await fetch(CALENDAR_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toGoogleEvent(event, timeZone)),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`[calendar] Failed to add "${event.title}": ${res.status} ${err}`);
      return { ok: false, title: event.title };
    }
    const json = await res.json();
    return { ok: true, title: event.title, link: json.htmlLink as string };
  } catch (e) {
    console.error(`[calendar] Exception adding "${event.title}":`, e);
    return { ok: false, title: event.title };
  }
}
