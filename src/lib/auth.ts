// src/lib/auth.ts
// Auth stub — Supabase-shaped interface.
// In production: replace with real @supabase/ssr client using environment vars:
//   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
//
// For local/workaround mode (no Supabase credentials): returns a guest session.

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

/**
 * Returns the current session.
 * - If NEXT_PUBLIC_SUPABASE_URL is set, this should be replaced with real Supabase auth.
 * - For now returns a static guest session to keep the app functional locally.
 */
export async function getSession(): Promise<Session | null> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // TODO: wire up real Supabase client here
    // const supabase = createServerClient(...)
    // const { data } = await supabase.auth.getSession()
    // return data.session
    console.warn("[auth] Supabase URL set but real auth not wired yet.");
  }
  // Local workaround: always return guest session
  return {
    user: GUEST_USER,
    access_token: "local-dev-token",
  };
}

/**
 * Returns the current user or null.
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}
