import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Accepts both our .env names and the names the Vercel Supabase integration injects.
export function supabaseUrl(): string | undefined {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || undefined;
}

function serviceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || undefined;
}

/** Public (anon / publishable) key, used only for staff sign-in. */
export function supabasePublicKey(): string | undefined {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLIC_KEY ||
    undefined
  );
}

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl() && serviceRoleKey());
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
  client ??= createClient(supabaseUrl()!, serviceRoleKey()!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
