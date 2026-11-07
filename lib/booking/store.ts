import "server-only";
import { randomInt, randomUUID } from "node:crypto";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { addDaysISO, clinicInstant } from "./time";
import { REFERENCE_LENGTH } from "./reference";
import type { Appointment } from "./types";

export type HoursRow = { weekday: number; opens: string; closes: string; slot_minutes: number };
export type RangeData = { hours: Map<number, HoursRow>; closed: Set<string>; booked: Set<string> };
export type NewAppointment = Omit<
  Appointment,
  "id" | "reference" | "status" | "manage_token" | "reminder_sent_at" | "cancelled_at" | "created_at"
>;

const MAX_REFERENCE_ATTEMPTS = 10;

/** Cryptographically random 8-digit appointment number. Uniqueness is enforced on insert. */
function newReference(): string {
  return String(randomInt(0, 10 ** REFERENCE_LENGTH)).padStart(REFERENCE_LENGTH, "0");
}

/**
 * Local demo mode: `next dev` without Supabase keys. Bookings live in memory on this machine (lost when the
 * dev server restarts) so the booking flow can be tried before the database exists. Never active in production.
 */
export function isDemoMode(): boolean {
  return process.env.NODE_ENV !== "production" && !isSupabaseConfigured();
}

export function hasBookingBackend(): boolean {
  return isSupabaseConfigured() || isDemoMode();
}

// Same sample hours as supabase/seed.sql. weekday: 0 = Sunday ... 6 = Saturday.
const DEMO_HOURS: HoursRow[] = [1, 2, 3, 4, 5]
  .map((weekday) => ({ weekday, opens: "08:00", closes: "17:00", slot_minutes: 30 }))
  .concat({ weekday: 6, opens: "09:00", closes: "13:00", slot_minutes: 30 });

const demo = globalThis as unknown as { __decmaDemoAppointments?: Appointment[] };
const demoAppointments = () => (demo.__decmaDemoAppointments ??= []);

export async function loadRange(fromISO: string, toISO: string): Promise<RangeData> {
  const from = clinicInstant(fromISO, "00:00").getTime();
  const to = clinicInstant(addDaysISO(toISO, 1), "00:00").getTime();

  if (isDemoMode()) {
    const booked = demoAppointments()
      .filter((a) => a.status !== "cancelled")
      .map((a) => new Date(a.starts_at))
      .filter((d) => d.getTime() >= from && d.getTime() < to)
      .map((d) => d.toISOString());
    return { hours: new Map(DEMO_HOURS.map((h) => [h.weekday, h])), closed: new Set(), booked: new Set(booked) };
  }

  const db = getSupabaseAdmin();
  const [hours, closures, booked] = await Promise.all([
    db.from("opening_hours").select("weekday, opens, closes, slot_minutes"),
    db.from("closures").select("day").gte("day", fromISO).lte("day", toISO),
    db
      .from("appointments")
      .select("starts_at")
      .neq("status", "cancelled")
      .gte("starts_at", new Date(from).toISOString())
      .lt("starts_at", new Date(to).toISOString()),
  ]);
  for (const r of [hours, closures, booked]) if (r.error) throw r.error;

  return {
    hours: new Map((hours.data as HoursRow[]).map((h) => [h.weekday, h])),
    closed: new Set((closures.data as { day: string }[]).map((c) => c.day)),
    booked: new Set((booked.data as { starts_at: string }[]).map((b) => new Date(b.starts_at).toISOString())),
  };
}

/**
 * Inserts a confirmed appointment with a never-reused appointment number, or returns "conflict" if the
 * slot was taken in the meantime.
 */
export async function insertAppointment(row: NewAppointment): Promise<Appointment | "conflict"> {
  if (isDemoMode()) {
    const list = demoAppointments();
    if (list.some((a) => a.status !== "cancelled" && a.starts_at === row.starts_at)) return "conflict";
    const used = new Set(list.map((a) => a.reference));
    let reference = newReference();
    while (used.has(reference)) reference = newReference();
    const appt: Appointment = {
      ...row,
      id: randomUUID(),
      reference,
      status: "confirmed",
      manage_token: randomUUID(),
      reminder_sent_at: null,
      cancelled_at: null,
      created_at: new Date().toISOString(),
    };
    list.push(appt);
    console.info(`[booking demo] booked ${appt.starts_at} for ${appt.full_name} (number ${reference})`);
    return appt;
  }

  for (let attempt = 0; attempt < MAX_REFERENCE_ATTEMPTS; attempt++) {
    const { data, error } = await getSupabaseAdmin()
      .from("appointments")
      .insert({ ...row, reference: newReference(), status: "confirmed" })
      .select("*")
      .single();
    if (!error) return data as Appointment;
    if (error.code !== "23505") throw error;
    // 23505 is a unique violation: either the appointment number was already used (draw another)
    // or someone booked the same slot a moment ago.
    if (!`${error.message} ${error.details ?? ""}`.includes("reference")) return "conflict";
  }
  throw new Error("Could not generate a unique appointment number.");
}

export async function findByReference(reference: string): Promise<Appointment | null> {
  if (isDemoMode()) return demoAppointments().find((a) => a.reference === reference) ?? null;
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await getSupabaseAdmin()
    .from("appointments")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();
  if (error) throw error;
  return (data as Appointment | null) ?? null;
}

export async function findByToken(token: string): Promise<Appointment | null> {
  if (isDemoMode()) return demoAppointments().find((a) => a.manage_token === token) ?? null;
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await getSupabaseAdmin()
    .from("appointments")
    .select("*")
    .eq("manage_token", token)
    .maybeSingle();
  if (error) throw error;
  return (data as Appointment | null) ?? null;
}

/** Cancels an active appointment. Returns the updated row, or null if it was already cancelled or not found. */
export async function cancelByToken(token: string): Promise<Appointment | null> {
  const cancelledAt = new Date().toISOString();

  if (isDemoMode()) {
    const appt = demoAppointments().find((a) => a.manage_token === token && a.status !== "cancelled");
    if (!appt) return null;
    appt.status = "cancelled";
    appt.cancelled_at = cancelledAt;
    return { ...appt };
  }

  const { data, error } = await getSupabaseAdmin()
    .from("appointments")
    .update({ status: "cancelled", cancelled_at: cancelledAt })
    .eq("manage_token", token)
    .neq("status", "cancelled")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return (data as Appointment | null) ?? null;
}
