// src/lib/auth.ts
// Supabase auth — server-side session management.
// Falls back to a guest session when Supabase vars are not configured
// (local dev / CI without credentials).

import { createClient } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

export interface Session {
  user: User;
  access_token: string;
}

const GUEST_USER: User = {
  id: "guest-00000000-0000-0000-0000-000000000000",
  email: "guest@local.dev",
  role: "user",
};

const GUEST_SESSION: Session = {
  user: GUEST_USER,
  access_token: "local-dev-token",
};

/** Resolve the Supabase anon key — Vercel uses different naming conventions. */
function getAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Create a Supabase client for server-side use. Returns null when not configured. */
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getAnonKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

/** Create a Supabase admin client (service role). Server-side only. */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Returns the current session from Supabase, or a guest session as fallback.
 * Pass the access token from request headers when calling server-side.
 */
export async function getSession(accessToken?: string): Promise<Session | null> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    // No Supabase configured — return guest session for local dev
    return GUEST_SESSION;
  }

  try {
    if (accessToken) {
      const { data, error } = await supabase.auth.getUser(accessToken);
      if (error || !data.user) return null;
      return {
        user: {
          id: data.user.id,
          email: data.user.email ?? "",
          role: (data.user.role === "service_role" ? "admin" : "user") as User["role"],
        },
        access_token: accessToken,
      };
    }

    // Fallback: no token provided — return guest session
    return GUEST_SESSION;
  } catch (err) {
    console.error("[auth] getSession error:", err);
    return null;
  }
}

/** Returns the current user or null. */
export async function getCurrentUser(accessToken?: string): Promise<User | null> {
  const session = await getSession(accessToken);
  return session?.user ?? null;
}

/** Check if Supabase is configured (non-stub mode). */
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && getAnonKey());
}
