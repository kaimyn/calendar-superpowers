"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CalendarEvent, decodeEvents } from "@/lib/schema";
import EventCard from "@/components/EventCard";

function EventsContent() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [status, setStatus] = useState<"idle" | "adding" | "done" | "error">("idle");
  const [results, setResults] = useState<{ title: string; ok: boolean; link?: string; error?: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = searchParams.get("data");
    if (!data) return;
    const decoded = decodeEvents(data);
    setEvents(decoded);
    setChecked(decoded.map(() => true));
  }, [searchParams]);

  const selected = events.filter((_, i) => checked[i]);

  function updateEvent(index: number, updated: CalendarEvent) {
    setEvents((prev) => prev.map((e, i) => (i === index ? updated : e)));
  }

  function toggleAll(value: boolean) {
    setChecked(events.map(() => value));
  }

  async function addToCalendar() {
    setStatus("adding");
    setError(null);
    try {
      const res = await fetch("/api/calendar/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: selected,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      if (res.status === 401) {
        window.location.href = `/api/auth/reauth?callbackUrl=${encodeURIComponent(window.location.href)}`;
        return;
      }
      const json = await res.json();
      setResults(json.results ?? []);
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold text-gray-700">No events found</p>
          <p className="text-sm text-gray-500">The link may be malformed or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add to Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">
            {events.length} event{events.length !== 1 ? "s" : ""} found. Review and select which to add.
          </p>
        </div>

        {status === "done" ? (
          <div className="space-y-3">
            {results.map((r) => (
              <div key={r.title} className={`flex items-center gap-2 rounded-xl border p-4 ${r.ok ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
                <span>{r.ok ? "✅" : "❌"}</span>
                <span className="text-sm font-medium text-gray-800">{r.title}</span>
                {r.ok && r.link
                  ? <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline ml-auto">View →</a>
                  : <span className="text-sm text-gray-500 ml-auto">{r.ok ? "Added" : (r.error ?? "Failed")}</span>
                }
              </div>
            ))}
            <p className="text-sm text-gray-500 text-center pt-2">You can close this page.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <button onClick={() => toggleAll(true)} className="hover:text-blue-600">Select all</button>
              <span>{selected.length} of {events.length} selected</span>
              <button onClick={() => toggleAll(false)} className="hover:text-blue-600">Deselect all</button>
            </div>

            <div className="space-y-3">
              {events.map((event, i) => (
                <EventCard
                  key={i}
                  event={event}
                  checked={checked[i]}
                  onChange={(val) => setChecked((prev) => prev.map((c, j) => (j === i ? val : c)))}
                  onEdit={(updated) => updateEvent(i, updated)}
                />
              ))}
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <button
              onClick={addToCalendar}
              disabled={selected.length === 0 || status === "adding"}
              className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold text-base hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === "adding" ? "Adding…" : `Add ${selected.length} event${selected.length !== 1 ? "s" : ""} to Google Calendar`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense>
      <EventsContent />
    </Suspense>
  );
}
