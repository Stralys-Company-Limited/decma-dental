import { Suspense } from "react";
import { connection } from "next/server";
import { appointmentTypes, clinicDateISO, getDaySlots } from "@decma/booking";
import { Panel, Shell } from "@/components/Shell";
import { WalkInForm } from "@/components/WalkInForm";
import { requireClinicStaff } from "@/lib/auth-gate";
import { appointmentTypeLabels } from "@/lib/labels";

export default function BookPage() {
  return (
    <Suspense fallback={<div className="container-page py-10 text-sm">Loading…</div>}>
      <Book />
    </Suspense>
  );
}

async function Book() {
  await connection();
  const gate = await requireClinicStaff();
  if (gate.kind === "unconfigured") {
    return (
      <div className="container-page py-10">
        <p className="bg-white p-6 text-sm">Supabase is not configured.</p>
      </div>
    );
  }

  const today = clinicDateISO();
  const slots = await getDaySlots(today);

  return (
    <Shell staffName={gate.staff!.name}>
      <Panel title="Book a walk-in / staff booking">
        <p className="mb-4 text-sm text-ink-80">
          Creates a confirmed appointment. Leave email empty for walk-ins who do not need email confirmation (keep Notify
          off).
        </p>
        <WalkInForm
          today={today}
          initialSlots={slots.map((s) => s.time)}
          types={appointmentTypes.map((t) => ({ value: t, label: appointmentTypeLabels[t] }))}
        />
      </Panel>
    </Shell>
  );
}
