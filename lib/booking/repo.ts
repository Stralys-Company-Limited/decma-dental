import "server-only";
import { findByToken } from "./store";
import type { Appointment } from "./types";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isToken(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

export function hasStarted(appt: Pick<Appointment, "starts_at">, now: number = Date.now()): boolean {
  return new Date(appt.starts_at).getTime() < now;
}

export async function getAppointmentByToken(token: string): Promise<Appointment | null> {
  if (!isToken(token)) return null;
  return findByToken(token);
}
