"use client";

import React from "react";
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

function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(iso: string): string {
  return parseLocalDate(iso).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function isMultiDay(start: string, end: string): boolean {
  return start.split("T")[0] !== end.split("T")[0];
}

function renderDateRange(event: CalendarEvent): React.ReactNode {
  const allDay = event.allDay || isDateOnly(event.start);

  if (allDay) {
    const hasEnd = event.end && isMultiDay(event.start, event.end);
    if (hasEnd) {
      return (
        <span className="inline-flex items-center gap-1">
          <span className="rounded-full bg-violet-100 text-violet-700 text-xs font-medium px-2 py-0.5">Multi-day</span>
          <span>{formatDate(event.start)} → {formatDate(event.end!)}</span>
        </span>
      );
    }
    return <span>{formatDate(event.start)}</span>;
  }

  return (
    <>
      <span>{formatDateTime(event.start)}</span>
      {event.end && <span>→ {formatDateTime(event.end)}</span>}
    </>
  );
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
            <div className="flex items-center gap-1 flex-wrap">
              <span>📅</span>
              {renderDateRange(event)}
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
