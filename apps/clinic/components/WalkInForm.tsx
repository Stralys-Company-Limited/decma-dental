"use client";

import { useActionState } from "react";
import { createWalkIn } from "@/lib/actions";
import { initialFormState } from "@/lib/forms";
import { btn } from "@/components/Shell";

export function WalkInForm({
  today,
  initialSlots,
  types,
}: {
  today: string;
  initialSlots: string[];
  types: { value: string; label: string }[];
}) {
  const [state, action, pending] = useActionState(createWalkIn, initialFormState);
  const values = state.values ?? {};

  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm sm:col-span-2">
        <span className="font-semibold">Full name</span>
        <input
          name="fullName"
          required
          defaultValue={values.fullName}
          className="mt-1 w-full border border-navy-40 px-3 py-2"
        />
      </label>
      <label className="text-sm">
        <span className="font-semibold">Phone</span>
        <input name="phone" required defaultValue={values.phone} className="mt-1 w-full border border-navy-40 px-3 py-2" />
      </label>
      <label className="text-sm">
        <span className="font-semibold">Email (optional for walk-ins)</span>
        <input
          name="email"
          type="email"
          defaultValue={values.email}
          className="mt-1 w-full border border-navy-40 px-3 py-2"
        />
      </label>
      <label className="text-sm sm:col-span-2">
        <span className="font-semibold">Appointment type</span>
        <select
          name="appointmentType"
          required
          defaultValue={values.appointmentType || "check-up"}
          className="mt-1 w-full border border-navy-40 px-3 py-2"
        >
          {types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <span className="font-semibold">Day</span>
        <input
          type="date"
          name="date"
          required
          defaultValue={values.date || today}
          className="mt-1 w-full border border-navy-40 px-3 py-2"
        />
      </label>
      <label className="text-sm">
        <span className="font-semibold">Time</span>
        <input
          type="time"
          name="time"
          required
          step={1800}
          list="slot-suggestions"
          defaultValue={values.time || initialSlots[0] || "09:00"}
          className="mt-1 w-full border border-navy-40 px-3 py-2"
        />
        <datalist id="slot-suggestions">
          {initialSlots.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </label>
      <label className="text-sm sm:col-span-2">
        <span className="font-semibold">Notes</span>
        <textarea name="notes" rows={3} defaultValue={values.notes} className="mt-1 w-full border border-navy-40 px-3 py-2" />
      </label>
      <label className="inline-flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="notify" />
        Send confirmation email / SMS
      </label>
      {state.status === "error" && <p className="text-sm text-ink-80 sm:col-span-2">{state.message}</p>}
      <button disabled={pending} className={btn("navy", "py-2 text-sm sm:col-span-2")}>
        {pending ? "Booking…" : "Create appointment"}
      </button>
    </form>
  );
}
