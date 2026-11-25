import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { Appointment } from "@decma/booking/types";
import { formatDay, formatTime } from "@decma/booking/time";
import { formatReference } from "@decma/booking/reference";
import { fullAddress } from "@decma/booking/site";

export function AppointmentDetails({
  appt,
  dict,
  locale,
  showStatus = false,
}: {
  appt: Appointment;
  dict: Dictionary;
  locale: Locale;
  showStatus?: boolean;
}) {
  const start = new Date(appt.starts_at);
  const l = dict.emails.labels;
  const rows: [string, string][] = [
    [l.reference, formatReference(appt.reference)],
    [l.day, formatDay(start, locale)],
    [l.time, formatTime(start)],
    [l.where, fullAddress()],
    [l.type, dict.appointmentTypes[appt.appointment_type]],
  ];
  if (showStatus) rows.push([dict.booking.manage.status, dict.booking.manage.statuses[appt.status]]);

  return (
    <dl className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-3 bg-navy-20 p-6 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="font-bold text-navy">{k}</dt>
          <dd className="text-ink-80">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
