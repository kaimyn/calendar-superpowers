import { CalendarEvent } from "./schema";

const CALENDAR_API = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

function toGoogleEvent(event: CalendarEvent, timeZone: string) {
  if (event.allDay) {
    const date = event.start.split("T")[0];
    return {
      summary: event.title,
      location: event.location,
      description: event.description,
      start: { date },
      end: { date: event.end ? event.end.split("T")[0] : date },
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
): Promise<{ ok: boolean; title: string }> {
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
    }
    return { ok: res.ok, title: event.title };
  } catch (e) {
    console.error(`[calendar] Exception adding "${event.title}":`, e);
    return { ok: false, title: event.title };
  }
}
