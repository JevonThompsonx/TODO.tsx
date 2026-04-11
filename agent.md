# Project: TODO.tsx

**Last updated:** 2026-04-11
**Owner(s):** JevonThompsonx — Product & Repo Owner

---

## Summary

A Next.js 16 TypeScript to-do web app with App Router, Turso DB (local SQLite workaround), Tailwind CSS v4, Vitest unit tests, Playwright e2e, and Vercel CI/CD via GitHub Actions. Repo bootstrapped from affaan-m/everything-claude-code as a history-less snapshot.

---

## Current sprint / focus

- **Sprint:** bootstrap-stack
- **Goals:**
  - [x] Scaffold Next.js 16 + Tailwind v4 + App Router
  - [x] Turso/libsql DB layer with local SQLite fallback (no creds needed locally)
  - [x] Full CRUD API routes + UI (list, create, toggle, edit, delete)
  - [x] Auth stub (Supabase-shaped, local guest session workaround)
  - [x] 15 unit tests (Vitest) — all passing
  - [x] Playwright e2e smoke test skeleton
  - [x] GitHub Actions CI (lint, typecheck, unit tests, build, deploy)
  - [ ] Wire real Turso DB (set DATABASE_URL + DATABASE_AUTH_TOKEN in Vercel/GH)
  - [ ] Wire real Supabase auth (set SUPABASE_* vars)
  - [ ] Link Vercel project (set VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)

---

## Backlog / To do

- [ ] Wire real Turso DB instance and run migrations
- [ ] Implement real Supabase auth (sign-up, sign-in, sign-out)
- [ ] Vercel project link + first production deploy
- [ ] Add axe-core accessibility CI check
- [ ] Add Lighthouse CI post-deploy
- [ ] Add Sentry error monitoring (DSN as secret)
- [ ] Add structured logging + correlation IDs on API routes
- [ ] Add Dependabot config
- [ ] Add list management (multiple todo lists)
- [ ] Add drag-to-reorder

---

## In progress

- Wiring Vercel + Turso + Supabase secrets — owner: repo owner — blocked: needs real credentials

---

## Done (recent)

- Bootstrapped Next.js 16 app with App Router, Tailwind v4 — 2026-04-11
- Built full CRUD (API routes + UI components) — 2026-04-11
- Added local SQLite workaround via @libsql/client — 2026-04-11
- 15 unit tests passing (Vitest) — 2026-04-11
- Playwright e2e smoke test skeleton — 2026-04-11
- GitHub Actions CI pipeline — 2026-04-11
- Security headers in next.config.ts (CSP, X-Frame-Options, etc.) — 2026-04-11
- Imported affaan-m/everything-claude-code snapshot — 2026-04-11

---

## Architecture notes

- **Frontend:** Next.js 16 App Router + TypeScript, Tailwind CSS v4
- **Backend:** Next.js API route handlers (`/api/todos`, `/api/todos/[id]`)
- **DB:** `@libsql/client` (Turso official client). Locally uses `file:./dev.db` (SQLite file). In production: set `DATABASE_URL=libsql://your-db.turso.io` and `DATABASE_AUTH_TOKEN`.
- **Auth:** Stub in `src/lib/auth.ts`. Returns guest session locally. Replace with real Supabase SSR client when creds available.
- **Deployment:** Vercel via GitHub Actions (preview on PRs, production on main merge).
- **Tests:** Vitest (unit, in-memory SQLite), Playwright (e2e smoke).
- **Security:** CSP + security headers in `next.config.ts`, `serverExternalPackages` keeps libsql server-only.

---

## Important decisions & ADR links

| ADR | Decision | Rationale |
|---|---|---|
| ADR-001 | Import everything-claude-code as starting point | Leverage established Claude code standards without history |
| ADR-002 | `@libsql/client` with `file:./dev.db` fallback | Zero-config local dev; identical to production Turso path |
| ADR-003 | Auth stub returns guest session | Unblocks full app development without Supabase creds |
| ADR-004 | Vitest over Jest | Native ESM support, faster, works with Next.js 16 without transform hacks |
| ADR-005 | Tailwind CSS v4 | Installed by `create-next-app` — no config file needed, CSS-first approach |
| ADR-006 | `serverExternalPackages: ["@libsql/client"]` | Prevents native Node bindings from being bundled for edge/browser |

---

## Claude requirements compliance

Source: https://github.com/affaan-m/everything-claude-code

| Requirement | Status | Notes |
|---|---|---|
| CLAUDE.md conventions | Inherited | From snapshot |
| CODE_OF_CONDUCT.md | Inherited | From snapshot |
| CONTRIBUTING.md | Inherited | From snapshot |
| SECURITY.md | Inherited | From snapshot |
| ESLint config | Active | eslint-config-next |
| commitlint | Inherited | commitlint.config.js from snapshot |
| PR template | Inherited | .github/PULL_REQUEST_TEMPLATE.md from snapshot |
| Dependabot | Inherited | .github/dependabot.yml from snapshot |
| Security headers | Implemented | next.config.ts — CSP, X-Frame-Options, etc. |
| TDD | Implemented | 15 unit tests, Playwright skeleton |
| agent.yaml | Inherited | From snapshot |

---

## Deployments

- **Local dev:** `npm run dev` → http://localhost:3000 (auto-redirects to /todos)
- **Staging:** TBD (Vercel Preview — auto-created per PR once VERCEL_* secrets set)
- **Prod:** TBD (Vercel production — auto-deploys on merge to main)

---

## Dev setup

```bash
# Clone and install
git clone https://github.com/JevonThompsonx/TODO.tsx.git
cd TODO.tsx
npm install

# Copy env file
cp .env.example .env.local
# Edit .env.local: set DATABASE_URL=file:./dev.db (default works, no changes needed locally)

# Run dev server
npm run dev
# Open http://localhost:3000 (redirects to /todos)

# Typecheck
npm run typecheck

# Lint
npm run lint

# Unit tests
npm run test:unit

# E2E tests (requires dev server running)
npm run test:e2e
```

---

## Required secrets

Add these in both GitHub repo secrets and Vercel project environment variables:

| Secret | Where | Notes |
|---|---|---|
| `VERCEL_TOKEN` | GitHub Secrets | For CLI/Actions deployments |
| `VERCEL_ORG_ID` | GitHub Secrets | From `vercel link` |
| `VERCEL_PROJECT_ID` | GitHub Secrets | From `vercel link` |
| `DATABASE_URL` | GitHub + Vercel | `libsql://your-db.turso.io` for production |
| `DATABASE_AUTH_TOKEN` | GitHub + Vercel | Turso auth token |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel | Server-side only — never expose to client |

---

## Subagents & responsibilities

| Agent | Domain | Responsibilities |
|---|---|---|
| `frontend-agent` | UI/UX | Next.js pages, Tailwind, accessibility, components |
| `backend-agent` | Data | Turso schema, API routes, migrations, CRUD |
| `infra-agent` | Platform | Vercel provisioning, secrets, GitHub Actions |
| `auth-agent` | Identity | Supabase config, auth flows, secure routes |
| `qa-agent` | Quality | Tests (unit, integration, e2e), CI checks, a11y |
| `docs-agent` | Docs | agent.md, README, release notes, runbooks |

---

## Key contacts & channels

- **Owner:** @JevonThompsonx
- **GitHub Issues:** https://github.com/JevonThompsonx/TODO.tsx/issues

---

## Known risks / blockers

- Real Turso DB requires provisioning + auth token — local SQLite works in the meantime
- Supabase auth not live — guest session stub in place; replace `src/lib/auth.ts` when ready
- Vercel deploy requires 3 secrets set: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

---

## Next release plan

- **Version:** 0.1.0 — Target date: TBD
- **Includes:** Full CRUD, local SQLite DB, Tailwind UI, CI pipeline, unit + e2e tests

---

## Links

- **Source snapshot:** https://github.com/affaan-m/everything-claude-code
- **This repo:** https://github.com/JevonThompsonx/TODO.tsx
- **Vercel project:** TBD (link after `vercel link`)
- **Turso DB:** TBD
- **Supabase project:** TBD
