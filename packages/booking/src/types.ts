import type { Locale } from "./locale";
import type { AppointmentType } from "./options";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "arrived"
  | "completed"
  | "no_show"
  | "cancelled";

/** Row shape of public.appointments. */
export type Appointment = {
  id: string;
  /** 8 digits; display with formatReference(). */
  reference: string;
  starts_at: string;
  ends_at: string;
  appointment_type: AppointmentType;
  full_name: string;
  phone: string;
  email: string;
  locale: Locale;
  consent_at: string;
  status: AppointmentStatus;
  notes: string | null;
  manage_token: string;
  reminder_sent_at: string | null;
  cancelled_at: string | null;
  created_at: string;
};

export type DayStatus = "available" | "unavailable";

export type MonthAvailability = {
  month: string;
  days: Record<string, DayStatus>;
};

export type Slot = { time: string; startsAt: string };
