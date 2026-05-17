export type CalendarEvent = {
  title: string;
  start: string;       // ISO 8601 e.g. "2026-06-15T18:00:00"
  end?: string;        // ISO 8601; omit for all-day or unknown duration
  location?: string;
  description?: string;
  allDay?: boolean;
};

export function encodeEvents(events: CalendarEvent[]): string {
  const json = JSON.stringify(events);
  // UTF-8 safe base64url: handles accented chars, emoji, etc.
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeEvents(data: string): CalendarEvent[] {
  try {
    // Restore standard base64 from base64url
    const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = decodeURIComponent(escape(atob(padded)));
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) throw new Error("Expected array");
    return parsed as CalendarEvent[];
  } catch {
    return [];
  }
}

export function buildEventLink(baseUrl: string, events: CalendarEvent[]): string {
  const data = encodeEvents(events);
  return `${baseUrl}/events?data=${data}`;
}
