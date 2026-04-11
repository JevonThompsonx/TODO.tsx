# Implementation Prompt: TODO.tsx

## Goal

Build a production-ready Next.js (TypeScript, App Router) to-do web app scaffolded in JevonThompsonx/TODO.tsx and deploy to Vercel. Use Turso as primary DB, Supabase via Vercel for auth/storage as needed, Tailwind CSS for styling, and set up GitHub ↔ Vercel CI/CD with CLI monitoring. Follow the project standards checklist (accessibility, tests, security, observability, CI/CD, docs) and the Claude code requirements at https://github.com/affaan-m/everything-claude-code. Create and maintain agent.md at repo root (migrate content from any existing claude.md or other .md into agent.md).

## Repository & access

- Repo: JevonThompsonx/TODO.tsx. Branching model: main (protected), develop, feature/*.
- Environment variables and secrets required:
  - VERCEL_TOKEN (GitHub secret)
  - DATABASE_URL (Turso connection string)
  - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (as needed)
  - NEXT_PUBLIC_* for any client-visible values
- Provide a short checklist in PR template to verify secrets have been added in GitHub and Vercel.

## High-level deliverables

1. Working Next.js TypeScript app with App Router and Tailwind CSS integrated.
2. Turso DB created and connected. Migrations or schema file included.
3. Supabase project created and integrated through Vercel environment variables (auth + storage optional).
4. Vercel setup: GitHub integration + Vercel CLI config for manual deploy/monitoring and automated deploys on PR/merge.
5. CI: GitHub Actions (or rely on Vercel integration) to run lint, typecheck, unit tests, and e2e smoke tests; step to call Vercel CLI or Vercel Action to deploy preview and production when appropriate.
6. Tests: unit tests, integration tests for API endpoints, and end-to-end test skeleton (Cypress/Playwright).
7. Accessibility checks (axe-core or automated CI step).
8. agent.md at repo root capturing decisions, status, TODOs, links to design and infra, and agent workflow notes.
9. PR opened with clear description, checklist, and link to agent.md.

## Implementation steps (actionable)

### Initial setup

- Clone repo and create branch feature/bootstrap-stack.
- Read https://github.com/affaan-m/everything-claude-code and copy/implement any applicable Claude code requirements; list which items are implemented in agent.md.
- Create agent.md (if claude.md or other .md present, import summary and keep both only until agent.md mirrors content; then remove or reference old file).

### Scaffold Next.js

- `npx create-next-app@latest --typescript --eslint --src-dir` (or follow repo conventions).
- Use App Router (app/).
- Add routing, a simple todo list page with CRUD UI, and local-first persistence (IndexedDB) as fallback.

### Styling

- Install Tailwind CSS (tailwindcss, postcss, autoprefixer); generate config; add basic utility classes and responsive layout.

### DB: Turso

- Create Turso DB instance `<TURSO_DB_NAME>`.
- Create schema for tasks (id, title, description, due_date, completed, tags, list_id, created_at, updated_at).
- Add migration scripts and a README snippet showing how to run migrations locally and in CI.
- Store connection string in VERCEL/Turso env var DATABASE_URL.
- Provide small server-side API route in Next.js using Turso client to perform CRUD.

### Supabase integration

- Create Supabase project if not present.
- Use Supabase for Auth (email/password + social providers optional) and Storage for attachments.
- Add clear instructions and set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel and GitHub Secrets.
- Implement server-side token verification and secure routes (if Auth implemented).

### Vercel deployment

- Link repository to Vercel project `<VERCEL_PROJECT_NAME>`.
- Use Vercel CLI: `vercel login; vercel link; vercel env add DATABASE_URL production; vercel --prod` or rely on Git integration.
- Add a step in GitHub Actions to run `vercel --prod` (or use official Vercel GitHub Action) and export the deployment URL.
- Configure Vercel build & deployment notifications and webhooks for build status updates.
- Store VERCEL_TOKEN in GitHub secrets for CLI deployments.

### Monitoring builds

- Use Vercel dashboard + optionally GitHub Actions logs: create a GitHub Action job that invokes Vercel CLI with `--confirm` and stores deployment URL; fail CI if build/deploy fails.
- Add a webhook to send deployment events to a monitoring channel or to Sentry/Datadog if available.

### CI/CD & tests

- Setup GitHub Actions pipeline:
  - jobs: lint, typecheck, unit-tests, a11y, build
  - preview deploy job for PRs (Vercel Preview) and prod deploy on main merges.
- Run automated accessibility (axe) and Lighthouse CI as a post-build check.
- Add e2e test skeleton using Playwright/Cypress; run a minimal smoke e2e in CI against a preview deployment (only run full e2e on nightly).

### Security & standards

- Enforce HTTPS, CSP headers, secure cookies if sessions used.
- Input validation for all APIs, rate limiting where relevant.
- Add Dependabot config for dependency updates.
- Add ENV secrets management instructions to README.

### Observability

- Add Sentry or similar for error monitoring; include DSN as secret.
- Add structured logging and correlation IDs on API endpoints.

### Documentation & agent.md

- agent.md must include:
  - title, last updated, owners, short summary
  - current sprint / focus, backlog, in-progress, done
  - architecture notes & decisions (DB, auth, infra)
  - deploy instructions (commands)
  - how to run tests locally and in CI
  - list of subagents (frontend-agent, backend-agent, infra-agent, test-agent) and responsibilities
  - link to claude repo and which Claude requirements were implemented
- Update agent.md on every PR merge for significant changes.

### Claude code requirements

- Parse https://github.com/affaan-m/everything-claude-code, identify required files or conventions (lint, formatting, code-of-conduct, security constraints, specific formatters/ADRs), and implement or record compliance in agent.md. State any deviations and rationale.

## Multi-agent & subagent workflow (recommended)

Create subagents specialized by domain:

- **frontend-agent**: scaffold and implement Next.js pages, Tailwind, accessibility.
- **backend-agent**: Turso schema, API endpoints, migrations.
- **infra-agent**: Vercel and Turso provisioning, secrets, GitHub Actions.
- **auth-agent**: Supabase config and auth flows.
- **qa-agent**: tests, e2e, CI checks, accessibility scans.
- **docs-agent**: maintain agent.md, README, release notes.

**Orchestrator**: a meta-agent that assigns tasks, enforces checklists, merges PRs only when CI checks and a11y checks pass.

**Communication**:
- Use agent.md as the single truth for status and handoffs.
- Subagents open PRs against develop with standardized PR templates and link agent.md entries.
- Use GitHub issue tags to route tasks to subagents (e.g., frontend, infra).

**Suggested automation**:
- Bot labels PRs automatically by changed paths.
- CI gates that require specific subagent approvals (CODEOWNERS can help).
- Add a script to auto-generate a short release note from merged PR titles.

## Acceptance criteria (must pass before merging to main)

- [ ] App builds and deploys successfully on Vercel; preview deploys created for PRs.
- [ ] Basic todo CRUD works using Turso backend in production environment.
- [ ] Supabase auth works end-to-end for sign-up/login (if implemented) and keys are securely stored in Vercel/GH.
- [ ] Tailwind CSS present and responsive design for common breakpoints.
- [ ] agent.md created and contains a migration log from any claude.md plus decision records.
- [ ] CI pipeline: lint, type check, unit tests, basic e2e smoke test & a11y check pass.
- [ ] Accessibility: pass automated axe core checks and manual keyboard nav for the main flows.
- [ ] Security: secrets not committed, CSP and secure headers applied, and env variables are documented.
- [ ] Tests: at least 1 unit test per core domain and 1 e2e smoke test for main user flow.
- [ ] Documented runbook for local dev, testing, migrations, and deployment.

## Deliverable PR metadata

- **Branch**: feature/bootstrap-stack
- **PR title**: feat: bootstrap Next.js + Turso + Supabase + Vercel + Tailwind
- **PR description**: short summary, checkbox acceptance criteria (above), list of changed files, how to run locally, migration steps, and a link to the agent.md file lines that summarize decisions.
- **Request reviewers**: frontend lead, backend lead, infra lead, security reviewer.

## Implementation notes & helpful commands (examples)

```bash
# Scaffold Next.js
npx create-next-app@latest --typescript

# Tailwind
npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p

# Vercel CLI
npm i -g vercel
vercel login
vercel link
vercel env add <NAME> <ENV>
vercel --prod

# GitHub Actions: add secret VERCEL_TOKEN; add job step that runs
npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
# (or use Vercel Action)

# Turso: install Turso CLI, create DB instance, obtain connection string, set DATABASE_URL
# (document exact Turso steps in repo)

# Supabase: create project on supabase.com; copy SUPABASE_URL and keys into Vercel env

# Tests
npm run test          # unit
npx cypress open      # or
npx playwright test   # e2e

# agent.md: update at repo root; add "Last updated: 2026-04-11" and author entries.
```

## Follow-ups

- If anything in the Claude repo is ambiguous, list the items and ask for prioritization.
- Confirm whether "response" in your list refers to a specific library/service or responsiveness; adapt accordingly.
