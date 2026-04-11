// tests/unit/auth.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock @supabase/supabase-js before importing auth module
vi.mock("@supabase/supabase-js", () => {
  const mockGetUser = vi.fn();
  const mockCreateClient = vi.fn(() => ({
    auth: { getUser: mockGetUser },
  }));
  return { createClient: mockCreateClient, mockGetUser };
});

import { createClient } from "@supabase/supabase-js";
import {
  getSession,
  getCurrentUser,
  createSupabaseServerClient,
  createSupabaseAdminClient,
  isSupabaseConfigured,
} from "@/lib/auth";

const BASE_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: undefined as string | undefined,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: undefined as string | undefined,
  SUPABASE_ANON_KEY: undefined as string | undefined,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined as string | undefined,
  SUPABASE_SERVICE_ROLE_KEY: undefined as string | undefined,
};

function setEnv(overrides: Partial<typeof BASE_ENV>) {
  const merged = { ...BASE_ENV, ...overrides };
  for (const [k, v] of Object.entries(merged)) {
    if (v === undefined) {
      delete process.env[k];
    } else {
      process.env[k] = v;
    }
  }
}

beforeEach(() => {
  vi.clearAllMocks();
  setEnv({});
});

afterEach(() => {
  setEnv({});
});

// ─── No Supabase config → guest fallback ─────────────────────────────────────

describe("auth — no Supabase config (guest fallback)", () => {
  it("isSupabaseConfigured returns false when no vars set", () => {
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("createSupabaseServerClient returns null when no vars", () => {
    expect(createSupabaseServerClient()).toBeNull();
  });

  it("createSupabaseAdminClient returns null when no service key", () => {
    setEnv({ NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co" });
    expect(createSupabaseAdminClient()).toBeNull();
  });

  it("getSession returns guest session when not configured", async () => {
    const session = await getSession();
    expect(session).not.toBeNull();
    expect(session!.user.email).toBe("guest@local.dev");
    expect(session!.access_token).toBe("local-dev-token");
  });

  it("getSession with token still returns guest when not configured", async () => {
    const session = await getSession("some-token");
    expect(session).not.toBeNull();
    expect(session!.user.email).toBe("guest@local.dev");
  });

  it("getCurrentUser returns guest user when not configured", async () => {
    const user = await getCurrentUser();
    expect(user).not.toBeNull();
    expect(user!.role).toBe("user");
    expect(user!.email).toBe("guest@local.dev");
  });
});

// ─── Supabase configured ──────────────────────────────────────────────────────

describe("auth — Supabase configured", () => {
  beforeEach(() => {
    setEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-anon-key",
    });
  });

  it("isSupabaseConfigured returns true", () => {
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("createSupabaseServerClient returns a client", () => {
    const client = createSupabaseServerClient();
    expect(client).not.toBeNull();
    expect(createClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key",
      expect.any(Object)
    );
  });

  it("isSupabaseConfigured true with SUPABASE_ANON_KEY fallback", () => {
    setEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      SUPABASE_ANON_KEY: "fallback-anon-key",
    });
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("isSupabaseConfigured true with NEXT_PUBLIC_SUPABASE_ANON_KEY fallback", () => {
    setEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "legacy-anon-key",
    });
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("getSession without token returns guest session (no token = no Supabase call)", async () => {
    const session = await getSession();
    expect(session).not.toBeNull();
    expect(session!.user.email).toBe("guest@local.dev");
  });

  it("getSession with valid token returns real user", async () => {
    // Mock createClient so getUser resolves with a user
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "user-abc-123",
              email: "real@example.com",
              role: "authenticated",
            },
          },
          error: null,
        }),
      },
    } as unknown as ReturnType<typeof createClient>);

    const session = await getSession("valid-token");
    expect(session).not.toBeNull();
    expect(session!.user.id).toBe("user-abc-123");
    expect(session!.user.email).toBe("real@example.com");
    expect(session!.user.role).toBe("user");
    expect(session!.access_token).toBe("valid-token");
  });

  it("getSession maps service_role to admin", async () => {
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "admin-id",
              email: "admin@example.com",
              role: "service_role",
            },
          },
          error: null,
        }),
      },
    } as unknown as ReturnType<typeof createClient>);

    const session = await getSession("admin-token");
    expect(session!.user.role).toBe("admin");
  });

  it("getSession returns null on Supabase error", async () => {
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: new Error("invalid token"),
        }),
      },
    } as unknown as ReturnType<typeof createClient>);

    const session = await getSession("bad-token");
    expect(session).toBeNull();
  });

  it("getSession returns null when getUser throws", async () => {
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockRejectedValue(new Error("network error")),
      },
    } as unknown as ReturnType<typeof createClient>);

    const session = await getSession("throw-token");
    expect(session).toBeNull();
  });

  it("getCurrentUser returns user from session", async () => {
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: { id: "u1", email: "u@test.com", role: "authenticated" },
          },
          error: null,
        }),
      },
    } as unknown as ReturnType<typeof createClient>);

    const user = await getCurrentUser("valid-token");
    expect(user).not.toBeNull();
    expect(user!.email).toBe("u@test.com");
  });

  it("getCurrentUser returns null when session is null", async () => {
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: new Error("bad"),
        }),
      },
    } as unknown as ReturnType<typeof createClient>);

    const user = await getCurrentUser("bad-token");
    expect(user).toBeNull();
  });
});

// ─── Admin client ─────────────────────────────────────────────────────────────

describe("auth — admin client", () => {
  it("createSupabaseAdminClient returns client when all vars present", () => {
    setEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-secret",
    });
    const client = createSupabaseAdminClient();
    expect(client).not.toBeNull();
    expect(createClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "service-role-secret",
      expect.any(Object)
    );
  });

  it("createSupabaseAdminClient returns null when URL missing", () => {
    setEnv({ SUPABASE_SERVICE_ROLE_KEY: "service-role-secret" });
    expect(createSupabaseAdminClient()).toBeNull();
  });
});
