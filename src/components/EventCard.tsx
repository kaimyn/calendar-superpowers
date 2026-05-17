"use client";

import { CalendarEvent } from "@/lib/schema";

type Props = {
  event: CalendarEvent;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onEdit: (updated: CalendarEvent) => void;
};

function isDateOnly(iso: string) {
  return !iso.includes("T");
}

function formatDateTime(iso: string, allDay?: boolean): string {
  if (allDay || isDateOnly(iso)) {
    // Parse date-only strings as local date to avoid UTC-offset shifting the day
    const [year, month, day] = iso.split("T")[0].split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }
  const date = new Date(iso);
  return date.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function EventCard({ event, checked, onChange, onEdit }: Props) {
  return (
    <div className={`rounded-xl border p-4 transition-colors ${checked ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={event.title}
            onChange={(e) => onEdit({ ...event, title: e.target.value })}
            className="w-full text-base font-semibold text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0"
            placeholder="Event title"
          />
          <div className="mt-1 space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{formatDateTime(event.start, event.allDay)}</span>
              {event.end && !event.allDay && !isDateOnly(event.start) && (
                <span>→ {formatDateTime(event.end)}</span>
              )}
            </div>
            {event.location && (
              <div className="flex items-center gap-1">
                <span>📍</span>
                <input
                  type="text"
                  value={event.location}
                  onChange={(e) => onEdit({ ...event, location: e.target.value })}
                  className="bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
                  placeholder="Location"
                />
              </div>
            )}
            {event.description && (
              <div className="flex items-start gap-1">
                <span>📝</span>
                <textarea
                  value={event.description}
                  onChange={(e) => onEdit({ ...event, description: e.target.value })}
                  className="bg-transparent border-none outline-none focus:ring-0 p-0 w-full resize-none text-sm"
                  rows={2}
                  placeholder="Description"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
