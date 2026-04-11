// src/lib/env.ts
// Boot-time environment variable validation.
// Call validateEnv() once at server startup to catch missing required vars early.
// In local dev (NODE_ENV=development) missing Turso/Supabase vars are tolerated
// because we use SQLite and guest-auth fallbacks.

export interface EnvValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

/** Validates environment variables and returns a result object.
 *  Throws in production if required vars are missing.
 */
export function validateEnv(): EnvValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const isProduction = process.env.NODE_ENV === "production";

  // ── Database ──────────────────────────────────────────────
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    if (isProduction) {
      errors.push("DATABASE_URL is required in production");
    } else {
      warnings.push("DATABASE_URL not set — using local SQLite file:./dev.db");
    }
  } else if (isProduction && dbUrl.startsWith("file:")) {
    warnings.push(
      "DATABASE_URL is set to a local file path in production — this is likely unintentional"
    );
  }

  if (isProduction && dbUrl && !dbUrl.startsWith("file:")) {
    if (!process.env.DATABASE_AUTH_TOKEN) {
      errors.push("DATABASE_AUTH_TOKEN is required when DATABASE_URL is a remote Turso URL");
    }
  }

  // ── Supabase ──────────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isProduction) {
    if (!supabaseUrl) {
      warnings.push("NEXT_PUBLIC_SUPABASE_URL not set — auth will use guest session");
    }
    if (!supabaseAnonKey) {
      warnings.push("NEXT_PUBLIC_SUPABASE_ANON_KEY not set — auth will use guest session");
    }
    if (supabaseUrl && !supabaseAnonKey) {
      errors.push(
        "NEXT_PUBLIC_SUPABASE_URL is set but NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"
      );
    }
    if (!supabaseUrl && supabaseAnonKey) {
      errors.push(
        "NEXT_PUBLIC_SUPABASE_ANON_KEY is set but NEXT_PUBLIC_SUPABASE_URL is missing"
      );
    }
  } else {
    if (!supabaseUrl || !supabaseAnonKey) {
      warnings.push("Supabase vars not set — auth will use guest session fallback");
    }
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

/** Log env validation results to console and throw if invalid in production. */
export function assertEnv(): void {
  const result = validateEnv();

  for (const w of result.warnings) {
    console.warn(`[env] WARN: ${w}`);
  }

  if (!result.valid) {
    for (const e of result.errors) {
      console.error(`[env] ERROR: ${e}`);
    }
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Environment validation failed:\n${result.errors.map((e) => `  - ${e}`).join("\n")}`
      );
    }
  }
}
