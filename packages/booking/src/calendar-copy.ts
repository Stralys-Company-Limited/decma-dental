import type { Locale } from "./locale";

const en = {
  summary: "Dental appointment, DECMA Dental Clinic",
  description: (manageUrl: string) =>
    `Your appointment at DECMA Dental Clinic. To cancel, use this link: ${manageUrl}`,
  reminder: "Dental appointment at DECMA Dental Clinic",
};

const sw = {
  summary: "Miadi ya meno, DECMA Dental Clinic",
  description: (manageUrl: string) =>
    `Miadi yako katika DECMA Dental Clinic. Ili kufuta, tumia kiungo hiki: ${manageUrl}`,
  reminder: "Miadi ya meno katika DECMA Dental Clinic",
};

export function calendarCopy(locale: Locale) {
  return locale === "sw" ? sw : en;
}
