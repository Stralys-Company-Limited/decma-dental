import { Suspense } from "react";
import { connection } from "next/server";
import { listOpeningHours } from "@decma/booking";
import { getSupabaseAdmin } from "@decma/db/admin";
import { addClosure, removeClosure, removeOpeningHours, saveOpeningHours } from "@/lib/actions";
import { ClosureForm } from "@/components/ClosureForm";
import { HoursForm } from "@/components/HoursForm";
import { Panel, Shell, btn } from "@/components/Shell";
import { requireClinicStaff } from "@/lib/auth-gate";
import { weekdayLabels } from "@/lib/labels";

export default function HoursPage() {
  return (
    <Suspense fallback={<div className="container-page py-10 text-sm">Loading…</div>}>
      <Hours />
    </Suspense>
  );
}

async function Hours() {
  await connection();
  const gate = await requireClinicStaff();
  if (gate.kind === "unconfigured") {
    return (
      <div className="container-page py-10">
        <p className="bg-white p-6 text-sm">Supabase is not configured.</p>
      </div>
    );
  }

  const hours = await listOpeningHours();
  const { data: closures } = await getSupabaseAdmin()
    .from("closures")
    .select("day, reason")
    .order("day")
    .limit(60);

  return (
    <Shell staffName={gate.staff!.name}>
      <Panel title="Opening hours">
        <p className="mb-4 text-sm text-ink-80">
          These hours drive online booking on the public site and available slots here.
        </p>
        <ul className="mb-6 divide-y divide-line text-sm">
          {hours.map((h) => (
            <li key={h.weekday} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span>
                <strong>{weekdayLabels[h.weekday]}</strong> · {h.opens}–{h.closes} · {h.slot_minutes} min slots
              </span>
              <form action={removeOpeningHours}>
                <input type="hidden" name="weekday" value={h.weekday} />
                <button className={btn("danger")}>Remove</button>
              </form>
            </li>
          ))}
          {hours.length === 0 && <li className="py-3 text-ink-60">No opening hours set.</li>}
        </ul>
        <HoursForm action={saveOpeningHours} />
      </Panel>

      <Panel title="Closures">
        <ul className="mb-4 divide-y divide-line text-sm">
          {(closures ?? []).map((c) => (
            <li key={c.day as string} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span>
                <strong>{c.day as string}</strong>
                {(c.reason as string) ? ` · ${c.reason}` : ""}
              </span>
              <form action={removeClosure}>
                <input type="hidden" name="day" value={c.day as string} />
                <button className={btn("danger")}>Remove</button>
              </form>
            </li>
          ))}
        </ul>
        <ClosureForm action={addClosure} />
      </Panel>
    </Shell>
  );
}
