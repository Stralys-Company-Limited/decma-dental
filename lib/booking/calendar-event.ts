import { getDictionaryFor } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/config";
import { buildIcs } from "@/lib/calendar/ics";
import { googleCalendarUrl, office365Url, outlookComUrl } from "@/lib/calendar/links";
import { isPlaceholder, mapsLocation, site } from "@/lib/site";
import { formatReference } from "./reference";
import type { Appointment } from "./types";

export function manageUrl(appt: Pick<Appointment, "manage_token" | "locale">): string {
  return `${site.url}${localePath(appt.locale, `/book/manage/${appt.manage_token}`)}`;
}

export function icsUrl(appt: Pick<Appointment, "manage_token">): string {
  return `${site.url}/api/calendar/${appt.manage_token}`;
}

function eventFor(appt: Appointment) {
  const dict = getDictionaryFor(appt.locale);
  return {
    start: new Date(appt.starts_at),
    end: new Date(appt.ends_at),
    title: dict.emails.calendar.summary,
    description: `${dict.emails.labels.reference}: ${formatReference(appt.reference)}\n${dict.emails.calendar.description(manageUrl(appt))}`,
    location: `${site.name}, ${mapsLocation()}`,
  };
}

export function appointmentIcs(appt: Appointment, { cancelled = false } = {}): string {
  const dict = getDictionaryFor(appt.locale);
  return buildIcs({
    ...eventFor(appt),
    uid: `${appt.id}@decma-dental-clinic`,
    url: manageUrl(appt),
    organizerName: site.name,
    geo: site.geo ?? undefined,
    organizerEmail: isPlaceholder(site.email) ? undefined : site.email,
    reminderText: dict.emails.calendar.reminder,
    cancelled,
    sequence: cancelled ? 1 : 0,
  });
}

export function calendarLinks(appt: Appointment) {
  const e = eventFor(appt);
  return {
    ics: icsUrl(appt),
    google: googleCalendarUrl(e),
    outlook: outlookComUrl(e),
    office: office365Url(e),
  };
}
