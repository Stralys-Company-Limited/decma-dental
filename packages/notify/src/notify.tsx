import "server-only";
import {
  appointmentIcs,
  formatWhen,
  type Appointment,
} from "@decma/booking";
import { BookingCancelledEmail, BookingConfirmationEmail, BookingReminderEmail } from "./emails/PatientEmails";
import { ClinicBookingAlertEmail } from "./emails/ClinicEmails";
import { bookingConfirmationTemplateId, bookingConfirmationVariables } from "./email/booking-template";
import { clinicNotifyAddress, sendEmail, type SendResult } from "./email/send";
import { emailCopy } from "./email-copy";
import { sendCancellationSms, sendConfirmationSms, sendReminderSms } from "./booking-sms";

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
  const dict = emailCopy(appt.locale);
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
  await Promise.all([sendPatientConfirmation(appt), sendConfirmationSms(appt), notifyClinic(appt, "new")]);
}

/** True when the patient got the reminder by email or SMS. */
export async function sendBookingReminder(appt: Appointment): Promise<boolean> {
  const dict = emailCopy(appt.locale);
  const [email, sms] = await Promise.all([
    sendEmail({
      to: appt.email,
      subject: dict.emails.reminder.subject(formatWhen(new Date(appt.starts_at), appt.locale)),
      react: <BookingReminderEmail appt={appt} />,
    }),
    sendReminderSms(appt),
  ]);
  return email.ok || sms.ok;
}

export async function sendBookingCancellation(appt: Appointment, { byPatient }: { byPatient: boolean }) {
  const dict = emailCopy(appt.locale);
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
    sendCancellationSms(appt),
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
