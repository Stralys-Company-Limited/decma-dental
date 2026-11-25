"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/forms";
import { initialFormState } from "@/lib/forms";
import { btn } from "@/components/Shell";

export function RescheduleForm({
  appointmentId,
  defaultDate,
  defaultTime,
  action,
}: {
  appointmentId: string;
  defaultDate: string;
  defaultTime: string;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 text-sm">
      <input type="hidden" name="id" value={appointmentId} />
      <label>
        <span className="mb-1 block font-semibold">Day</span>
        <input type="date" name="date" required defaultValue={defaultDate} className="border border-navy-40 px-3 py-2" />
      </label>
      <label>
        <span className="mb-1 block font-semibold">Time</span>
        <input type="time" name="time" required defaultValue={defaultTime} step={1800} className="border border-navy-40 px-3 py-2" />
      </label>
      <label className="inline-flex items-center gap-2 pb-2">
        <input type="checkbox" name="notify" />
        Notify patient
      </label>
      <button disabled={pending} className={btn("navy", "py-2 text-sm")}>
        {pending ? "Moving…" : "Move appointment"}
      </button>
      {state.message && <p className="w-full text-ink-80">{state.message}</p>}
    </form>
  );
}
