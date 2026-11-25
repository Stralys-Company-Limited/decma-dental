import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import {
  addDaysISO,
  clinicDateISO,
  clinicInstant,
  formatDay,
  isValidDateISO,
  type Appointment,
} from "@decma/booking";
import { getSupabaseAdmin } from "@decma/db/admin";
import { AppointmentRow } from "@/components/AppointmentRow";
import { Panel, Shell, btn } from "@/components/Shell";
import { requireClinicStaff } from "@/lib/auth-gate";

export default function WeekPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<div className="container-page py-10 text-sm">Loading…</div>}>
      <Week searchParams={searchParams} />
    </Suspense>
  );
}

async function Week({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const gate = await requireClinicStaff();
  if (gate.kind === "unconfigured") {
    return <div className="container-page py-10"><p className="bg-white p-6 text-sm">Supabase is not configured.</p></div>;
  }

  const sp = await searchParams;
  const today = clinicDateISO();
  const start = typeof sp.day === "string" && isValidDateISO(sp.day) ? sp.day : today;
  const end = addDaysISO(start, 7);
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("appointments")
    .select("*")
    .gte("starts_at", clinicInstant(start, "00:00").toISOString())
    .lt("starts_at", clinicInstant(end, "00:00").toISOString())
    .order("starts_at");
  if (error) throw error;

  const byDay = new Map<string, Appointment[]>();
  for (const a of (data as Appointment[]) ?? []) {
    const d = clinicDateISO(new Date(a.starts_at));
    byDay.set(d, [...(byDay.get(d) ?? []), a]);
  }
  const days = Array.from({ length: 7 }, (_, i) => addDaysISO(start, i));

  return (
    <Shell staffName={gate.staff!.name}>
      <Panel
        title={`Week · ${formatDay(start, "en")} to ${formatDay(addDaysISO(end, -1), "en")}`}
        aside={
          <nav className="flex gap-2 text-sm">
            <Link className={btn("outline")} href={`/week?day=${addDaysISO(start, -7)}`}>
              Previous
            </Link>
            <Link className={btn("outline")} href="/week">
              This week
            </Link>
            <Link className={btn("outline")} href={`/week?day=${end}`}>
              Next
            </Link>
          </nav>
        }
      >
        <div className="space-y-5">
          {days.map((d) => {
            const list = byDay.get(d) ?? [];
            return (
              <div key={d}>
                <h3 className="border-b border-line pb-1 text-sm font-bold text-navy">
                  <Link href={`/?day=${d}`} className="hover:underline">
                    {formatDay(d, "en")}
                  </Link>{" "}
                  <span className="font-normal text-ink-60">({list.length})</span>
                </h3>
                {list.length === 0 ? (
                  <p className="py-2 text-sm text-ink-60">No appointments.</p>
                ) : (
                  <ul>
                    {list.map((a) => (
                      <AppointmentRow key={a.id} appt={a} />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </Panel>
    </Shell>
  );
}
