import "server-only";
import { site } from "./site";
import { MAX_DAYS_AHEAD, MIN_LEAD_MINUTES } from "./options";
import { addDaysISO, clinicDateISO, clinicInstant, clinicTimeLabel, daysInMonth, weekdayOf } from "./time";
import { isDemoMode, loadRange, type RangeData } from "./store";
import type { MonthAvailability, Slot } from "./types";

export type BookingWindow = { first: string; last: string };

/**
 * Online booking is open once the clinic has an opening date. During local development it is always
 * open so the flow can be tested (against Supabase, or the in-memory demo store without it).
 */
export function bookingsOpen(): boolean {
  return !!site.openingDateISO || isDemoMode() || process.env.NODE_ENV === "development";
}

export function bookingWindow(now: Date = new Date()): BookingWindow {
  const today = clinicDateISO(now);
  const opening = site.openingDateISO ?? today;
  const first = opening > today ? opening : today;
  return { first, last: addDaysISO(today, MAX_DAYS_AHEAD) };
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function toHHMM(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function slotsFor(
  dateISO: string,
  data: RangeData,
  window: BookingWindow,
  now: Date,
): Slot[] {
  if (dateISO < window.first || dateISO > window.last || data.closed.has(dateISO)) return [];
  const h = data.hours.get(weekdayOf(dateISO));
  if (!h) return [];

  const earliest = now.getTime() + MIN_LEAD_MINUTES * 60_000;
  const slots: Slot[] = [];
  for (let m = toMinutes(h.opens); m + h.slot_minutes <= toMinutes(h.closes); m += h.slot_minutes) {
    const instant = clinicInstant(dateISO, toHHMM(m));
    if (instant.getTime() < earliest) continue;
    const iso = instant.toISOString();
    if (data.booked.has(iso)) continue;
    slots.push({ time: clinicTimeLabel(instant), startsAt: iso });
  }
  return slots;
}

export async function getMonthAvailability(month: string, now: Date = new Date()): Promise<MonthAvailability> {
  const days = daysInMonth(month);
  const window = bookingWindow(now);
  const data = await loadRange(days[0], days[days.length - 1]);
  return {
    month,
    days: Object.fromEntries(
      days.map((d) => [d, slotsFor(d, data, window, now).length > 0 ? "available" : "unavailable"]),
    ),
  };
}

export async function getDaySlots(dateISO: string, now: Date = new Date()): Promise<Slot[]> {
  const data = await loadRange(dateISO, dateISO);
  return slotsFor(dateISO, data, bookingWindow(now), now);
}

/** Re-checks a requested start time against live availability. Returns the slot length if it is still free. */
export async function validateSlot(startsAt: string, now: Date = new Date()): Promise<number | null> {
  const instant = new Date(startsAt);
  if (Number.isNaN(instant.getTime())) return null;
  const dateISO = clinicDateISO(instant);
  const data = await loadRange(dateISO, dateISO);
  const free = slotsFor(dateISO, data, bookingWindow(now), now).some((s) => s.startsAt === instant.toISOString());
  if (!free) return null;
  return data.hours.get(weekdayOf(dateISO))?.slot_minutes ?? null;
}
