"use client";

import { useActionState } from "react";
import { requestReferral } from "@/lib/actions/requests";
import { initialFormState } from "@/lib/forms";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, FormAlert, Honeypot, TextArea, TextInput } from "./Fields";

export function ReferralForm({
  locale,
  copy,
  sending,
}: {
  locale: Locale;
  copy: Dictionary["referrals"];
  sending: string;
}) {
  const [state, action, pending] = useActionState(requestReferral, initialFormState);
  const err = state.fieldErrors ?? {};
  const v = state.values ?? {};
  const f = copy.fields;

  if (state.status === "success" && state.message) {
    return <FormAlert status="success" message={state.message} />;
  }

  return (
    <form action={action} className="relative grid gap-4 sm:grid-cols-2" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <Honeypot />
      <Field id="practitionerName" label={f.practitionerName} error={err.practitionerName}>
        <TextInput
          id="practitionerName"
          autoComplete="name"
          required
          error={err.practitionerName}
          defaultValue={v.practitionerName}
        />
      </Field>
      <Field id="practice" label={f.practice} error={err.practice}>
        <TextInput id="practice" autoComplete="organization" required error={err.practice} defaultValue={v.practice} />
      </Field>
      <Field id="phone" label={f.phone} error={err.phone}>
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
      <Field id="email" label={f.email} error={err.email}>
        <TextInput id="email" type="email" autoComplete="email" required error={err.email} defaultValue={v.email} />
      </Field>
      <div className="sm:col-span-2">
        <Field id="message" label={f.message} error={err.message}>
          <TextArea id="message" required maxLength={2000} error={err.message} defaultValue={v.message} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Checkbox id="consent" required error={err.consent} defaultChecked={v.consent === "on"}>
          {f.consent}
        </Checkbox>
      </div>
      {state.status === "error" && state.message && (
        <div className="sm:col-span-2">
          <FormAlert status="error" message={state.message} />
        </div>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" variant="navy" disabled={pending}>
          {pending ? sending : copy.submit}
        </Button>
      </div>
    </form>
  );
}
