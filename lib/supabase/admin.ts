import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function supabaseUrl(): string | undefined {
  return process.env.SUPABASE_URL;
}

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let client: SupabaseClient | null = null;

/**
 * Service-role client. Bypasses row-level security, so it must only run on the server,
 * after the caller's input has been validated (and, for admin pages, after a staff check).
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  client ??= createClient(supabaseUrl()!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
