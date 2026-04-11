// src/lib/env.ts
// Boot-time environment variable validation.
// Call assertEnv() once at server startup to catch missing required vars early.
// In local dev (NODE_ENV=development) missing Turso/Supabase vars are tolerated.

export interface EnvValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

/** Validates environment variables and returns a result object. */
export function validateEnv(): EnvValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const isProduction = process.env.NODE_ENV === "production";

  // ── Database — Turso ─────────────────────────────────────
  const dbUrl = process.env.TURSO_DATABASE_URL;
  if (!dbUrl) {
    if (isProduction) {
      errors.push("TURSO_DATABASE_URL is required in production");
    } else {
      warnings.push("TURSO_DATABASE_URL not set — using local SQLite file:./dev.db");
    }
  } else if (isProduction && dbUrl.startsWith("file:")) {
    warnings.push(
      "TURSO_DATABASE_URL is set to a local file path in production — this is likely unintentional"
    );
  }

  if (isProduction && dbUrl && !dbUrl.startsWith("file:")) {
    if (!process.env.TURSO_AUTH_TOKEN) {
      errors.push("TURSO_AUTH_TOKEN is required when TURSO_DATABASE_URL is a remote Turso URL");
    }
  }

  // ── Supabase ──────────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Support both naming conventions Vercel uses
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY;

  if (isProduction) {
    if (!supabaseUrl) {
      warnings.push("NEXT_PUBLIC_SUPABASE_URL not set — auth will use guest session");
    }
    if (!supabaseAnonKey) {
      warnings.push(
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY / SUPABASE_ANON_KEY not set — auth will use guest session"
      );
    }
    if (supabaseUrl && !supabaseAnonKey) {
      errors.push(
        "NEXT_PUBLIC_SUPABASE_URL is set but no Supabase anon key found (set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)"
      );
    }
    if (!supabaseUrl && supabaseAnonKey) {
      errors.push(
        "Supabase anon key is set but NEXT_PUBLIC_SUPABASE_URL is missing"
      );
    }
  } else {
    if (!supabaseUrl || !supabaseAnonKey) {
      warnings.push("Supabase vars not set — auth will use guest session fallback");
    }
  }

  return { valid: errors.length === 0, warnings, errors };
}

/** Log env validation results. Throws in production if invalid. */
export function assertEnv(): void {
  const result = validateEnv();
  for (const w of result.warnings) console.warn(`[env] WARN: ${w}`);
  if (!result.valid) {
    for (const e of result.errors) console.error(`[env] ERROR: ${e}`);
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Environment validation failed:\n${result.errors.map((e) => `  - ${e}`).join("\n")}`
      );
    }
  }
}
