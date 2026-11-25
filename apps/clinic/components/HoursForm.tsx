"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/forms";
import { initialFormState } from "@/lib/forms";
import { btn } from "@/components/Shell";
import { weekdayLabels } from "@/lib/labels";

export function HoursForm({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 text-sm">
      <label>
        <span className="mb-1 block font-semibold">Weekday</span>
        <select name="weekday" className="border border-navy-40 px-3 py-2">
          {weekdayLabels.map((label, i) => (
            <option key={label} value={i}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="mb-1 block font-semibold">Opens</span>
        <input type="time" name="opens" required defaultValue="08:00" className="border border-navy-40 px-3 py-2" />
      </label>
      <label>
        <span className="mb-1 block font-semibold">Closes</span>
        <input type="time" name="closes" required defaultValue="17:00" className="border border-navy-40 px-3 py-2" />
      </label>
      <label>
        <span className="mb-1 block font-semibold">Slot (min)</span>
        <select name="slot_minutes" defaultValue="30" className="border border-navy-40 px-3 py-2">
          {[15, 20, 30, 45, 60].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <button disabled={pending} className={btn("navy", "py-2 text-sm")}>
        {pending ? "Saving…" : "Save hours"}
      </button>
      {state.message && <p className="w-full text-ink-80">{state.message}</p>}
    </form>
  );
}
