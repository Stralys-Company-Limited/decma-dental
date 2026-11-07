import "server-only";
import { getDictionaryFor } from "@/lib/i18n/dictionaries";
import { clinicNotifyAddress, sendEmail } from "@/lib/email/send";
import { BookingCancelledEmail, BookingConfirmationEmail, BookingReminderEmail } from "@/emails/PatientEmails";
import { ClinicBookingAlertEmail } from "@/emails/ClinicEmails";
import { appointmentIcs } from "./calendar-event";
import { formatWhen } from "./time";
import type { Appointment } from "./types";

const icsAttachment = (content: string) => ({
  filename: "appointment.ics",
  content,
  contentType: "text/calendar; charset=utf-8; method=PUBLISH",
});

export async function sendBookingConfirmation(appt: Appointment) {
  const dict = getDictionaryFor(appt.locale);
  const when = formatWhen(new Date(appt.starts_at), appt.locale);
  await Promise.all([
    sendEmail({
      to: appt.email,
      subject: dict.emails.confirmation.subject(when),
      react: <BookingConfirmationEmail appt={appt} />,
      attachments: [icsAttachment(appointmentIcs(appt))],
    }),
    notifyClinic(appt, "new"),
  ]);
}

export async function sendBookingReminder(appt: Appointment): Promise<boolean> {
  const dict = getDictionaryFor(appt.locale);
  return sendEmail({
    to: appt.email,
    subject: dict.emails.reminder.subject(formatWhen(new Date(appt.starts_at), appt.locale)),
    react: <BookingReminderEmail appt={appt} />,
  });
}

export async function sendBookingCancellation(appt: Appointment, { byPatient }: { byPatient: boolean }) {
  const dict = getDictionaryFor(appt.locale);
  await Promise.all([
    sendEmail({
      to: appt.email,
      subject: dict.emails.cancelled.subject,
      react: <BookingCancelledEmail appt={appt} />,
      attachments: [
        {
          ...icsAttachment(appointmentIcs(appt, { cancelled: true })),
          contentType: "text/calendar; charset=utf-8; method=CANCEL",
        },
      ],
    }),
    byPatient ? notifyClinic(appt, "cancelled") : Promise.resolve(false),
  ]);
}

async function notifyClinic(appt: Appointment, kind: "new" | "cancelled") {
  const to = clinicNotifyAddress();
  if (!to) return false;
  const when = formatWhen(new Date(appt.starts_at), "en");
  return sendEmail({
    to,
    replyTo: appt.email,
    subject: kind === "new" ? `New booking: ${when}, ${appt.full_name}` : `Cancelled: ${when}, ${appt.full_name}`,
    react: <ClinicBookingAlertEmail appt={appt} kind={kind} />,
  });
}
