import "server-only";
import {
  calendarLinks,
  formatDay,
  formatReference,
  formatTime,
  fullAddress,
  manageUrl,
  mapsUrl,
  site,
  type Appointment,
  type Locale,
} from "@decma/booking";
import { emailCopy } from "../email-copy";

/**
 * Published Resend template for the patient booking confirmation, per language (created by
 * `npm run email:templates`). When unset, the React Email version is sent instead.
 */
export function bookingConfirmationTemplateId(locale: Locale): string | undefined {
  const id =
    locale === "sw"
      ? process.env.RESEND_TEMPLATE_BOOKING_CONFIRMATION_SW
      : process.env.RESEND_TEMPLATE_BOOKING_CONFIRMATION_EN;
  return id || undefined;
}

/** Resend inserts variables into the HTML as-is, so angle brackets are removed from patient-entered text. */
const plain = (value: string) => value.replace(/[<>]/g, "").trim();

/** Values for the variables in scripts/resend/booking-confirmation-template.mjs (keep the keys in step). */
export function bookingConfirmationVariables(appt: Appointment): Record<string, string> {
  const dict = emailCopy(appt.locale);
  const start = new Date(appt.starts_at);
  const links = calendarLinks(appt);
  return {
    CUSTOMER_NAME: plain(appt.full_name),
    SERVICE: dict.appointmentTypes[appt.appointment_type],
    APPOINTMENT_DATE: formatDay(start, appt.locale),
    APPOINTMENT_TIME: formatTime(start),
    CLINIC_LOCATION: `${fullAddress()} (${site.address.plusCode})`,
    MAP_URL: mapsUrl(),
    APPOINTMENT_NUMBER: formatReference(appt.reference),
    MANAGE_URL: manageUrl(appt),
    ICS_URL: links.ics,
    GOOGLE_CALENDAR_URL: links.google,
    OUTLOOK_URL: links.outlook,
    OFFICE365_URL: links.office,
    CLINIC_PHONE: site.phone,
  };
}
