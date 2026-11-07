import { Button, Heading, Link, Text } from "@react-email/components";
import { getDictionaryFor } from "@/lib/i18n/dictionaries";
import { formatDay, formatTime } from "@/lib/booking/time";
import { formatReference } from "@/lib/booking/reference";
import { calendarLinks, manageUrl } from "@/lib/booking/calendar-event";
import { fullAddress, site } from "@/lib/site";
import { localePath } from "@/lib/i18n/config";
import type { Appointment } from "@/lib/booking/types";
import { colors, DetailsTable, EmailLayout, textStyle } from "./EmailLayout";

const headingStyle = { color: colors.navy, fontSize: "24px", margin: "0 0 16px", fontFamily: "Helvetica, Arial, sans-serif" };
const buttonStyle = {
  backgroundColor: colors.navy,
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 600,
  padding: "12px 20px",
  textDecoration: "none",
};
const linkStyle = { color: colors.navy, fontSize: "14px", textDecoration: "underline" };

function details(appt: Appointment) {
  const dict = getDictionaryFor(appt.locale);
  const start = new Date(appt.starts_at);
  const l = dict.emails.labels;
  return [
    [l.reference, formatReference(appt.reference)],
    [l.day, formatDay(start, appt.locale)],
    [l.time, `${formatTime(start, appt.locale)} EAT`],
    [l.where, fullAddress()],
    [l.type, dict.appointmentTypes[appt.appointment_type]],
  ] as [string, string][];
}

export function BookingConfirmationEmail({ appt }: { appt: Appointment }) {
  const dict = getDictionaryFor(appt.locale);
  const e = dict.emails;
  const links = calendarLinks(appt);
  return (
    <EmailLayout lang={appt.locale} preview={e.confirmation.preview} footer={e.footer(site.phone)}>
      <Heading style={headingStyle}>{e.confirmation.heading}</Heading>
      <Text style={textStyle}>{e.greeting(appt.full_name)}</Text>
      <Text style={textStyle}>{e.confirmation.intro}</Text>
      <DetailsTable rows={details(appt)} />
      <Heading as="h2" style={{ ...headingStyle, fontSize: "18px" }}>
        {e.confirmation.addToCalendar}
      </Heading>
      <Text style={textStyle}>{e.confirmation.calendarHint}</Text>
      <Text style={{ ...textStyle, margin: "0 0 24px" }}>
        <Link href={links.google} style={linkStyle}>{dict.booking.confirmed.calendars.google.label}</Link>
        {"  ·  "}
        <Link href={links.outlook} style={linkStyle}>{dict.booking.confirmed.calendars.outlook.label}</Link>
        {"  ·  "}
        <Link href={links.office} style={linkStyle}>{dict.booking.confirmed.calendars.office.label}</Link>
        {"  ·  "}
        <Link href={links.ics} style={linkStyle}>.ics</Link>
      </Text>
      <Text style={textStyle}>{e.confirmation.bring}</Text>
      <Button href={manageUrl(appt)} style={buttonStyle}>
        {e.manage}
      </Button>
    </EmailLayout>
  );
}

export function BookingReminderEmail({ appt }: { appt: Appointment }) {
  const dict = getDictionaryFor(appt.locale);
  const e = dict.emails;
  return (
    <EmailLayout lang={appt.locale} preview={e.reminder.preview} footer={e.footer(site.phone)}>
      <Heading style={headingStyle}>{e.reminder.heading}</Heading>
      <Text style={textStyle}>{e.greeting(appt.full_name)}</Text>
      <Text style={textStyle}>{e.reminder.intro}</Text>
      <DetailsTable rows={details(appt)} />
      <Text style={textStyle}>{e.confirmation.bring}</Text>
      <Button href={manageUrl(appt)} style={buttonStyle}>
        {e.manage}
      </Button>
    </EmailLayout>
  );
}

export function BookingCancelledEmail({ appt }: { appt: Appointment }) {
  const dict = getDictionaryFor(appt.locale);
  const e = dict.emails;
  return (
    <EmailLayout lang={appt.locale} preview={e.cancelled.preview} footer={e.footer(site.phone)}>
      <Heading style={headingStyle}>{e.cancelled.heading}</Heading>
      <Text style={textStyle}>{e.greeting(appt.full_name)}</Text>
      <Text style={textStyle}>{e.cancelled.intro}</Text>
      <DetailsTable rows={details(appt)} />
      <Button href={`${site.url}${localePath(appt.locale, "/book")}`} style={buttonStyle}>
        {e.cancelled.rebook}
      </Button>
    </EmailLayout>
  );
}
