import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { formatInTimeZone } from "date-fns-tz";
import {
  CLINIC_TIME_ZONE,
  clinicDateISO,
  formatDay,
  formatReference,
  formatTime,
  parseReference,
  type Appointment,
} from "@decma/booking";
import { getSupabaseAdmin } from "@decma/db/admin";
import { rescheduleBooking, saveNotes, setAppointmentStatus } from "@/lib/actions";
import { Panel, Shell, btn } from "@/components/Shell";
import { RescheduleForm } from "@/components/RescheduleForm";
import { requireClinicStaff } from "@/lib/auth-gate";
import { appointmentTypeLabels, statusLabels, statusStyle } from "@/lib/labels";

export default function AppointmentPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  return (
    <Suspense fallback={<div className="container-page py-10 text-sm">Loading…</div>}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: { params: Promise<{ reference: string }> }) {
  await connection();
  const gate = await requireClinicStaff();
  if (gate.kind === "unconfigured") {
    return (
      <div className="container-page py-10">
        <p className="bg-white p-6 text-sm">Supabase is not configured.</p>
      </div>
    );
  }

  const { reference: raw } = await params;
  const reference = parseReference(raw);
  if (!reference) notFound();

  const { data, error } = await getSupabaseAdmin()
    .from("appointments")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();
  if (error) throw error;
  if (!data) notFound();
  const appt = data as Appointment;
  const day = clinicDateISO(new Date(appt.starts_at));
  const time = formatInTimeZone(new Date(appt.starts_at), CLINIC_TIME_ZONE, "HH:mm");

  return (
    <Shell staffName={gate.staff!.name}>
      <Panel
        title={formatReference(appt.reference)}
        aside={
          <Link href={`/?day=${day}`} className={btn("outline")}>
            Back to day
          </Link>
        }
      >
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-60">Patient</dt>
            <dd className="font-semibold">{appt.full_name}</dd>
          </div>
          <div>
            <dt className="text-ink-60">Status</dt>
            <dd>
              <span className={`px-2 py-0.5 text-xs font-semibold ${statusStyle[appt.status]}`}>
                {statusLabels[appt.status]}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-ink-60">When</dt>
            <dd className="font-semibold">
              {formatDay(new Date(appt.starts_at), "en")}, {formatTime(new Date(appt.starts_at))}
            </dd>
          </div>
          <div>
            <dt className="text-ink-60">Type</dt>
            <dd>{appointmentTypeLabels[appt.appointment_type]}</dd>
          </div>
          <div>
            <dt className="text-ink-60">Phone</dt>
            <dd>
              <a className="text-navy underline" href={`tel:${appt.phone.replace(/[^\d+]/g, "")}`}>
                {appt.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-ink-60">Email</dt>
            <dd>{appt.email.endsWith("@decma.local") ? "— (walk-in, no email)" : appt.email}</dd>
          </div>
        </dl>

        <form action={saveNotes} className="mt-6 space-y-2">
          <input type="hidden" name="id" value={appt.id} />
          <label className="block text-sm font-semibold">
            Reception notes
            <textarea
              name="notes"
              rows={4}
              defaultValue={appt.notes ?? ""}
              className="mt-1 w-full border border-navy-40 px-3 py-2 text-sm font-normal"
              placeholder="Allergies, preferred language, follow-up…"
            />
          </label>
          <button className={btn("navy", "py-2 text-sm")}>Save notes</button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["confirmed", "arrived", "completed", "no_show", "cancelled"] as const)
            .filter((s) => s !== appt.status)
            .map((status) => (
              <form key={status} action={setAppointmentStatus}>
                <input type="hidden" name="id" value={appt.id} />
                <input type="hidden" name="status" value={status} />
                {status === "cancelled" && (
                  <label className="mr-2 inline-flex items-center gap-1 text-xs text-ink-60">
                    <input type="checkbox" name="notify" defaultChecked={!appt.email.endsWith("@decma.local")} /> Notify
                    patient
                  </label>
                )}
                <button className={btn(status === "cancelled" ? "danger" : "outline")}>{statusLabels[status]}</button>
              </form>
            ))}
        </div>
      </Panel>

      {appt.status !== "cancelled" && (
        <Panel title="Reschedule">
          <RescheduleForm
            appointmentId={appt.id}
            defaultDate={day}
            defaultTime={time}
            action={rescheduleBooking}
          />
        </Panel>
      )}
    </Shell>
  );
}
