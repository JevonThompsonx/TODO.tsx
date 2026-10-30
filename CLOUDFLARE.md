# Cloudflare hosting

Migrated from Vercel to Cloudflare Workers on **2026-10-30**. The Vercel account is
suspended (`HTTP 402` / `DEPLOYMENT_DISABLED`) — do not redeploy there.

## PENDING: Supabase auth is not configured

The Worker runs in **guest-session mode** (`src/lib/auth.ts` falls back to a
`guest@local.dev` user). To enable real accounts: put `NEXT_PUBLIC_SUPABASE_URL`
and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env` (plus `SUPABASE_SERVICE_ROLE_KEY`
only if admin features are needed), then run `npm run deploy:cf` — the script
uploads them as Worker secrets. Until then every visitor shares the guest identity.
Optional follow-up: Cloudflare Access in front of admin/private routes if the app
ever grows one.

## Live

| What | Value |
| --- | --- |
| Worker | `todo-tsx` |
| URL | https://todo-tsx.servicesorsubscriptions-natural894.workers.dev |
| Account | `363c056f9bacbdaa70d9138facfe3c25` (Workers subdomain `servicesorsubscriptions-natural894`) |

`/` returns `307` → `/todos`. `/todos` and `/api/todos` return `200`.

## Deploy

```bash
npm run deploy:cf     # tools/deploy-cloudflare.mjs
```

The script does three things in order: `vinext` build + deploy, re-upload every
secret via the REST endpoint, then health-check `/todos`. **Never run a bare
`vinext-cloudflare deploy`** (`npm run deploy:vinext`) on its own — the deploy
rewrites the binding list and drops the Worker's secrets, so the site 500s until
they are re-applied.

Worker config lives in `cloudflare.config.ts` — there is no `wrangler.jsonc`.
`vinext init` was run with `--no-install`; dependencies were installed with
`npm install` (npm lockfile). Quirk: the script's log strings still say "blog"
and `/api/posts`; it actually checks `/todos`.

## Runtime configuration

Values are read from `.env` (mode 600, never committed) and uploaded as Worker
**secrets**: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `DATABASE_URL`,
`DATABASE_AUTH_TOKEN`, and the Supabase keys — see the `CONFIG_KEYS` list in
`tools/deploy-cloudflare.mjs`. Only `TURSO_*` are mandatory; empty keys are skipped.

On Workers `process.env` is a frozen proxy that never carries secrets, so server
modules must read config through `getEnvSource()` (`src/lib/env.ts`), which merges
`globalThis.__RUNTIME_ENV__` published by `worker-entry.ts`. `src/lib/db.ts` and
`src/lib/auth.ts` are already wired this way — do not revert them.

## Database

Turso, own account, group `webdevjev`, database `todo-tsx`, migrated from the
Vercel-managed `database-beige-house` (5 todos, row counts verified).

## Verified 2026-10-30

`/` → `307` to `/todos`; `/todos` and `/api/todos` → `200`; `/api/todos` returned
5 todos. NOT VERIFIED from this machine: the Turso group/database names (no Turso
CLI here) and the deployed secret list.
