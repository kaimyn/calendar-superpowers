import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
import { encodeEvents, CalendarEvent } from "@/lib/schema";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://calendar-superpowers.vercel.app";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("events");
  if (!raw) {
    return NextResponse.json({ error: "Missing events parameter" }, { status: 400 });
  }

  let events: CalendarEvent[];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error();
    events = parsed;
  } catch {
    return NextResponse.json({ error: "Invalid events JSON" }, { status: 400 });
  }

  const data = encodeEvents(events);
  return NextResponse.redirect(`${BASE_URL}/events?data=${data}`);
}
