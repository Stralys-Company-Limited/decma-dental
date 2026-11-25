import type { AppointmentType, Locale } from "@decma/booking";

const appointmentTypesEn: Record<AppointmentType, string> = {
  "new-patient": "New patient / first visit",
  "check-up": "Check-up and cleaning",
  toothache: "Toothache / urgent",
  fillings: "Fillings / root canal",
  cosmetic: "Cosmetic dentistry",
  orthodontics: "Orthodontics",
  implants: "Dental implants",
  children: "Paediatric dentistry",
};

const appointmentTypesSw: Record<AppointmentType, string> = {
  "new-patient": "Mgonjwa mpya / ziara ya kwanza",
  "check-up": "Ukaguzi na usafi",
  toothache: "Maumivu ya jino / dharura",
  fillings: "Kujaza / mizizi",
  cosmetic: "Urembo wa meno",
  orthodontics: "Mirekebisho ya meno",
  implants: "Vipandikizi vya meno",
  children: "Tiba ya meno kwa watoto",
};

const calendarsEn = {
  apple: { label: "Apple Calendar", hint: "iPhone, iPad and Mac" },
  google: { label: "Google Calendar", hint: "Android phones and Gmail" },
  outlook: { label: "Outlook.com", hint: "Personal Outlook and Hotmail" },
  office: { label: "Microsoft 365", hint: "Work or school Outlook" },
  other: { label: "Other calendar apps", hint: "Download an .ics file (Samsung, Thunderbird and more)" },
};

const calendarsSw = {
  apple: { label: "Kalenda ya Apple", hint: "iPhone, iPad na Mac" },
  google: { label: "Kalenda ya Google", hint: "Simu za Android na Gmail" },
  outlook: { label: "Outlook.com", hint: "Outlook binafsi na Hotmail" },
  office: { label: "Microsoft 365", hint: "Outlook ya kazi au shule" },
  other: { label: "Programu nyingine za kalenda", hint: "Pakua faili .ics (Samsung, Thunderbird na nyingine)" },
};

const en = {
  appointmentTypes: appointmentTypesEn,
  calendars: calendarsEn,
  emails: {
    greeting: (name: string) => `Dear ${name},`,
    labels: { reference: "Appointment number", day: "Day", time: "Time", where: "Where", type: "Appointment type" },
    calendar: {
      summary: "Dental appointment, DECMA Dental Clinic",
      description: (manageUrl: string) =>
        `Your appointment at DECMA Dental Clinic. To cancel, use this link: ${manageUrl}`,
      reminder: "Dental appointment at DECMA Dental Clinic",
    },
    confirmation: {
      subject: (when: string) => `Your DECMA Dental Clinic appointment: ${when}`,
      preview: "Your visit is booked. Add it to your calendar.",
      heading: "Your visit is booked",
      intro: "Thank you for booking with DECMA Dental Clinic. Here are your appointment details.",
      addToCalendar: "Add to your calendar",
      calendarHint:
        "The attached invitation (appointment.ics) adds the appointment with reminders one day and two hours before. Or choose your calendar below.",
      bring: "If you are using insurance, please bring your insurance card.",
    },
    reminder: {
      subject: (when: string) => `Reminder: your DECMA appointment, ${when}`,
      preview: "A reminder of your upcoming dental appointment.",
      heading: "See you soon",
      intro: "This is a reminder of your upcoming appointment at DECMA Dental Clinic.",
    },
    cancelled: {
      subject: "Your DECMA appointment has been cancelled",
      preview: "Your appointment has been cancelled.",
      heading: "Appointment cancelled",
      intro: "The appointment below has been cancelled. We hope to see you another time.",
      rebook: "Book another time",
    },
    manage: "Manage or cancel your booking",
    footer: (phone: string) =>
      `Please do not reply with medical details. To change your appointment, use the link above or call us on ${phone}.`,
  },
};

const sw = {
  appointmentTypes: appointmentTypesSw,
  calendars: calendarsSw,
  emails: {
    greeting: (name: string) => `Habari ${name},`,
    labels: { reference: "Namba ya miadi", day: "Siku", time: "Saa", where: "Mahali", type: "Aina ya miadi" },
    calendar: {
      summary: "Miadi ya meno, DECMA Dental Clinic",
      description: (manageUrl: string) =>
        `Miadi yako katika DECMA Dental Clinic. Ili kufuta, tumia kiungo hiki: ${manageUrl}`,
      reminder: "Miadi ya meno katika DECMA Dental Clinic",
    },
    confirmation: {
      subject: (when: string) => `Miadi yako DECMA Dental Clinic: ${when}`,
      preview: "Ziara yako imepangwa. Iongeze kwenye kalenda yako.",
      heading: "Ziara yako imepangwa",
      intro: "Asante kwa kupanga miadi na DECMA Dental Clinic. Hapa kuna maelezo ya miadi yako.",
      addToCalendar: "Ongeza kwenye kalenda",
      calendarHint:
        "Kiambatisho (appointment.ics) kinaongeza miadi na vikumbusho siku moja na saa mbili kabla. Au chagua kalenda hapa chini.",
      bring: "Ukitumia bima, tafadhali leta kadi yako ya bima.",
    },
    reminder: {
      subject: (when: string) => `Kikumbusho: miadi yako DECMA, ${when}`,
      preview: "Kikumbusho cha miadi yako ya meno ijayo.",
      heading: "Tutaonana hivi karibuni",
      intro: "Hiki ni kikumbusho cha miadi yako ijayo katika DECMA Dental Clinic.",
    },
    cancelled: {
      subject: "Miadi yako ya DECMA imefutwa",
      preview: "Miadi yako imefutwa.",
      heading: "Miadi imefutwa",
      intro: "Miadi hapa chini imefutwa. Tunatumai kukuona wakati mwingine.",
      rebook: "Panga muda mwingine",
    },
    manage: "Simamia au futa miadi yako",
    footer: (phone: string) =>
      `Tafadhali usijibu kwa maelezo ya matibabu. Ili kubadilisha miadi, tumia kiungo hapo juu au tupigie ${phone}.`,
  },
};

export type EmailDictionary = typeof en;

export function emailCopy(locale: Locale): EmailDictionary {
  return locale === "sw" ? sw : en;
}
