import { Button, Heading, Text } from "@react-email/components";
import { formatReference, formatWhen, site, type Appointment } from "@decma/booking";
import { emailCopy } from "../email-copy";
import { colors, DetailsTable, EmailLayout, textStyle } from "./EmailLayout";

// Staff notifications are always in English.
const en = emailCopy("en");
const headingStyle = { color: colors.navy, fontSize: "22px", margin: "0 0 16px", fontFamily: "Helvetica, Arial, sans-serif" };
const adminButton = { backgroundColor: colors.navy, color: "#ffffff", fontSize: "14px", fontWeight: 600, padding: "12px 20px", textDecoration: "none" };

function clinicDeskUrl() {
  return (process.env.CLINIC_URL || "https://clinic.decma.co.tz").replace(/\/$/, "");
}

function AdminLink() {
  return (
    <Button href={clinicDeskUrl()} style={adminButton}>
      Open the clinic desk
    </Button>
  );
}

export function ClinicBookingAlertEmail({ appt, kind }: { appt: Appointment; kind: "new" | "cancelled" }) {
  const title = kind === "new" ? "New online booking" : "Booking cancelled by patient";
  return (
    <EmailLayout lang="en" preview={`${title}: ${formatWhen(new Date(appt.starts_at), "en")}`}>
      <Heading style={headingStyle}>{title}</Heading>
      <DetailsTable
        rows={[
          ["Appointment no.", formatReference(appt.reference)],
          ["When", formatWhen(new Date(appt.starts_at), "en")],
          ["Name", appt.full_name],
          ["Phone", appt.phone],
          ["Email", appt.email],
          ["Appointment type", en.appointmentTypes[appt.appointment_type]],
          ["Language", appt.locale === "sw" ? "Kiswahili" : "English"],
        ]}
      />
      <AdminLink />
    </EmailLayout>
  );
}

export function CallbackAlertEmail({
  fullName,
  phone,
  appointmentType,
  preferredDate,
  locale,
}: {
  fullName: string;
  phone: string;
  appointmentType: string;
  preferredDate: string | null;
  locale: string;
}) {
  return (
    <EmailLayout lang="en" preview={`Call-back request from ${fullName}`}>
      <Heading style={headingStyle}>New call-back request</Heading>
      <DetailsTable
        rows={[
          ["Name", fullName],
          ["Phone", phone],
          ["Appointment type", appointmentType],
          ["Preferred date", preferredDate ?? "Not given"],
          ["Language", locale === "sw" ? "Kiswahili" : "English"],
        ]}
      />
      <AdminLink />
    </EmailLayout>
  );
}

export function ReferralAlertEmail({
  practitionerName,
  practice,
  phone,
  email,
  message,
}: {
  practitionerName: string;
  practice: string;
  phone: string;
  email: string;
  message: string;
}) {
  return (
    <EmailLayout lang="en" preview={`Referrals desk enquiry from ${practitionerName}`}>
      <Heading style={headingStyle}>Referrals desk enquiry</Heading>
      <DetailsTable
        rows={[
          ["Name", practitionerName],
          ["Practice", practice],
          ["Phone", phone],
          ["Email", email],
        ]}
      />
      <Text style={{ ...textStyle, whiteSpace: "pre-wrap" }}>{message}</Text>
      <AdminLink />
    </EmailLayout>
  );
}
