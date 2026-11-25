// Resend template for the patient booking confirmation, one per language.
// Brand values mirror app/globals.css. Variables use Resend's {{{NAME}}} syntax; the app fills them in
// lib/email/booking-template.ts, so keep the keys in VARIABLES in step with that file.

const C = {
  navy: "#223f82",
  navy20: "#d3d9e7",
  navyDeep: "#16295a",
  teal: "#00ada2",
  teal20: "#ccefec",
  tealDeep: "#007a72",
  ink: "#1d1d1b",
  ink80: "#4a4a49",
  page: "#f4f6fa",
};
const SANS = "'Open Sans',Arial,Helvetica,sans-serif";
const DISPLAY = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export const VARIABLES = [
  { key: "CUSTOMER_NAME", type: "string" },
  { key: "SERVICE", type: "string" },
  { key: "APPOINTMENT_DATE", type: "string" },
  { key: "APPOINTMENT_TIME", type: "string" },
  { key: "CLINIC_LOCATION", type: "string" },
  { key: "MAP_URL", type: "string" },
  { key: "APPOINTMENT_NUMBER", type: "string" },
  { key: "MANAGE_URL", type: "string" },
  { key: "ICS_URL", type: "string" },
  { key: "GOOGLE_CALENDAR_URL", type: "string" },
  { key: "OUTLOOK_URL", type: "string" },
  { key: "OFFICE365_URL", type: "string" },
  { key: "CLINIC_PHONE", type: "string" },
];

const COPY = {
  en: {
    name: "DECMA booking confirmation (English)",
    alias: "decma-booking-confirmation-en",
    subject: "Your DECMA Dental Clinic appointment is confirmed",
    preheader: "Your visit is booked. Your appointment number and calendar links are inside.",
    eyebrow: "Booking confirmed",
    heading: "Your visit is booked",
    greeting: "Dear",
    intro: "Thank you for booking with DECMA Dental Clinic. Here are your appointment details.",
    numberLabel: "Your appointment number",
    numberHint: "Keep this number. With your phone number, it lets you check or cancel your appointment online.",
    service: "Service",
    date: "Date",
    time: "Time",
    location: "Location",
    directions: "Get directions",
    manage: "Manage or cancel your booking",
    calendarTitle: "Add to your calendar",
    calendarHint: "The attached invitation (appointment.ics) adds the visit with reminders one day and two hours before.",
    calendars: {
      apple: ["Apple Calendar", "iPhone, iPad and Mac"],
      google: ["Google Calendar", "Android phones and Gmail"],
      outlook: ["Outlook.com", "Personal Outlook and Hotmail"],
      office: ["Microsoft 365", "Work or school Outlook"],
      other: ["Other calendar apps", "Download an .ics file (Samsung, Thunderbird and more)"],
    },
    bring: "If you are using insurance, please bring your insurance card.",
    footer: "Please do not reply with medical details. To change your appointment, use the link above or call us on",
    customerFallback: "Patient",
  },
  sw: {
    name: "DECMA booking confirmation (Kiswahili)",
    alias: "decma-booking-confirmation-sw",
    subject: "Miadi yako DECMA Dental Clinic imethibitishwa",
    preheader: "Miadi yako imepangwa. Namba ya miadi na viungo vya kalenda viko ndani.",
    eyebrow: "Miadi imethibitishwa",
    heading: "Miadi yako imepangwa",
    greeting: "Mpendwa",
    intro: "Asante kwa kupanga miadi na DECMA Dental Clinic. Hizi ni taarifa za miadi yako.",
    numberLabel: "Namba ya miadi yako",
    numberHint: "Hifadhi namba hii. Pamoja na namba yako ya simu, inakuwezesha kuangalia au kughairi miadi mtandaoni.",
    service: "Huduma",
    date: "Tarehe",
    time: "Saa",
    location: "Mahali",
    directions: "Pata maelekezo",
    manage: "Simamia au ghairi miadi yako",
    calendarTitle: "Ongeza kwenye kalenda yako",
    calendarHint: "Mwaliko ulioambatishwa (appointment.ics) unaongeza miadi pamoja na vikumbusho siku moja na saa mbili kabla.",
    calendars: {
      apple: ["Kalenda ya Apple", "iPhone, iPad na Mac"],
      google: ["Google Calendar", "Simu za Android na Gmail"],
      outlook: ["Outlook.com", "Akaunti binafsi za Outlook na Hotmail"],
      office: ["Microsoft 365", "Outlook ya kazini au shuleni"],
      other: ["Kalenda nyingine", "Pakua faili ya .ics (Samsung, Thunderbird na nyingine)"],
    },
    bring: "Kama unatumia bima, tafadhali leta kadi yako ya bima.",
    footer: "Tafadhali usijibu kwa taarifa za kitabibu. Kubadilisha miadi yako, tumia kiungo hapo juu au tupigie",
    customerFallback: "Mgonjwa",
  },
};

const row = (label, value) => `
            <tr>
              <td style="padding:6px 0;width:110px;vertical-align:top;font-family:${SANS};font-size:14px;line-height:22px;font-weight:700;color:${C.navy};">${label}</td>
              <td style="padding:6px 0;vertical-align:top;font-family:${SANS};font-size:14px;line-height:22px;color:${C.ink};">${value}</td>
            </tr>`;

const link = (href, label) =>
  `<a href="${href}" style="color:${C.navy};font-weight:600;text-decoration:underline;">${label}</a>`;

/** Full-width calendar button: brand logo, name and hint, and an arrow (↓ for .ics downloads). */
const calendarButton = (href, icon, [label, hint], download = false) => `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;border:1px solid #c9d0e0;background:#ffffff;">
                <tr>
                  <td width="44" style="padding:10px 0 10px 12px;vertical-align:middle;">
                    <a href="${href}" style="text-decoration:none;"><img src="${icon}" width="28" height="28" alt="" style="display:block;border:0;width:28px;height:28px;"></a>
                  </td>
                  <td style="padding:10px 12px;vertical-align:middle;">
                    <a href="${href}" style="display:block;text-decoration:none;">
                      <span style="display:block;font-family:${SANS};font-size:14px;line-height:20px;font-weight:700;color:${C.navy};">${label}</span>
                      <span style="display:block;font-family:${SANS};font-size:12px;line-height:17px;color:#6b6b69;">${hint}</span>
                    </a>
                  </td>
                  <td width="32" align="right" style="padding:10px 14px 10px 0;vertical-align:middle;">
                    <a href="${href}" style="font-family:${SANS};font-size:16px;font-weight:700;color:${C.navy};text-decoration:none;">${download ? "&darr;" : "&rarr;"}</a>
                  </td>
                </tr>
              </table>`;

function html(locale, logoUrl, siteUrl, assetBase) {
  const t = COPY[locale];
  const icon = (name) => `${assetBase}/brand/calendars/${name}.png`;
  return `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${t.heading}</title>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${C.page};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${t.preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;">
          <tr>
            <td style="background:${C.navy};padding:24px 32px;border-bottom:4px solid ${C.teal};">
              <a href="${siteUrl}"><img src="${logoUrl}" width="150" alt="DECMA Dental Clinic" style="display:block;border:0;width:150px;height:auto;"></a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;">
              <p style="margin:0 0 12px;font-family:${SANS};font-size:11px;line-height:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.tealDeep};">${t.eyebrow}</p>
              <h1 style="margin:0 0 16px;font-family:${DISPLAY};font-size:26px;line-height:32px;font-weight:700;color:${C.navy};">${t.heading}</h1>
              <p style="margin:0 0 12px;font-family:${SANS};font-size:15px;line-height:24px;color:${C.ink80};">${t.greeting} {{{CUSTOMER_NAME}}},</p>
              <p style="margin:0 0 20px;font-family:${SANS};font-size:15px;line-height:24px;color:${C.ink80};">${t.intro}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.teal20};border-left:4px solid ${C.teal};">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-family:${SANS};font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${C.tealDeep};">${t.numberLabel}</p>
                    <p style="margin:4px 0 6px;font-family:${DISPLAY};font-size:26px;line-height:32px;font-weight:700;letter-spacing:1px;color:${C.navy};">{{{APPOINTMENT_NUMBER}}}</p>
                    <p style="margin:0;font-family:${SANS};font-size:13px;line-height:20px;color:${C.navyDeep};">${t.numberHint}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.navy20};">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${row(t.service, "{{{SERVICE}}}")}${row(t.date, "{{{APPOINTMENT_DATE}}}")}${row(t.time, "{{{APPOINTMENT_TIME}}}")}${row(t.location, `{{{CLINIC_LOCATION}}}<br>${link("{{{MAP_URL}}}", t.directions)}`)}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:${C.navy};">
                    <a href="{{{MANAGE_URL}}}" style="display:inline-block;padding:13px 22px;font-family:${SANS};font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">${t.manage}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;border-top:1px solid ${C.navy20};">
              <h2 style="margin:24px 0 8px;font-family:${DISPLAY};font-size:18px;line-height:24px;font-weight:700;color:${C.navy};">${t.calendarTitle}</h2>
              <p style="margin:0 0 16px;font-family:${SANS};font-size:14px;line-height:22px;color:${C.ink80};">${t.calendarHint}</p>${calendarButton("{{{GOOGLE_CALENDAR_URL}}}", icon("google-calendar"), t.calendars.google)}${calendarButton("{{{ICS_URL}}}", icon("apple"), t.calendars.apple, true)}${calendarButton("{{{OUTLOOK_URL}}}", icon("outlook"), t.calendars.outlook)}${calendarButton("{{{OFFICE365_URL}}}", icon("microsoft-365"), t.calendars.office)}${calendarButton("{{{ICS_URL}}}", icon("calendar"), t.calendars.other, true)}
              <p style="margin:20px 0 0;font-family:${SANS};font-size:14px;line-height:22px;color:${C.ink80};">${t.bring}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:${C.page};border-top:4px solid ${C.navy};">
              <p style="margin:0 0 8px;font-family:${SANS};font-size:12px;line-height:18px;color:${C.ink80};">${t.footer} {{{CLINIC_PHONE}}}.</p>
              <p style="margin:0;font-family:${SANS};font-size:12px;line-height:18px;color:${C.ink80};">DECMA Dental Clinic · {{{CLINIC_LOCATION}}}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function text(locale) {
  const t = COPY[locale];
  return [
    `${t.heading}`,
    "",
    `${t.greeting} {{{CUSTOMER_NAME}}},`,
    t.intro,
    "",
    `${t.numberLabel}: {{{APPOINTMENT_NUMBER}}}`,
    t.numberHint,
    "",
    `${t.service}: {{{SERVICE}}}`,
    `${t.date}: {{{APPOINTMENT_DATE}}}`,
    `${t.time}: {{{APPOINTMENT_TIME}}}`,
    `${t.location}: {{{CLINIC_LOCATION}}}`,
    `${t.directions}: {{{MAP_URL}}}`,
    "",
    `${t.manage}: {{{MANAGE_URL}}}`,
    "",
    `${t.calendarTitle}:`,
    `${t.calendars.google[0]}: {{{GOOGLE_CALENDAR_URL}}}`,
    `${t.calendars.apple[0]}: {{{ICS_URL}}}`,
    `${t.calendars.outlook[0]}: {{{OUTLOOK_URL}}}`,
    `${t.calendars.office[0]}: {{{OFFICE365_URL}}}`,
    `${t.calendars.other[0]}: {{{ICS_URL}}}`,
    "",
    t.bring,
    "",
    `${t.footer} {{{CLINIC_PHONE}}}.`,
  ].join("\n");
}

/** Template definitions ready for resend.templates.create / update. */
export function bookingConfirmationTemplates({ logoUrl, siteUrl, assetBase }) {
  return Object.keys(COPY).map((locale) => {
    const t = COPY[locale];
    return {
      locale,
      name: t.name,
      alias: t.alias,
      subject: t.subject,
      html: html(locale, logoUrl, siteUrl, assetBase),
      text: text(locale),
      variables: VARIABLES.map((v) =>
        v.key === "CUSTOMER_NAME"
          ? { ...v, fallbackValue: t.customerFallback }
          : v.key === "CLINIC_PHONE"
            ? { ...v, fallbackValue: "the clinic" }
            : v,
      ),
    };
  });
}
