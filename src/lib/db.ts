// src/lib/db.ts
// Turso/libsql client — uses local file SQLite when TURSO_DATABASE_URL is not set.
// In production, set TURSO_DATABASE_URL=libsql://your-db.turso.io and
// TURSO_AUTH_TOKEN=your-token in environment variables.

import { createClient } from "@libsql/client";

let _client: ReturnType<typeof createClient> | null = null;

export function getDb() {
  if (_client) return _client;

  const url = process.env.TURSO_DATABASE_URL ?? "file:./dev.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  _client = createClient({ url, authToken });
  return _client;
}

export async function initDb() {
  const db = getDb();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS todos (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      due_date    TEXT,
      completed   INTEGER NOT NULL DEFAULT 0,
      priority    TEXT NOT NULL DEFAULT 'medium',
      tags        TEXT NOT NULL DEFAULT '[]',
      list_id     TEXT,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    )
  `);
}
