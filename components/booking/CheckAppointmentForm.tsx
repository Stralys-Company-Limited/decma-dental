"use client";

import { useActionState } from "react";
import { findAppointment } from "@/lib/actions/booking";
import { initialFormState } from "@/lib/forms";
import type { Locale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/Button";
import { Field, FormAlert, TextInput } from "@/components/forms/Fields";

export function CheckAppointmentForm({
  locale,
  copy,
}: {
  locale: Locale;
  copy: { reference: string; referenceHint: string; phone: string; submit: string; sending: string };
}) {
  const [state, action, pending] = useActionState(findAppointment, initialFormState);
  const err = state.fieldErrors ?? {};
  const v = state.values ?? {};

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <Field id="reference" label={copy.reference} error={err.reference} hint={copy.referenceHint}>
        <TextInput
          id="reference"
          required
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="DC-4827-1593"
          error={err.reference}
          hint={copy.referenceHint}
          defaultValue={v.reference}
        />
      </Field>
      <Field id="phone" label={copy.phone} error={err.phone}>
        <TextInput
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          error={err.phone}
          defaultValue={v.phone}
        />
      </Field>
      {state.status === "error" && state.message && <FormAlert status="error" message={state.message} />}
      <Button type="submit" variant="navy" className="w-full sm:w-auto" disabled={pending}>
        {pending ? copy.sending : copy.submit}
      </Button>
    </form>
  );
}
