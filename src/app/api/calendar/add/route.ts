import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addEventToCalendar } from "@/lib/google-calendar";
import { CalendarEvent } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { events, timeZone } = (await req.json()) as { events: CalendarEvent[]; timeZone?: string };
  if (!Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ error: "No events provided" }, { status: 400 });
  }

  const results = await Promise.all(
    events.map((event) => addEventToCalendar(session.accessToken!, event, timeZone))
  );

  return NextResponse.json({ results });
}
