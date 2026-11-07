export const appointmentTypes = [
  "new-patient",
  "check-up",
  "toothache",
  "fillings",
  "cosmetic",
  "orthodontics",
  "implants",
  "children",
] as const;
export type AppointmentType = (typeof appointmentTypes)[number];

export const CLINIC_TIME_ZONE = "Africa/Dar_es_Salaam";
/** Patients cannot book a slot that starts sooner than this. */
export const MIN_LEAD_MINUTES = 120;
/** How far ahead the calendar lets patients book. */
export const MAX_DAYS_AHEAD = 90;
