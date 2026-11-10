"use server";

import { getDictionaryFor } from "@/lib/i18n/dictionaries";
import { HONEYPOT_FIELD, type FormState } from "@/lib/forms";
import { fieldErrors, formObject, readLocale, schemas } from "@/lib/validation";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { callbackNotifyAddress, clinicNotifyAddress, sendEmail } from "@/lib/email/send";
import { CallbackAlertEmail, ReferralAlertEmail } from "@/emails/ClinicEmails";

export async function requestCallback(_prev: FormState, formData: FormData): Promise<FormState> {
  const locale = readLocale(formData);
  const dict = getDictionaryFor(locale);
  if (formData.get(HONEYPOT_FIELD)) return { status: "success", message: dict.callback.success };

  const values = formObject(formData, ["fullName", "phone", "appointmentType", "preferredDate", "consent"]);
  const fail = (extra: Partial<FormState>): FormState => ({ status: "error", values, ...extra });

  const parsed = schemas(dict).callback.safeParse(values);
  if (!parsed.success) return fail({ fieldErrors: fieldErrors(parsed.error) });
  if (!isSupabaseConfigured()) return fail({ message: dict.forms.errors.unavailable });

  try {
    if (!(await checkRateLimit("callback"))) return fail({ message: dict.forms.errors.rateLimited });

    const d = parsed.data;
    const { error } = await getSupabaseAdmin().from("callback_requests").insert({
      full_name: d.fullName,
      phone: d.phone,
      appointment_type: d.appointmentType,
      preferred_date: d.preferredDate,
      locale,
      consent_at: new Date().toISOString(),
    });
    if (error) throw error;

    const to = callbackNotifyAddress();
    if (to) {
      await sendEmail({
        to,
        subject: `Call-back request: ${d.fullName}`,
        react: (
          <CallbackAlertEmail
            fullName={d.fullName}
            phone={d.phone}
            appointmentType={getDictionaryFor("en").appointmentTypes[d.appointmentType]}
            preferredDate={d.preferredDate}
            locale={locale}
          />
        ),
      });
    }
    return { status: "success", message: dict.callback.success };
  } catch (err) {
    console.error("[callback] failed", err);
    return fail({ message: dict.forms.errors.generic });
  }
}

export async function requestReferral(_prev: FormState, formData: FormData): Promise<FormState> {
  const locale = readLocale(formData);
  const dict = getDictionaryFor(locale);
  if (formData.get(HONEYPOT_FIELD)) return { status: "success", message: dict.referrals.success };

  const values = formObject(formData, ["practitionerName", "practice", "phone", "email", "message", "consent"]);
  const fail = (extra: Partial<FormState>): FormState => ({ status: "error", values, ...extra });

  const parsed = schemas(dict).referral.safeParse(values);
  if (!parsed.success) return fail({ fieldErrors: fieldErrors(parsed.error) });
  if (!isSupabaseConfigured()) return fail({ message: dict.forms.errors.unavailable });

  try {
    if (!(await checkRateLimit("referral"))) return fail({ message: dict.forms.errors.rateLimited });

    const d = parsed.data;
    const { error } = await getSupabaseAdmin().from("referral_requests").insert({
      practitioner_name: d.practitionerName,
      practice: d.practice,
      phone: d.phone,
      email: d.email,
      message: d.message,
      locale,
      consent_at: new Date().toISOString(),
    });
    if (error) throw error;

    const to = clinicNotifyAddress();
    if (to) {
      await sendEmail({
        to,
        replyTo: d.email,
        subject: `Referrals desk enquiry: ${d.practitionerName}, ${d.practice}`,
        react: (
          <ReferralAlertEmail
            practitionerName={d.practitionerName}
            practice={d.practice}
            phone={d.phone}
            email={d.email}
            message={d.message}
          />
        ),
      });
    }
    return { status: "success", message: dict.referrals.success };
  } catch (err) {
    console.error("[referral] failed", err);
    return fail({ message: dict.forms.errors.generic });
  }
}
