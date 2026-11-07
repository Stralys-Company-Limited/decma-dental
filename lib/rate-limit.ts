import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

const WINDOW_MINUTES = 15;
const LIMITS = { booking: 5, callback: 5, referral: 5, cancel: 10, lookup: 10 } as const;
export type SubmissionKind = keyof typeof LIMITS;

async function clientIpHash(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const salt = process.env.RATE_LIMIT_SALT ?? process.env.CRON_SECRET ?? "decma";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/** Records a submission and returns false when the caller is over the limit. IPs are stored hashed. */
export async function checkRateLimit(kind: SubmissionKind): Promise<boolean> {
  // Only reachable without Supabase in local demo mode (see lib/booking/store.ts), where there is nothing to protect.
  if (!isSupabaseConfigured()) return true;
  const db = getSupabaseAdmin();
  const ipHash = await clientIpHash();
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

  const { count, error } = await db
    .from("submission_log")
    .select("id", { count: "exact", head: true })
    .eq("kind", kind)
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if (error) throw error;
  if ((count ?? 0) >= LIMITS[kind]) return false;

  await db.from("submission_log").insert({ kind, ip_hash: ipHash });
  return true;
}
