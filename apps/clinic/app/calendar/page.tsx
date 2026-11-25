import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import {
  clinicDateISO,
  clinicInstant,
  daysInMonth,
  formatMonth,
  monthKey,
  shiftMonth,
  weekdayOf,
} from "@decma/booking";
import { getSupabaseAdmin } from "@decma/db/admin";
import { Panel, Shell, btn } from "@/components/Shell";
import { requireClinicStaff } from "@/lib/auth-gate";

export default function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<div className="container-page py-10 text-sm">Loading…</div>}>
      <Calendar searchParams={searchParams} />
    </Suspense>
  );
}

async function Calendar({
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
  const month =
    typeof sp.month === "string" && /^\d{4}-\d{2}$/.test(sp.month) ? sp.month : monthKey(today);
  const days = daysInMonth(month);
  const first = days[0];
  const last = days[days.length - 1];
  const db = getSupabaseAdmin();

  const [appts, closures, hours] = await Promise.all([
    db
      .from("appointments")
      .select("starts_at, status")
      .gte("starts_at", clinicInstant(first, "00:00").toISOString())
      .lte("starts_at", clinicInstant(last, "23:59").toISOString())
      .neq("status", "cancelled"),
    db.from("closures").select("day, reason").gte("day", first).lte("day", last),
    db.from("opening_hours").select("weekday"),
  ]);

  const counts = new Map<string, number>();
  for (const a of appts.data ?? []) {
    const d = clinicDateISO(new Date(a.starts_at as string));
    counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  const closed = new Map((closures.data ?? []).map((c) => [c.day as string, (c.reason as string) || "Closed"]));
  const openWeekdays = new Set((hours.data ?? []).map((h) => h.weekday as number));

  const lead = weekdayOf(first);
  const cells: (string | null)[] = [...Array(lead).fill(null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Shell staffName={gate.staff!.name}>
      <Panel
        title={formatMonth(month, "en")}
        aside={
          <nav className="flex gap-2 text-sm">
            <Link className={btn("outline")} href={`/calendar?month=${shiftMonth(month, -1)}`}>
              Previous
            </Link>
            <Link className={btn("outline")} href="/calendar">
              This month
            </Link>
            <Link className={btn("outline")} href={`/calendar?month=${shiftMonth(month, 1)}`}>
              Next
            </Link>
          </nav>
        }
      >
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-60">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={`e-${i}`} className="min-h-20 bg-transparent" />;
            const count = counts.get(d) ?? 0;
            const closure = closed.get(d);
            const isClosedDay = !!closure || !openWeekdays.has(weekdayOf(d));
            const isToday = d === today;
            return (
              <Link
                key={d}
                href={`/?day=${d}`}
                className={`min-h-20 border p-2 text-left text-sm ${
                  isToday ? "border-teal bg-teal-20" : "border-line bg-white"
                } ${isClosedDay ? "opacity-70" : ""}`}
              >
                <div className="font-bold">{Number(d.slice(-2))}</div>
                {closure ? (
                  <div className="mt-1 text-xs text-ink-60">{closure}</div>
                ) : isClosedDay ? (
                  <div className="mt-1 text-xs text-ink-60">Closed</div>
                ) : (
                  <div className="mt-1 text-xs text-navy">{count} booking{count === 1 ? "" : "s"}</div>
                )}
              </Link>
            );
          })}
        </div>
      </Panel>
    </Shell>
  );
}
