"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { getDictionaryFor } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/config";
import { HONEYPOT_FIELD, type FormState } from "@/lib/forms";
import { fieldErrors, formObject, readLocale, schemas } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { bookingsOpen, getDaySlots, getMonthAvailability, validateSlot } from "@/lib/booking/availability";
import { getAppointmentByToken, hasStarted } from "@/lib/booking/repo";
import { cancelByToken, findByReference, hasBookingBackend, insertAppointment } from "@/lib/booking/store";
import { parseReference, samePhone } from "@/lib/booking/reference";
import { sendBookingCancellation, sendBookingConfirmation } from "@/lib/booking/notify";
import { isValidDateISO } from "@/lib/booking/time";
import type { MonthAvailability, Slot } from "@/lib/booking/types";

function canBook() {
  return hasBookingBackend() && bookingsOpen();
}

export async function fetchMonthAvailability(month: string): Promise<MonthAvailability | null> {
  if (!canBook() || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return null;
  try {
    return await getMonthAvailability(month);
  } catch (err) {
    console.error("[booking] month availability failed", err);
    return null;
  }
}

export async function fetchDaySlots(dateISO: string): Promise<Slot[] | null> {
  if (!canBook() || !isValidDateISO(dateISO)) return null;
  try {
    return await getDaySlots(dateISO);
  } catch (err) {
    console.error("[booking] day slots failed", err);
    return null;
  }
}

export async function createBooking(_prev: FormState, formData: FormData): Promise<FormState> {
  const locale = readLocale(formData);
  const dict = getDictionaryFor(locale);
  const values = formObject(formData, ["startsAt", "fullName", "phone", "email", "appointmentType", "consent"]);
  const fail = (extra: Partial<FormState>): FormState => ({ status: "error", values, ...extra });
  const slotTaken = () => fail({ message: dict.booking.details.slotTaken, fieldErrors: { startsAt: "taken" } });

  if (formData.get(HONEYPOT_FIELD)) return fail({ message: dict.forms.errors.generic });
  const parsed = schemas(dict).booking.safeParse(values);
  if (!parsed.success) return fail({ fieldErrors: fieldErrors(parsed.error) });
  if (!canBook()) return fail({ message: dict.forms.errors.unavailable });

  let token: string;
  try {
    if (!(await checkRateLimit("booking"))) return fail({ message: dict.forms.errors.rateLimited });

    const d = parsed.data;
    const startsAt = new Date(d.startsAt);
    const slotMinutes = await validateSlot(startsAt.toISOString());
    if (!slotMinutes) return slotTaken();

    const appt = await insertAppointment({
      starts_at: startsAt.toISOString(),
      ends_at: new Date(startsAt.getTime() + slotMinutes * 60_000).toISOString(),
      appointment_type: d.appointmentType,
      full_name: d.fullName,
      phone: d.phone,
      email: d.email,
      locale,
      consent_at: new Date().toISOString(),
    });
    if (appt === "conflict") return slotTaken();

    token = appt.manage_token;
    after(() => sendBookingConfirmation(appt));
  } catch (err) {
    console.error("[booking] create failed", err);
    return fail({ message: dict.forms.errors.generic });
  }

  redirect(`${localePath(locale, "/book/confirmed")}?token=${token}`);
}

/**
 * "Check your appointment": needs both the appointment number and the phone number used to book,
 * so a guessed number alone reveals nothing. The error never says which of the two was wrong.
 */
export async function findAppointment(_prev: FormState, formData: FormData): Promise<FormState> {
  const locale = readLocale(formData);
  const dict = getDictionaryFor(locale);
  const values = formObject(formData, ["reference", "phone"]);
  const fail = (extra: Partial<FormState>): FormState => ({ status: "error", values, ...extra });

  const reference = parseReference(values.reference);
  if (!reference) return fail({ fieldErrors: { reference: dict.booking.lookup.invalidReference } });
  if (values.phone.replace(/\D/g, "").length < 7) return fail({ fieldErrors: { phone: dict.forms.errors.phone } });
  if (!hasBookingBackend()) return fail({ message: dict.forms.errors.unavailable });

  let token: string;
  try {
    if (!(await checkRateLimit("lookup"))) return fail({ message: dict.forms.errors.rateLimited });
    const appt = await findByReference(reference);
    if (!appt || !samePhone(appt.phone, values.phone)) return fail({ message: dict.booking.lookup.notFound });
    token = appt.manage_token;
  } catch (err) {
    console.error("[booking] lookup failed", err);
    return fail({ message: dict.forms.errors.generic });
  }

  redirect(localePath(locale, `/book/manage/${token}`));
}

export async function cancelBooking(_prev: FormState, formData: FormData): Promise<FormState> {
  const locale = readLocale(formData);
  const dict = getDictionaryFor(locale);
  const token = String(formData.get("token") ?? "");
  if (!hasBookingBackend()) return { status: "error", message: dict.forms.errors.unavailable };

  try {
    if (!(await checkRateLimit("cancel"))) return { status: "error", message: dict.forms.errors.rateLimited };

    const existing = await getAppointmentByToken(token);
    if (!existing) return { status: "error", message: dict.booking.confirmed.notFound };
    if (existing.status === "cancelled") return { status: "success", message: dict.booking.manage.cancelled };
    if (hasStarted(existing)) return { status: "error", message: dict.booking.manage.past };

    const appt = await cancelByToken(token);
    if (appt) after(() => sendBookingCancellation(appt, { byPatient: true }));
    return { status: "success", message: dict.booking.manage.cancelled };
  } catch (err) {
    console.error("[booking] cancel failed", err);
    return { status: "error", message: dict.forms.errors.generic };
  }
}
