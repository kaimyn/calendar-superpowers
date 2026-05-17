import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { buildEventLink, CalendarEvent } from "@/lib/schema";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://calendar-superpowers.vercel.app";

const CalendarEventSchema = z.object({
  title: z.string().describe("Event title"),
  start: z.string().describe("Start date/time in ISO 8601 format, e.g. 2026-06-15T18:00:00"),
  end: z.string().optional().describe("End date/time in ISO 8601 format (optional)"),
  location: z.string().optional().describe("Location of the event (optional)"),
  description: z.string().optional().describe("Event description or notes (optional)"),
  allDay: z.boolean().optional().describe("True if this is an all-day event (optional)"),
});

function createMcpServer() {
  const server = new McpServer({
    name: "calendar-superpowers",
    version: "1.0.0",
  });

  server.tool(
    "create_calendar_link",
    "Generate a URL that opens a calendar event review UI pre-populated with the given events. " +
      "Use this after extracting event data from an image, document, or conversation. " +
      "The user taps the returned URL to review, edit, and add the events to their Google Calendar.",
    { events: z.array(CalendarEventSchema).min(1).describe("List of calendar events to include in the link") },
    async ({ events }) => {
      const url = buildEventLink(BASE_URL, events as CalendarEvent[]);
      return { content: [{ type: "text", text: url }] };
    }
  );

  return server;
}

async function handle(req: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
    enableJsonResponse: true,
  });
  const server = createMcpServer();
  await server.connect(transport);
  return transport.handleRequest(req);
}

export const POST = handle;
export const GET = handle;
export const DELETE = handle;
