import { timingSafeEqual } from "node:crypto";
import { getSupabaseAdmin, isSupabaseConfigured } from "@decma/db/admin";
import { sendBookingReminder } from "@decma/notify";
import type { Appointment } from "@decma/booking/types";

/**
 * Runs once a day at 09:00 Tanzania time (vercel.json; Vercel Hobby allows daily crons only), so a 36-hour
 * window reminds every appointment up to tomorrow evening.
 */
const WINDOW_HOURS = 36;
/** Skip bookings made very recently: the confirmation email has only just gone out. */
const MIN_AGE_HOURS = 2;

function authorised(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get("authorization") ?? "";
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(header);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Sends one reminder per confirmed appointment starting within the next WINDOW_HOURS. */
export async function GET(req: Request) {
  if (!authorised(req)) return new Response("Unauthorized", { status: 401 });
  if (!isSupabaseConfigured()) return Response.json({ sent: 0, skipped: "supabase not configured" });

  const db = getSupabaseAdmin();
  const now = Date.now();
  const { data, error } = await db
    .from("appointments")
    .select("*")
    .eq("status", "confirmed")
    .is("reminder_sent_at", null)
    .gt("starts_at", new Date(now).toISOString())
    .lte("starts_at", new Date(now + WINDOW_HOURS * 3_600_000).toISOString())
    .lte("created_at", new Date(now - MIN_AGE_HOURS * 3_600_000).toISOString());
  if (error) return Response.json({ error: error.message }, { status: 500 });

  let sent = 0;
  for (const appt of data as Appointment[]) {
    // Claim the row first so overlapping runs cannot send the same reminder twice.
    const { data: claimed } = await db
      .from("appointments")
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq("id", appt.id)
      .is("reminder_sent_at", null)
      .select("id")
      .maybeSingle();
    if (!claimed) continue;

    if (await sendBookingReminder(appt)) {
      sent++;
    } else {
      await db.from("appointments").update({ reminder_sent_at: null }).eq("id", appt.id);
    }
  }

  return Response.json({ sent, checked: data.length });
}
