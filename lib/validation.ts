import { z } from "zod";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { isEnabledLocale, type Locale } from "@/lib/i18n/config";
import { appointmentTypes } from "@/lib/booking/options";
import { isValidDateISO } from "@/lib/booking/time";

export function readLocale(formData: FormData): Locale {
  const value = String(formData.get("locale") ?? "");
  return isEnabledLocale(value) ? value : "en";
}

const phoneDigits = (v: string) => v.replace(/\D/g, "").length;

export function schemas(dict: Dictionary) {
  const e = dict.forms.errors;
  const name = z.string().trim().min(2, e.name).max(120, e.name);
  const phone = z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]+$/, e.phone)
    .refine((v) => phoneDigits(v) >= 9 && phoneDigits(v) <= 15, e.phone);
  const email = z.string().trim().max(200, e.email).pipe(z.email(e.email));
  const consent = z.literal("on", { error: e.consent });

  return {
    callback: z.object({
      fullName: name,
      phone,
      appointmentType: z.enum(appointmentTypes, { error: e.type }),
      preferredDate: z
        .string()
        .trim()
        .refine((v) => v === "" || isValidDateISO(v), e.date)
        .transform((v) => (v === "" ? null : v)),
      consent,
    }),
    referral: z.object({
      practitionerName: name,
      practice: z.string().trim().min(2, e.name).max(160, e.name),
      phone,
      email,
      message: z.string().trim().min(5, e.message).max(2000, e.message),
      consent,
    }),
    booking: z.object({
      startsAt: z.iso.datetime({ offset: true, error: e.date }),
      fullName: name,
      phone,
      email,
      appointmentType: z.enum(appointmentTypes, { error: e.type }),
      consent,
    }),
  };
}

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

export function formObject(formData: FormData, keys: string[]): Record<string, string> {
  return Object.fromEntries(keys.map((k) => [k, String(formData.get(k) ?? "")]));
}
