"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { z } from "zod";
import {
  appointmentTypes,
  clinicInstant,
  deleteOpeningHours,
  getDaySlots,
  insertAppointment,
  isValidDateISO,
  rescheduleAppointment,
  site,
  updateAppointmentNotes,
  updateAppointmentStatus,
  upsertOpeningHours,
  type Appointment,
  type AppointmentStatus,
} from "@decma/booking";
import { getSupabaseAdmin } from "@decma/db/admin";
import { getStaffUser, getSupabaseAuth, isAuthConfigured } from "@decma/db/auth";
import { sendBookingCancellation, sendBookingConfirmation } from "@decma/notify";
import type { FormState } from "@/lib/forms";

const HOME = "/";

async function requireStaff() {
  const staff = await getStaffUser();
  if (!staff) redirect("/login");
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
  redirect(HOME);
}

export async function signOut() {
  if (isAuthConfigured()) await (await getSupabaseAuth()).auth.signOut();
  redirect("/login");
}

const workflowStatuses = z.enum(["pending", "confirmed", "arrived", "completed", "no_show", "cancelled"]);

export async function setAppointmentStatus(formData: FormData) {
  await requireStaff();
  const id = z.uuid().parse(formData.get("id"));
  const status = workflowStatuses.parse(formData.get("status")) as AppointmentStatus;
  const appt = await updateAppointmentStatus(id, status);
  if (appt && status === "cancelled" && formData.get("notify") === "on" && appt.email) {
    after(() => sendBookingCancellation(appt, { byPatient: false }));
  }
  refresh();
}

export async function saveNotes(formData: FormData) {
  await requireStaff();
  const id = z.uuid().parse(formData.get("id"));
  const notes = String(formData.get("notes") ?? "");
  await updateAppointmentNotes(id, notes);
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

export async function saveOpeningHours(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const weekday = Number(formData.get("weekday"));
  const opens = String(formData.get("opens") ?? "");
  const closes = String(formData.get("closes") ?? "");
  const slotMinutes = Number(formData.get("slot_minutes") ?? 30);
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    return { status: "error", message: "Choose a weekday." };
  }
  if (!/^\d{2}:\d{2}$/.test(opens) || !/^\d{2}:\d{2}$/.test(closes) || opens >= closes) {
    return { status: "error", message: "Enter valid opening and closing times." };
  }
  if (![15, 20, 30, 45, 60].includes(slotMinutes)) {
    return { status: "error", message: "Choose a slot length." };
  }
  await upsertOpeningHours({ weekday, opens, closes, slot_minutes: slotMinutes });
  refresh();
  return { status: "success", message: "Opening hours saved." };
}

export async function removeOpeningHours(formData: FormData) {
  await requireStaff();
  const weekday = Number(formData.get("weekday"));
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) return;
  await deleteOpeningHours(weekday);
  refresh();
}

export async function createWalkIn(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const values = {
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    appointmentType: String(formData.get("appointmentType") ?? ""),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    notify: formData.get("notify") === "on",
  };

  const parsed = z
    .object({
      fullName: z.string().trim().min(2).max(120),
      phone: z.string().trim().min(9).max(30),
      email: z.union([z.literal(""), z.email()]),
      appointmentType: z.enum(appointmentTypes),
      date: z.string().refine(isValidDateISO),
      time: z.string().regex(/^\d{2}:\d{2}$/),
      notes: z.string().max(2000),
      notify: z.boolean(),
    })
    .safeParse(values);

  const formValues = {
    fullName: values.fullName,
    phone: values.phone,
    email: values.email,
    appointmentType: values.appointmentType,
    date: values.date,
    time: values.time,
    notes: values.notes,
  };

  if (!parsed.success) {
    return { status: "error", message: "Check the patient details and slot.", values: formValues };
  }

  const d = parsed.data;
  if (d.notify && !d.email) {
    return {
      status: "error",
      message: "Add an email address to send a confirmation, or turn notify off.",
      values: formValues,
    };
  }

  const time = d.time.length === 5 ? d.time : d.time.padStart(5, "0");
  const slots = await getDaySlots(d.date);
  const slot = slots.find((s) => s.time === time);
  if (!slot) return { status: "error", message: "That time is not available.", values: formValues };

  const starts = clinicInstant(d.date, time);
  const ends = new Date(starts.getTime() + site.appointmentLengthMinutes * 60_000);
  const result = await insertAppointment({
    starts_at: starts.toISOString(),
    ends_at: ends.toISOString(),
    appointment_type: d.appointmentType,
    full_name: d.fullName,
    phone: d.phone,
    email: d.email || `walkin+${Date.now()}@decma.local`,
    locale: "en",
    consent_at: new Date().toISOString(),
  });

  if (result === "conflict") {
    return { status: "error", message: "That slot was just taken. Pick another time.", values: formValues };
  }

  if (d.notes.trim()) await updateAppointmentNotes(result.id, d.notes);
  if (d.notify && d.email) after(() => sendBookingConfirmation(result));

  redirect(`/appointments/${result.reference}`);
}

export async function rescheduleBooking(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const id = String(formData.get("id") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const notify = formData.get("notify") === "on";

  const normalizedTime = time.length === 5 ? time : time.padStart(5, "0");
  if (!z.uuid().safeParse(id).success || !isValidDateISO(date) || !/^\d{2}:\d{2}$/.test(normalizedTime)) {
    return { status: "error", message: "Choose a valid day and time." };
  }

  const slots = await getDaySlots(date);
  if (!slots.some((s) => s.time === normalizedTime)) return { status: "error", message: "That time is not available." };

  const starts = clinicInstant(date, normalizedTime);
  const ends = new Date(starts.getTime() + site.appointmentLengthMinutes * 60_000);
  const result = await rescheduleAppointment(id, starts.toISOString(), ends.toISOString());
  if (result === "conflict") return { status: "error", message: "That slot was just taken." };
  if (!result) return { status: "error", message: "Appointment not found." };

  if (notify && result.email && !result.email.endsWith("@decma.local")) {
    after(() => sendBookingConfirmation(result as Appointment));
  }
  refresh();
  return { status: "success", message: "Appointment moved." };
}
