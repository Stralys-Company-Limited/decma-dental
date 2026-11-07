"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { createBooking } from "@/lib/actions/booking";
import { initialFormState } from "@/lib/forms";
import { appointmentTypes } from "@/lib/booking/options";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, FormAlert, Honeypot, Select, TextInput } from "@/components/forms/Fields";
import { Icon } from "@/components/ui/Icon";

export type DetailsCopy = Dictionary["booking"]["details"] & {
  privacyNotice: string;
  sending: string;
  appointmentTypes: Dictionary["appointmentTypes"];
};

export function DetailsForm({
  locale,
  copy,
  startsAt,
  privacyHref,
  onBack,
  onSlotTaken,
}: {
  locale: Locale;
  copy: DetailsCopy;
  startsAt: string;
  privacyHref: string;
  onBack: () => void;
  onSlotTaken: () => void;
}) {
  const [state, action, pending] = useActionState(createBooking, initialFormState);
  const err = state.fieldErrors ?? {};
  const v = state.values ?? {};
  const slotTaken = err.startsAt === "taken";

  useEffect(() => {
    if (slotTaken) onSlotTaken();
  }, [slotTaken, onSlotTaken]);

  return (
    <section aria-labelledby="details-title" className="border border-line bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="details-title" className="text-xl font-bold">
          {copy.title}
        </h2>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline underline-offset-4 hover:text-teal-deep"
        >
          <Icon name="chevronLeft" className="size-4" strokeWidth={2} />
          {copy.back}
        </button>
      </div>
      <p className="mt-3 border-l-4 border-teal bg-teal-20 px-4 py-3 text-sm text-navy-deep">{copy.noMedical}</p>

      <form action={action} className="relative mt-6 grid gap-5 sm:grid-cols-2" noValidate>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="startsAt" value={startsAt} />
        <Honeypot />
        <Field id="fullName" label={copy.fullName} error={err.fullName}>
          <TextInput id="fullName" autoComplete="name" required error={err.fullName} defaultValue={v.fullName} />
        </Field>
        <Field id="phone" label={copy.phone} error={err.phone} hint={copy.phoneHint}>
          <TextInput
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            error={err.phone}
            hint={copy.phoneHint}
            defaultValue={v.phone}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field id="email" label={copy.email} error={err.email} hint={copy.emailHint}>
            <TextInput
              id="email"
              type="email"
              autoComplete="email"
              required
              error={err.email}
              hint={copy.emailHint}
              defaultValue={v.email}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="appointmentType" label={copy.appointmentType} error={err.appointmentType}>
            <Select
              id="appointmentType"
              error={err.appointmentType}
              defaultValue={v.appointmentType || "new-patient"}
              options={appointmentTypes.map((t) => ({ value: t, label: copy.appointmentTypes[t] }))}
            />
          </Field>
        </div>

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
          <Button type="submit" variant="navy" className="w-full sm:w-auto" disabled={pending || slotTaken}>
            {pending ? copy.sending : copy.submit}
          </Button>
        </div>
      </form>
    </section>
  );
}
