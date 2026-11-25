"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/forms";
import { initialFormState } from "@/lib/forms";
import { btn } from "@/components/Shell";

export function ClosureForm({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 text-sm">
      <label>
        <span className="mb-1 block font-semibold">Day</span>
        <input type="date" name="day" required className="border border-navy-40 px-3 py-2" />
      </label>
      <label className="min-w-48 flex-1">
        <span className="mb-1 block font-semibold">Reason (optional)</span>
        <input name="reason" className="w-full border border-navy-40 px-3 py-2" />
      </label>
      <button disabled={pending} className={btn("navy", "py-2 text-sm")}>
        {pending ? "Saving…" : "Add closure"}
      </button>
      {state.message && <p className="w-full text-ink-80">{state.message}</p>}
    </form>
  );
}
