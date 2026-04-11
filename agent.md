# Project: TODO.tsx

**Last updated:** 2026-04-11
**Owner(s):** JevonThompsonx — Product & Repo Owner

---

## Summary

A Next.js TypeScript to-do web app scaffold with Turso DB, Supabase auth/storage (via Vercel), Tailwind CSS, and Vercel CI/CD. Repo imported from affaan-m/everything-claude-code and extended.

---

## Current sprint / focus

- **Sprint:** bootstrap-stack (dates TBD)
- **Goals:**
  - Scaffold Next.js + Tailwind + basic todo CRUD
  - Provision Turso and wire DATABASE_URL
  - Setup Vercel integration and preview deploys

---

## Backlog / To do

- [ ] Add Turso migrations and seed data
- [ ] Integrate Supabase auth + storage
- [ ] Implement full CI pipeline and accessibility checks
- [ ] Add unit tests and e2e smoke tests
- [ ] Configure Dependabot
- [ ] Add Sentry/observability integration
- [ ] Write runbook for local dev, migrations, deployment

---

## In progress

- Initial import and repo setup — owner: automation agent — status: done

---

## Done (recent)

- Imported affaan-m/everything-claude-code snapshot — 2026-04-11
- Added prompt.md and agent.md — 2026-04-11

---

## Architecture notes

- **Frontend:** Next.js (App Router) + TypeScript, Tailwind CSS
- **Backend:** Turso as primary database; Next.js API routes for server logic
- **Auth/Storage:** Supabase via Vercel environment variables
- **Deployment:** Vercel (GitHub integration + CLI)
- **CI/CD:** GitHub Actions (lint, typecheck, unit tests, a11y, build, deploy)

---

## Important decisions & ADR links

- **ADR-001:** Import snapshot of everything-claude-code as starting point — rationale: leverages established Claude code standards and conventions without inheriting git history
- **ADR-002:** Turso as primary DB — rationale: edge-compatible SQLite, low-latency reads, first-class Vercel/Next.js integration
- **ADR-003:** Supabase for auth — rationale: managed auth with good Next.js SDK, Row Level Security for data isolation
- **Claude requirements checklist:** TODO — map requirements from everything-claude-code → implementation status

---

## Deployments

- **Staging:** TBD (Vercel Preview — auto-created per PR)
- **Prod:** TBD (Vercel production — auto-deploys on merge to main)

---

## Dev setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run tests
npm run test

# Typecheck
npm run typecheck

# Lint
npm run lint
```

---

## Required secrets

Add these in both GitHub repo secrets and Vercel project environment variables:

| Secret | Where | Notes |
|---|---|---|
| `VERCEL_TOKEN` | GitHub Secrets | For CLI/Actions deployments |
| `DATABASE_URL` | GitHub + Vercel | Turso connection string |
| `SUPABASE_URL` | GitHub + Vercel | Supabase project URL |
| `SUPABASE_ANON_KEY` | GitHub + Vercel | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub + Vercel | Server-side only — never expose to client |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Client-visible |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Client-visible |

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
| `orchestrator` | Meta | Task assignment, checklist enforcement, PR gates |

---

## Claude code requirements compliance

Source: https://github.com/affaan-m/everything-claude-code

| Requirement | Status | Notes |
|---|---|---|
| CLAUDE.md conventions | Pending | Review and implement |
| Code of conduct | Pending | Add CODE_OF_CONDUCT.md |
| Contributing guide | Pending | Add CONTRIBUTING.md |
| Security policy | Pending | Add SECURITY.md |
| Lint/format config | Pending | ESLint + Prettier |
| Commit lint | Pending | commitlint config |
| PR template | Pending | Add .github/PULL_REQUEST_TEMPLATE.md |
| Agent YAML definition | Pending | agent.yaml |

---

## Key contacts & channels

- **Owner:** @JevonThompsonx
- **Slack:** #todo-app (create)
- **GitHub Issues:** https://github.com/JevonThompsonx/TODO.tsx/issues

---

## Known risks / blockers

- Turso provisioning requires org access — ensure CLI authenticated
- Supabase keys must be stored securely in Vercel/GH secrets — never commit
- Vercel project must be linked before first deploy

---

## Next release plan

- **Version:** 0.1.0 — Target date: TBD
- **Includes:** basic todo CRUD, Turso integration, Vercel deploy, CI pipeline skeleton

---

## Links

- **Source snapshot:** https://github.com/affaan-m/everything-claude-code
- **This repo:** https://github.com/JevonThompsonx/TODO.tsx
- **Vercel project:** TBD
- **Turso DB:** TBD
- **Supabase project:** TBD
