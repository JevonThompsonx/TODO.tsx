// tests/unit/env.test.ts
// Unit tests for src/lib/env.ts

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Helper to temporarily override process.env
function withEnv(overrides: Record<string, string | undefined>, fn: () => void) {
  const original: Record<string, string | undefined> = {};
  for (const key of Object.keys(overrides)) {
    original[key] = process.env[key];
    if (overrides[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = overrides[key];
    }
  }
  try {
    fn();
  } finally {
    for (const key of Object.keys(original)) {
      if (original[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = original[key];
      }
    }
  }
}

describe("validateEnv", () => {
  let validateEnv: () => import("@/lib/env").EnvValidationResult;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/lib/env");
    validateEnv = mod.validateEnv;
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe("development mode (NODE_ENV=development)", () => {
    it("is valid with no vars set (all use fallbacks)", () => {
      withEnv(
        {
          NODE_ENV: "development",
          DATABASE_URL: undefined,
          DATABASE_AUTH_TOKEN: undefined,
          NEXT_PUBLIC_SUPABASE_URL: undefined,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
        },
        () => {
          const result = validateEnv();
          expect(result.valid).toBe(true);
          expect(result.errors).toHaveLength(0);
          expect(result.warnings.length).toBeGreaterThan(0);
        }
      );
    });

    it("emits warning when DATABASE_URL is missing", () => {
      withEnv({ NODE_ENV: "development", DATABASE_URL: undefined }, () => {
        const result = validateEnv();
        expect(result.warnings.some((w) => w.includes("DATABASE_URL"))).toBe(true);
      });
    });

    it("emits warning when Supabase vars are missing", () => {
      withEnv(
        {
          NODE_ENV: "development",
          NEXT_PUBLIC_SUPABASE_URL: undefined,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
        },
        () => {
          const result = validateEnv();
          expect(result.warnings.some((w) => w.toLowerCase().includes("supabase"))).toBe(true);
        }
      );
    });
  });

  describe("production mode (NODE_ENV=production)", () => {
    it("errors when DATABASE_URL is missing in production", () => {
      withEnv(
        {
          NODE_ENV: "production",
          DATABASE_URL: undefined,
          DATABASE_AUTH_TOKEN: undefined,
          NEXT_PUBLIC_SUPABASE_URL: undefined,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
        },
        () => {
          const result = validateEnv();
          expect(result.valid).toBe(false);
          expect(result.errors.some((e) => e.includes("DATABASE_URL"))).toBe(true);
        }
      );
    });

    it("errors when remote Turso URL is set but auth token is missing", () => {
      withEnv(
        {
          NODE_ENV: "production",
          DATABASE_URL: "libsql://my-db.turso.io",
          DATABASE_AUTH_TOKEN: undefined,
        },
        () => {
          const result = validateEnv();
          expect(result.valid).toBe(false);
          expect(result.errors.some((e) => e.includes("DATABASE_AUTH_TOKEN"))).toBe(true);
        }
      );
    });

    it("is valid when both DATABASE_URL and DATABASE_AUTH_TOKEN are set", () => {
      withEnv(
        {
          NODE_ENV: "production",
          DATABASE_URL: "libsql://my-db.turso.io",
          DATABASE_AUTH_TOKEN: "token123",
          NEXT_PUBLIC_SUPABASE_URL: undefined,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
        },
        () => {
          const result = validateEnv();
          expect(result.valid).toBe(true);
        }
      );
    });

    it("warns when file DB is used in production", () => {
      withEnv(
        {
          NODE_ENV: "production",
          DATABASE_URL: "file:./dev.db",
          DATABASE_AUTH_TOKEN: undefined,
        },
        () => {
          const result = validateEnv();
          // valid (no error for file: in prod) but warns
          expect(result.warnings.some((w) => w.includes("file path"))).toBe(true);
        }
      );
    });

    it("errors when only one Supabase key is provided", () => {
      withEnv(
        {
          NODE_ENV: "production",
          DATABASE_URL: "libsql://my-db.turso.io",
          DATABASE_AUTH_TOKEN: "tok",
          NEXT_PUBLIC_SUPABASE_URL: "https://xxx.supabase.co",
          NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
        },
        () => {
          const result = validateEnv();
          expect(result.valid).toBe(false);
          expect(
            result.errors.some(
              (e) => e.includes("NEXT_PUBLIC_SUPABASE_URL") || e.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY")
            )
          ).toBe(true);
        }
      );
    });
  });
});
