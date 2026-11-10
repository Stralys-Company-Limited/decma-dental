import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAdmin, isSupabaseConfigured, supabasePublicKey, supabaseUrl } from "./admin";

export function isAuthConfigured(): boolean {
  return isSupabaseConfigured() && !!supabasePublicKey();
}

/** Cookie-based Supabase client for staff sign-in (public anon key + the user's session). */
export async function getSupabaseAuth() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl()!, supabasePublicKey()!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only; the session is refreshed on the next action.
        }
      },
    },
  });
}

/** Returns the signed-in staff member, or null if the visitor is not signed in or not on the staff list. */
export async function getStaffUser() {
  if (!isAuthConfigured()) return null;
  const supabase = await getSupabaseAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await getSupabaseAdmin().from("staff").select("user_id, display_name").eq("user_id", user.id).maybeSingle();
  if (!data) return null;
  return { id: user.id, email: user.email ?? "", name: (data.display_name as string | null) ?? user.email ?? "Staff" };
}
