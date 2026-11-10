import "server-only";
import { getDictionaryFor } from "@/lib/i18n/dictionaries";
import { clinicNotifyAddress, sendEmail, type SendResult } from "@/lib/email/send";
import { bookingConfirmationTemplateId, bookingConfirmationVariables } from "@/lib/email/booking-template";
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

/**
 * Patient confirmation: uses the published Resend template for the booking's language when one is
 * configured, otherwise the React Email version. The .ics invitation is attached either way.
 */
export async function sendPatientConfirmation(appt: Appointment): Promise<SendResult> {
  const dict = getDictionaryFor(appt.locale);
  const subject = dict.emails.confirmation.subject(formatWhen(new Date(appt.starts_at), appt.locale));
  const attachments = [icsAttachment(appointmentIcs(appt))];
  const templateId = bookingConfirmationTemplateId(appt.locale);

  return templateId
    ? sendEmail({
        to: appt.email,
        subject,
        attachments,
        template: { id: templateId, variables: bookingConfirmationVariables(appt) },
      })
    : sendEmail({ to: appt.email, subject, attachments, react: <BookingConfirmationEmail appt={appt} /> });
}

export async function sendBookingConfirmation(appt: Appointment) {
  await Promise.all([sendPatientConfirmation(appt), notifyClinic(appt, "new")]);
}

export async function sendBookingReminder(appt: Appointment): Promise<boolean> {
  const dict = getDictionaryFor(appt.locale);
  const result = await sendEmail({
    to: appt.email,
    subject: dict.emails.reminder.subject(formatWhen(new Date(appt.starts_at), appt.locale)),
    react: <BookingReminderEmail appt={appt} />,
  });
  return result.ok;
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
    byPatient ? notifyClinic(appt, "cancelled") : Promise.resolve(),
  ]);
}

async function notifyClinic(appt: Appointment, kind: "new" | "cancelled") {
  const to = clinicNotifyAddress();
  if (!to) return;
  const when = formatWhen(new Date(appt.starts_at), "en");
  await sendEmail({
    to,
    replyTo: appt.email,
    subject: kind === "new" ? `New booking: ${when}, ${appt.full_name}` : `Cancelled: ${when}, ${appt.full_name}`,
    react: <ClinicBookingAlertEmail appt={appt} kind={kind} />,
  });
}
