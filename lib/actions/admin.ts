"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { z } from "zod";
import type { FormState } from "@/lib/forms";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStaffUser, getSupabaseAuth, isAuthConfigured } from "@/lib/supabase/auth";
import { sendBookingCancellation } from "@/lib/booking/notify";
import { isValidDateISO } from "@/lib/booking/time";
import type { Appointment } from "@/lib/booking/types";

const ADMIN = "/admin";

async function requireStaff() {
  const staff = await getStaffUser();
  if (!staff) redirect(`${ADMIN}/login`);
  return staff;
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isAuthConfigured()) return { status: "error", message: "Supabase Auth is not configured." };
  const parsed = z
    .object({ email: z.email(), password: z.string().min(6) })
    .safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { status: "error", message: "Enter your email and password." };

  const supabase = await getSupabaseAuth();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { status: "error", message: "Those details were not recognised." };

  if (!(await getStaffUser())) {
    await supabase.auth.signOut();
    return { status: "error", message: "This account does not have staff access." };
  }
  redirect(ADMIN);
}

export async function signOut() {
  if (isAuthConfigured()) await (await getSupabaseAuth()).auth.signOut();
  redirect(`${ADMIN}/login`);
}

export async function setAppointmentStatus(formData: FormData) {
  await requireStaff();
  const id = z.uuid().parse(formData.get("id"));
  const status = z.enum(["confirmed", "cancelled"]).parse(formData.get("status"));
  const db = getSupabaseAdmin();

  const { data, error } = await db
    .from("appointments")
    .update({ status, cancelled_at: status === "cancelled" ? new Date().toISOString() : null })
    .eq("id", id)
    .neq("status", status)
    .select("*")
    .maybeSingle();
  if (error) throw error;

  if (data && status === "cancelled" && formData.get("notify") === "on") {
    const appt = data as Appointment;
    after(() => sendBookingCancellation(appt, { byPatient: false }));
  }
  refresh();
}

export async function markHandled(formData: FormData) {
  await requireStaff();
  const id = z.uuid().parse(formData.get("id"));
  const table = z.enum(["callback_requests", "referral_requests"]).parse(formData.get("table"));
  const { error } = await getSupabaseAdmin().from(table).update({ handled_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
  refresh();
}

export async function addClosure(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const day = String(formData.get("day") ?? "");
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 200) || null;
  if (!isValidDateISO(day)) return { status: "error", message: "Choose a valid date." };

  const { error } = await getSupabaseAdmin().from("closures").upsert({ day, reason });
  if (error) return { status: "error", message: error.message };
  refresh();
  return { status: "success", message: `Closed on ${day}.` };
}

export async function removeClosure(formData: FormData) {
  await requireStaff();
  const day = String(formData.get("day") ?? "");
  if (!isValidDateISO(day)) return;
  const { error } = await getSupabaseAdmin().from("closures").delete().eq("day", day);
  if (error) throw error;
  refresh();
}
