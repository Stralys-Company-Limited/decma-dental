export type CalendarEvent = {
  uid: string;
  start: Date;
  end: Date;
  title: string;
  description: string;
  location: string;
  url?: string;
  /** Exact location, written as the RFC 5545 GEO property. */
  geo?: { lat: number; lng: number };
  organizerName: string;
  organizerEmail?: string;
  /** Alarm text shown by the calendar app. */
  reminderText: string;
  /** Minutes before the start for each reminder. */
  remindersMinutes?: number[];
  sequence?: number;
  cancelled?: boolean;
};

function stamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

/** RFC 5545 line folding: lines longer than 75 octets continue on the next line after a space. */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let current = "";
  let currentBytes = 0;
  for (const ch of line) {
    const size = new TextEncoder().encode(ch).length;
    const limit = parts.length === 0 ? 75 : 74;
    if (currentBytes + size > limit) {
      parts.push(current);
      current = "";
      currentBytes = 0;
    }
    current += ch;
    currentBytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

function minutesToTrigger(minutes: number): string {
  if (minutes % 1440 === 0) return `-P${minutes / 1440}D`;
  if (minutes % 60 === 0) return `-PT${minutes / 60}H`;
  return `-PT${minutes}M`;
}

/** Builds an .ics calendar file. Works with Apple Calendar, Outlook, Google, Samsung, Thunderbird and others. */
export function buildIcs(event: CalendarEvent): string {
  const reminders = event.remindersMinutes ?? [24 * 60, 120];
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DECMA Dental Clinic//Online booking//EN",
    "CALSCALE:GREGORIAN",
    `METHOD:${event.cancelled ? "CANCEL" : "PUBLISH"}`,
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(event.start)}`,
    `DTEND:${stamp(event.end)}`,
    `SEQUENCE:${event.sequence ?? 0}`,
    `STATUS:${event.cancelled ? "CANCELLED" : "CONFIRMED"}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    ...(event.geo ? [`GEO:${event.geo.lat};${event.geo.lng}`] : []),
    ...(event.url ? [`URL:${event.url}`] : []),
    ...(event.organizerEmail
      ? [`ORGANIZER;CN=${escapeText(event.organizerName)}:mailto:${event.organizerEmail}`]
      : []),
    "TRANSP:OPAQUE",
    ...(event.cancelled
      ? []
      : reminders.flatMap((m) => [
          "BEGIN:VALARM",
          "ACTION:DISPLAY",
          `DESCRIPTION:${escapeText(event.reminderText)}`,
          `TRIGGER:${minutesToTrigger(m)}`,
          "END:VALARM",
        ])),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
