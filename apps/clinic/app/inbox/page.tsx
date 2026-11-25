import { Suspense } from "react";
import { connection } from "next/server";
import { getSupabaseAdmin } from "@decma/db/admin";
import { markHandled } from "@/lib/actions";
import { Panel, Shell, btn } from "@/components/Shell";
import { requireClinicStaff } from "@/lib/auth-gate";
import { appointmentTypeLabels } from "@/lib/labels";
import type { AppointmentType } from "@decma/booking";

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="container-page py-10 text-sm">Loading…</div>}>
      <Inbox />
    </Suspense>
  );
}

async function Inbox() {
  await connection();
  const gate = await requireClinicStaff();
  if (gate.kind === "unconfigured") {
    return (
      <div className="container-page py-10">
        <p className="bg-white p-6 text-sm">Supabase is not configured.</p>
      </div>
    );
  }

  const db = getSupabaseAdmin();
  const [callbacks, referrals] = await Promise.all([
    db.from("callback_requests").select("*").is("handled_at", null).order("created_at", { ascending: false }).limit(50),
    db.from("referral_requests").select("*").is("handled_at", null).order("created_at", { ascending: false }).limit(50),
  ]);

  return (
    <Shell staffName={gate.staff!.name}>
      <Panel title="Call-back requests">
        {(callbacks.data ?? []).length === 0 ? (
          <p className="text-sm text-ink-60">No open call-backs.</p>
        ) : (
          <ul className="divide-y divide-line text-sm">
            {(callbacks.data ?? []).map((c) => (
              <li key={c.id as string} className="flex flex-wrap items-start justify-between gap-3 py-3">
                <div>
                  <strong>{c.full_name as string}</strong> ·{" "}
                  <a className="text-navy underline" href={`tel:${String(c.phone).replace(/[^\d+]/g, "")}`}>
                    {c.phone as string}
                  </a>
                  <br />
                  {appointmentTypeLabels[c.appointment_type as AppointmentType] ?? String(c.appointment_type)}
                  {(c.preferred_date as string | null) ? ` · preferred ${c.preferred_date}` : ""}
                </div>
                <form action={markHandled}>
                  <input type="hidden" name="id" value={c.id as string} />
                  <input type="hidden" name="table" value="callback_requests" />
                  <button className={btn("navy")}>Mark handled</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Referral enquiries">
        {(referrals.data ?? []).length === 0 ? (
          <p className="text-sm text-ink-60">No open referrals.</p>
        ) : (
          <ul className="divide-y divide-line text-sm">
            {(referrals.data ?? []).map((r) => (
              <li key={r.id as string} className="flex flex-wrap items-start justify-between gap-3 py-3">
                <div>
                  <strong>{r.practitioner_name as string}</strong> · {r.practice as string}
                  <br />
                  <a className="text-navy underline" href={`tel:${String(r.phone).replace(/[^\d+]/g, "")}`}>
                    {r.phone as string}
                  </a>{" "}
                  · {r.email as string}
                  <p className="mt-1 whitespace-pre-wrap text-ink-80">{r.message as string}</p>
                </div>
                <form action={markHandled}>
                  <input type="hidden" name="id" value={r.id as string} />
                  <input type="hidden" name="table" value="referral_requests" />
                  <button className={btn("navy")}>Mark handled</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </Shell>
  );
}
