import { getAppointmentByToken, isToken } from "@/lib/booking/repo";
import { appointmentIcs } from "@/lib/booking/calendar-event";

export async function GET(_req: Request, ctx: RouteContext<"/api/calendar/[token]">) {
  const { token } = await ctx.params;
  if (!isToken(token)) return new Response("Not found", { status: 404 });

  const appt = await getAppointmentByToken(token);
  if (!appt) return new Response("Not found", { status: 404 });

  const ics = appointmentIcs(appt, { cancelled: appt.status === "cancelled" });
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="decma-appointment.ics"',
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
