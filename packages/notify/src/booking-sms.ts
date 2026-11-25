import "server-only";
import { formatInTimeZone } from "date-fns-tz";
import {
  CLINIC_TIME_ZONE,
  clinicTimeLabel,
  formatReference,
  isPlaceholder,
  site,
  type Appointment,
} from "@decma/booking";
import { sendSms, type SmsResult } from "./sms/send";

// Plain characters only: one emoji or accented letter switches the SMS to Unicode and halves its length.

/** e.g. "Mon 16 Nov at 10:30 AM", in clinic time. */
function shortWhen(appt: Appointment): string {
  const start = new Date(appt.starts_at);
  return `${formatInTimeZone(start, CLINIC_TIME_ZONE, "EEE d MMM")} at ${clinicTimeLabel(start)}`;
}

const checkPage = () => `${site.url.replace(/^https?:\/\//, "")}/book/check`;

const callLine = () => (isPlaceholder(site.phone) ? "" : ` Questions? Call ${site.phone}.`);

const send = (appt: Appointment, kind: string, text: string): Promise<SmsResult> =>
  sendSms({ to: appt.phone, text, reference: `decma-${kind}-${appt.reference}` });

export function sendConfirmationSms(appt: Appointment) {
  return send(
    appt,
    "booked",
    `${site.name}: your appointment is booked for ${shortWhen(appt)}. Appointment no. ${formatReference(appt.reference)}. Check or cancel: ${checkPage()}`,
  );
}

export function sendReminderSms(appt: Appointment) {
  return send(
    appt,
    "reminder",
    `Reminder from ${site.name}: your appointment is on ${shortWhen(appt)}. Appointment no. ${formatReference(appt.reference)}.${callLine()}`,
  );
}

export function sendCancellationSms(appt: Appointment) {
  return send(
    appt,
    "cancelled",
    `${site.name}: your appointment on ${shortWhen(appt)} (no. ${formatReference(appt.reference)}) has been cancelled. To book again: ${site.url.replace(/^https?:\/\//, "")}/book`,
  );
}
