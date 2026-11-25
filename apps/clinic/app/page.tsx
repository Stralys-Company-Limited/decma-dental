import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import {
  clinicDateISO,
  clinicInstant,
  formatDay,
  formatReference,
  parseReference,
  type Appointment,
  type AppointmentStatus,
  type AppointmentType,
  appointmentTypes,
} from "@decma/booking";
import { getSupabaseAdmin } from "@decma/db/admin";
import { AppointmentRow } from "@/components/AppointmentRow";
import { Panel, Shell, btn } from "@/components/Shell";
import { requireClinicStaff } from "@/lib/auth-gate";
import { appointmentTypeLabels, statusLabels } from "@/lib/labels";

export default function TodayPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<div className="container-page py-10 text-sm">Loading…</div>}>
      <Today searchParams={searchParams} />
    </Suspense>
  );
}

async function Today({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const gate = await requireClinicStaff();
  if (gate.kind === "unconfigured") {
    return (
      <div className="container-page py-10">
        <p className="bg-white p-6 text-sm">Supabase is not configured.</p>
      </div>
    );
  }

  const sp = await searchParams;
  const today = clinicDateISO();
  const day = typeof sp.day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(sp.day) ? sp.day : today;
  const statusFilter = typeof sp.status === "string" ? sp.status : "";
  const typeFilter = typeof sp.type === "string" ? sp.type : "";
  const refQuery = typeof sp.ref === "string" ? sp.ref : "";
  const ref = refQuery ? parseReference(refQuery) : null;
  const db = getSupabaseAdmin();

  const found = ref
    ? ((await db.from("appointments").select("*").eq("reference", ref).maybeSingle()).data as Appointment | null)
    : null;

  let query = db
    .from("appointments")
    .select("*")
    .gte("starts_at", clinicInstant(day, "00:00").toISOString())
    .lt("starts_at", clinicInstant(day, "23:59").toISOString())
    .order("starts_at");

  const { data, error } = await query;
  if (error) throw error;

  let list = (data as Appointment[]) ?? [];
  if (statusFilter && statusFilter in statusLabels) {
    list = list.filter((a) => a.status === statusFilter);
  }
  if (typeFilter && (appointmentTypes as readonly string[]).includes(typeFilter)) {
    list = list.filter((a) => a.appointment_type === typeFilter);
  }

  return (
    <Shell staffName={gate.staff!.name}>
      <Panel title={`Today · ${formatDay(day, "en")}`}>
        <form method="get" className="mb-4 flex flex-wrap gap-2">
          <input type="date" name="day" defaultValue={day} className="border border-navy-40 px-3 py-2 text-sm" />
          <select name="status" defaultValue={statusFilter} className="border border-navy-40 px-3 py-2 text-sm">
            <option value="">All statuses</option>
            {(Object.keys(statusLabels) as AppointmentStatus[]).map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
          <select name="type" defaultValue={typeFilter} className="border border-navy-40 px-3 py-2 text-sm">
            <option value="">All types</option>
            {appointmentTypes.map((t) => (
              <option key={t} value={t}>
                {appointmentTypeLabels[t as AppointmentType]}
              </option>
            ))}
          </select>
          <button className={btn("navy", "py-2 text-sm")}>Filter</button>
          <Link href="/" className={btn("outline", "py-2 text-sm")}>
            Reset
          </Link>
        </form>
        {list.length === 0 ? (
          <p className="text-sm text-ink-60">No appointments for this day.</p>
        ) : (
          <ul>
            {list.map((a) => (
              <AppointmentRow key={a.id} appt={a} />
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Find by appointment number">
        <form method="get" className="flex flex-wrap gap-2">
          <input type="hidden" name="day" value={day} />
          <input
            name="ref"
            defaultValue={refQuery}
            placeholder="DC-4827-1593"
            className="min-w-0 flex-1 border border-navy-40 px-3 py-2 text-sm uppercase"
          />
          <button className={btn("navy", "py-2 text-sm")}>Find</button>
        </form>
        {refQuery && (
          <div className="mt-4 text-sm">
            {found ? (
              <p>
                <strong>{formatReference(found.reference)}</strong> · {found.full_name} ·{" "}
                {formatDay(new Date(found.starts_at), "en")} · {statusLabels[found.status]} ·{" "}
                <Link className="font-semibold text-navy underline" href={`/appointments/${found.reference}`}>
                  Open
                </Link>
              </p>
            ) : (
              <p className="text-ink-60">No appointment with that number.</p>
            )}
          </div>
        )}
      </Panel>
    </Shell>
  );
}
