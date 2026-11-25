type LinkEvent = { start: Date; end: Date; title: string; description: string; location: string };

function compact(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function googleCalendarUrl(e: LinkEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${compact(e.start)}/${compact(e.end)}`,
    details: e.description,
    location: e.location,
    ctz: "Africa/Dar_es_Salaam",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function outlookParams(e: LinkEvent): string {
  return new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: e.title,
    startdt: e.start.toISOString(),
    enddt: e.end.toISOString(),
    body: e.description,
    location: e.location,
  }).toString();
}

export function outlookComUrl(e: LinkEvent): string {
  return `https://outlook.live.com/calendar/0/action/compose?${outlookParams(e)}`;
}

export function office365Url(e: LinkEvent): string {
  return `https://outlook.office.com/calendar/0/action/compose?${outlookParams(e)}`;
}
