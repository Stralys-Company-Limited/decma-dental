import Link from "next/link";
import { formatReference, formatTime, type Appointment } from "@decma/booking";
import { setAppointmentStatus } from "@/lib/actions";
import { appointmentTypeLabels, statusLabels, statusStyle } from "@/lib/labels";
import { btn } from "@/components/Shell";

const nextActions: Partial<Record<Appointment["status"], Appointment["status"][]>> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["arrived", "no_show", "cancelled"],
  arrived: ["completed", "cancelled"],
  completed: [],
  no_show: ["confirmed"],
  cancelled: ["confirmed"],
};

export function AppointmentRow({ appt }: { appt: Appointment }) {
  const actions = nextActions[appt.status] ?? [];
  return (
    <li className="flex flex-wrap items-start gap-x-4 gap-y-2 border-b border-line py-3 text-sm last:border-0">
      <span className="w-20 font-bold">{formatTime(new Date(appt.starts_at))}</span>
      <div className="min-w-48 flex-1">
        <Link href={`/appointments/${appt.reference}`} className="font-bold text-navy underline-offset-2 hover:underline">
          {appt.full_name}
        </Link>
        <span className="text-ink-60"> · {formatReference(appt.reference)} · {appointmentTypeLabels[appt.appointment_type]}</span>
        <br />
        <a className="text-navy underline" href={`tel:${appt.phone.replace(/[^\d+]/g, "")}`}>
          {appt.phone}
        </a>
        {appt.notes ? <p className="mt-1 text-ink-60">{appt.notes}</p> : null}
      </div>
      <span className={`px-2 py-0.5 text-xs font-semibold ${statusStyle[appt.status]}`}>{statusLabels[appt.status]}</span>
      <span className="flex flex-wrap gap-2">
        {actions.map((status) => (
          <form key={status} action={setAppointmentStatus}>
            <input type="hidden" name="id" value={appt.id} />
            <input type="hidden" name="status" value={status} />
            {status === "cancelled" && (
              <label className="mr-2 inline-flex items-center gap-1 text-xs text-ink-60">
                <input type="checkbox" name="notify" defaultChecked /> Notify
              </label>
            )}
            <button className={btn(status === "cancelled" ? "danger" : "navy")}>{statusLabels[status]}</button>
          </form>
        ))}
        <Link href={`/appointments/${appt.reference}`} className={btn("outline")}>
          Open
        </Link>
      </span>
    </li>
  );
}
