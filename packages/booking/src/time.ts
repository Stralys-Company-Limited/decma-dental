import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { intlLocale, type Locale } from "./locale";
import { CLINIC_TIME_ZONE } from "./options";

/** A wall-clock time at the clinic (e.g. "2026-12-01", "09:30") as an absolute instant. */
export function clinicInstant(dateISO: string, time: string): Date {
  return fromZonedTime(`${dateISO}T${time.slice(0, 5)}:00`, CLINIC_TIME_ZONE);
}

export function clinicDateISO(instant: Date = new Date()): string {
  return formatInTimeZone(instant, CLINIC_TIME_ZONE, "yyyy-MM-dd");
}

/** e.g. "9:30 AM", in clinic time. */
export function clinicTimeLabel(instant: Date): string {
  return formatInTimeZone(instant, CLINIC_TIME_ZONE, "h:mm a");
}

/** 0 = Sunday ... 6 = Saturday, matching opening_hours.weekday. */
export function weekdayOf(dateISO: string): number {
  return new Date(`${dateISO}T12:00:00Z`).getUTCDay();
}

export function addDaysISO(dateISO: string, days: number): string {
  const d = new Date(`${dateISO}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function monthKey(dateISO: string): string {
  return dateISO.slice(0, 7);
}

export function daysInMonth(month: string): string[] {
  const [y, m] = month.split("-").map(Number);
  const count = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Array.from({ length: count }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`);
}

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

export function isValidDateISO(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function formatDay(instantOrISO: Date | string, locale: Locale): string {
  const date = typeof instantOrISO === "string" ? new Date(`${instantOrISO}T12:00:00Z`) : instantOrISO;
  return new Intl.DateTimeFormat(intlLocale[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: typeof instantOrISO === "string" ? "UTC" : CLINIC_TIME_ZONE,
  }).format(date);
}

export function formatMonth(month: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T12:00:00Z`));
}

/** Clinic time in 12-hour form, e.g. "9:30 AM". Always clinic (Tanzania) time, whatever the device's time zone. */
export function formatTime(instant: Date): string {
  return clinicTimeLabel(instant);
}

export function formatWhen(instant: Date, locale: Locale): string {
  return `${formatDay(instant, locale)}, ${formatTime(instant)}`;
}
