"use client";

import { useActionState } from "react";
import { addClosure } from "@/lib/actions/admin";
import { initialFormState } from "@/lib/forms";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/forms/Fields";

export function ClosureForm() {
  const [state, action, pending] = useActionState(addClosure, initialFormState);
  return (
    <form action={action} className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="closure-day">
          Date
        </label>
        <input id="closure-day" name="day" type="date" required className="border border-navy-40 px-3 py-2 text-sm" />
        <label className="sr-only" htmlFor="closure-reason">
          Reason
        </label>
        <input
          id="closure-reason"
          name="reason"
          placeholder="Reason (optional)"
          className="min-w-0 flex-1 border border-navy-40 px-3 py-2 text-sm"
        />
        <Button type="submit" variant="navy" className="py-2" disabled={pending}>
          Close day
        </Button>
      </div>
      {state.status !== "idle" && state.message && <FormAlert status={state.status} message={state.message} />}
    </form>
  );
}
