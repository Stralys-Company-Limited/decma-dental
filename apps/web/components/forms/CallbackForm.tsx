"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestCallback } from "@/lib/actions/requests";
import { initialFormState } from "@/lib/forms";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { appointmentTypes } from "@decma/booking/options";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, FormAlert, Honeypot, Select, TextInput } from "./Fields";

type Props = {
  locale: Locale;
  copy: Dictionary["callback"];
  types: Dictionary["appointmentTypes"];
  sending: string;
  bookHref: string;
  privacyHref: string;
};

export function CallbackForm({ locale, copy, types, sending, bookHref, privacyHref }: Props) {
  const [state, action, pending] = useActionState(requestCallback, initialFormState);
  const err = state.fieldErrors ?? {};
  const v = state.values ?? {};

  return (
    <div id="callback" className="bg-navy-20 p-6 sm:p-8">
      <h2 className="text-2xl font-bold">{copy.title}</h2>
      <p className="mt-3 text-sm text-ink-80">
        {copy.textBefore}
        <Link href={bookHref} className="font-semibold text-navy underline underline-offset-4">
          {copy.bookOnline}
        </Link>
        {copy.textAfter} {copy.noMedical}
      </p>

      {state.status === "success" && state.message ? (
        <div className="mt-6">
          <FormAlert status="success" message={state.message} />
        </div>
      ) : (
        <form action={action} className="relative mt-6 grid gap-4 sm:grid-cols-2" noValidate>
          <input type="hidden" name="locale" value={locale} />
          <Honeypot />
          <Field id="fullName" label={copy.fields.fullName} error={err.fullName}>
            <TextInput id="fullName" autoComplete="name" required error={err.fullName} defaultValue={v.fullName} />
          </Field>
          <Field id="phone" label={copy.fields.phone} error={err.phone}>
            <TextInput
              id="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
              error={err.phone}
              defaultValue={v.phone}
            />
          </Field>
          <Field id="appointmentType" label={copy.fields.appointmentType} error={err.appointmentType}>
            <Select
              id="appointmentType"
              error={err.appointmentType}
              defaultValue={v.appointmentType || "new-patient"}
              options={appointmentTypes.map((t) => ({ value: t, label: types[t] }))}
            />
          </Field>
          <Field id="preferredDate" label={copy.fields.preferredDate} error={err.preferredDate}>
            <TextInput id="preferredDate" type="date" error={err.preferredDate} defaultValue={v.preferredDate} />
          </Field>
          <div className="sm:col-span-2">
            <Checkbox id="consent" required error={err.consent} defaultChecked={v.consent === "on"}>
              {copy.consentBefore}
              <Link href={privacyHref} className="text-navy underline underline-offset-2">
                {copy.privacyNotice}
              </Link>
              {copy.consentAfter}
            </Checkbox>
          </div>
          {state.status === "error" && state.message && (
            <div className="sm:col-span-2">
              <FormAlert status="error" message={state.message} />
            </div>
          )}
          <div className="sm:col-span-2">
            <Button type="submit" variant="navy" className="w-full" disabled={pending}>
              {pending ? sending : copy.submit}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
