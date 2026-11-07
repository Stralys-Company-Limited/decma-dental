"use client";

import { useActionState, useState } from "react";
import { cancelBooking } from "@/lib/actions/booking";
import { initialFormState } from "@/lib/forms";
import type { Locale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/forms/Fields";

export function CancelForm({
  locale,
  token,
  labels,
}: {
  locale: Locale;
  token: string;
  labels: { cancel: string; confirm: string; sending: string };
}) {
  const [state, action, pending] = useActionState(cancelBooking, initialFormState);
  const [confirming, setConfirming] = useState(false);

  if (state.status === "success" && state.message) return <FormAlert status="success" message={state.message} />;

  return (
    <div className="space-y-4">
      {state.status === "error" && state.message && <FormAlert status="error" message={state.message} />}
      {confirming ? (
        <form action={action}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="token" value={token} />
          <Button type="submit" variant="navy" disabled={pending}>
            {pending ? labels.sending : labels.confirm}
          </Button>
        </form>
      ) : (
        <Button type="button" variant="outlineNavy" onClick={() => setConfirming(true)}>
          {labels.cancel}
        </Button>
      )}
    </div>
  );
}
