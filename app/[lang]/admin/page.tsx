import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStaffUser, isAuthConfigured } from "@/lib/supabase/auth";
import { markHandled, removeClosure, setAppointmentStatus, signOut } from "@/lib/actions/admin";
import { getDictionaryFor } from "@/lib/i18n/dictionaries";
import { addDaysISO, clinicDateISO, clinicInstant, formatDay, formatTime, isValidDateISO } from "@/lib/booking/time";
import type { Appointment } from "@/lib/booking/types";
import { formatReference, parseReference } from "@/lib/booking/reference";
import { ClosureForm } from "@/components/admin/ClosureForm";
import { buttonClass } from "@/components/ui/Button";

const en = getDictionaryFor("en");

type Callback = {
  id: string;
  full_name: string;
  phone: string;
  appointment_type: keyof typeof en.appointmentTypes;
  preferred_date: string | null;
  locale: string;
  created_at: string;
};
type Referral = {
  id: string;
  practitioner_name: string;
  practice: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
};

export default function AdminPage({ searchParams }: PageProps<"/[lang]/admin">) {
  return (
    <Suspense fallback={<div className="container-page py-10 text-sm text-ink-80">Loading…</div>}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}

function Panel({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

const statusStyle: Record<Appointment["status"], string> = {
  confirmed: "bg-teal-20 text-navy-deep",
  pending: "bg-navy-20 text-navy",
  cancelled: "bg-ink-20 text-ink-80 line-through",
};

async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection();
  if (!isAuthConfigured()) {
    return (
      <div className="container-page py-10">
        <p className="bg-white p-6 text-sm">
          Supabase is not configured. Set the environment variables in <code>.env.example</code> and run the migration in{" "}
          <code>supabase/migrations</code>.
        </p>
      </div>
    );
  }

  const staff = await getStaffUser();
  if (!staff) redirect("/admin/login");

  const sp = await searchParams;
  const today = clinicDateISO();
  const start = typeof sp.day === "string" && isValidDateISO(sp.day) ? sp.day : today;
  const end = addDaysISO(start, 7);
  const db = getSupabaseAdmin();
  const refQuery = typeof sp.ref === "string" ? sp.ref : "";
  const ref = refQuery ? parseReference(refQuery) : null;
  const found = ref
    ? ((await db.from("appointments").select("*").eq("reference", ref).maybeSingle()).data as Appointment | null)
    : null;

  const [appts, callbacks, referrals, closures] = await Promise.all([
    db
      .from("appointments")
      .select("*")
      .gte("starts_at", clinicInstant(start, "00:00").toISOString())
      .lt("starts_at", clinicInstant(end, "00:00").toISOString())
      .order("starts_at"),
    db.from("callback_requests").select("*").is("handled_at", null).order("created_at", { ascending: false }).limit(50),
    db.from("referral_requests").select("*").is("handled_at", null).order("created_at", { ascending: false }).limit(50),
    db.from("closures").select("day, reason").gte("day", today).order("day").limit(60),
  ]);

  const byDay = new Map<string, Appointment[]>();
  for (const a of (appts.data ?? []) as Appointment[]) {
    const d = clinicDateISO(new Date(a.starts_at));
    byDay.set(d, [...(byDay.get(d) ?? []), a]);
  }
  const days = Array.from({ length: 7 }, (_, i) => addDaysISO(start, i));

  return (
    <div className="container-page space-y-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-ink-80">
          Signed in as <strong>{staff.name}</strong>
        </p>
        <form action={signOut}>
          <button type="submit" className="text-sm font-semibold text-navy underline underline-offset-4">
            Sign out
          </button>
        </form>
      </div>

      <Panel title="Find by appointment number">
        <form method="get" action="/admin" className="flex flex-wrap gap-2">
          <label htmlFor="ref" className="sr-only">
            Appointment number
          </label>
          <input
            id="ref"
            name="ref"
            defaultValue={refQuery}
            placeholder="DC-4827-1593"
            className="min-w-0 flex-1 border border-navy-40 px-3 py-2 text-sm uppercase"
          />
          <button className={buttonClass("navy", "py-2")}>Find</button>
        </form>
        {refQuery && (
          <div className="mt-4 text-sm">
            {found ? (
              <p>
                <strong>{formatReference(found.reference)}</strong> · {found.full_name} ·{" "}
                {formatDay(new Date(found.starts_at), "en")}, {formatTime(new Date(found.starts_at), "en")} ·{" "}
                {found.phone} · <span className={`px-2 py-0.5 text-xs font-semibold ${statusStyle[found.status]}`}>{found.status}</span>{" "}
                <Link className="font-semibold text-navy underline" href={`/admin?day=${clinicDateISO(new Date(found.starts_at))}`}>
                  Show that week
                </Link>
              </p>
            ) : (
              <p className="text-ink-60">No appointment with that number.</p>
            )}
          </div>
        )}
      </Panel>

      <Panel
        title={`Appointments: ${formatDay(start, "en")} to ${formatDay(addDaysISO(end, -1), "en")}`}
        aside={
          <nav className="flex gap-2 text-sm" aria-label="Week">
            <Link className={buttonClass("outlineNavy", "py-1.5")} href={`/admin?day=${addDaysISO(start, -7)}`}>
              Previous week
            </Link>
            <Link className={buttonClass("outlineNavy", "py-1.5")} href="/admin">
              Today
            </Link>
            <Link className={buttonClass("outlineNavy", "py-1.5")} href={`/admin?day=${end}`}>
              Next week
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
                  {formatDay(d, "en")} <span className="font-normal text-ink-60">({list.length})</span>
                </h3>
                {list.length === 0 ? (
                  <p className="py-2 text-sm text-ink-60">No appointments.</p>
                ) : (
                  <ul className="divide-y divide-line">
                    {list.map((a) => (
                      <li key={a.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 text-sm">
                        <span className="w-14 font-bold">{formatTime(new Date(a.starts_at), "en")}</span>
                        <span className="min-w-48 flex-1">
                          <strong>{a.full_name}</strong> · {formatReference(a.reference)} ·{" "}
                          {en.appointmentTypes[a.appointment_type]}
                          <br />
                          <a className="text-navy underline" href={`tel:${a.phone.replace(/[^\d+]/g, "")}`}>
                            {a.phone}
                          </a>{" "}
                          · {a.email} · {a.locale.toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-semibold ${statusStyle[a.status]}`}>{a.status}</span>
                        <span className="flex gap-2">
                          {a.status === "pending" && (
                            <form action={setAppointmentStatus}>
                              <input type="hidden" name="id" value={a.id} />
                              <input type="hidden" name="status" value="confirmed" />
                              <button className={buttonClass("navy", "px-3 py-1.5 text-xs")}>Confirm</button>
                            </form>
                          )}
                          {a.status !== "cancelled" && (
                            <form action={setAppointmentStatus} className="flex items-center gap-2">
                              <input type="hidden" name="id" value={a.id} />
                              <input type="hidden" name="status" value="cancelled" />
                              <label className="flex items-center gap-1 text-xs text-ink-80">
                                <input type="checkbox" name="notify" defaultChecked className="accent-navy" /> email patient
                              </label>
                              <button className={buttonClass("outlineNavy", "px-3 py-1.5 text-xs")}>Cancel</button>
                            </form>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={`Call-back requests (${callbacks.data?.length ?? 0})`}>
          {(callbacks.data ?? []).length === 0 ? (
            <p className="text-sm text-ink-60">Nothing waiting.</p>
          ) : (
            <ul className="divide-y divide-line">
              {((callbacks.data ?? []) as Callback[]).map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                  <span>
                    <strong>{c.full_name}</strong> ·{" "}
                    <a className="text-navy underline" href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}>
                      {c.phone}
                    </a>
                    <br />
                    {en.appointmentTypes[c.appointment_type] ?? c.appointment_type}
                    {c.preferred_date ? ` · prefers ${c.preferred_date}` : ""} · {c.locale.toUpperCase()} · received{" "}
                    {formatDay(new Date(c.created_at), "en")}
                  </span>
                  <form action={markHandled}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="table" value="callback_requests" />
                    <button className={buttonClass("outlineNavy", "px-3 py-1.5 text-xs")}>Done</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title={`Referral enquiries (${referrals.data?.length ?? 0})`}>
          {(referrals.data ?? []).length === 0 ? (
            <p className="text-sm text-ink-60">Nothing waiting.</p>
          ) : (
            <ul className="divide-y divide-line">
              {((referrals.data ?? []) as Referral[]).map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                  <span>
                    <strong>{r.practitioner_name}</strong>, {r.practice}
                    <br />
                    {r.phone} · {r.email}
                    <br />
                    <span className="whitespace-pre-wrap text-ink-80">{r.message}</span>
                  </span>
                  <form action={markHandled}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="table" value="referral_requests" />
                    <button className={buttonClass("outlineNavy", "px-3 py-1.5 text-xs")}>Done</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Closed days">
        <p className="mb-4 text-sm text-ink-80">No online bookings are offered on closed days. Existing bookings are not changed.</p>
        <ClosureForm />
        <ul className="mt-5 divide-y divide-line">
          {((closures.data ?? []) as { day: string; reason: string | null }[]).map((c) => (
            <li key={c.day} className="flex items-center justify-between gap-4 py-2 text-sm">
              <span>
                <strong>{formatDay(c.day, "en")}</strong>
                {c.reason ? ` · ${c.reason}` : ""}
              </span>
              <form action={removeClosure}>
                <input type="hidden" name="day" value={c.day} />
                <button className="text-xs font-semibold text-navy underline">Reopen</button>
              </form>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
