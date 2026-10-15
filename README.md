# TODO.tsx

A full-stack Todo application built with Next.js App Router, TypeScript, Tailwind CSS, Turso (libsql), and optional Supabase auth. Runs locally with zero credentials.

## What this is

A production-ready Next.js todo app with a REST API, persistent storage, and optional authentication.

- Create, read, update, and delete todos
- Priority levels: `low`, `medium`, `high`
- Tags and due dates per todo
- Filter view: All / Active / Completed
- Local SQLite out of the box — no credentials needed
- Optional Supabase auth (guest session fallback when unconfigured)
- Input validation with typed error messages
- Playwright E2E + Vitest unit tests

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js `16.3.4` (App Router) |
| Language | TypeScript `5.x` |
| Styles | Tailwind CSS `4.x` |
| Database | Turso / libsql (local: `file:./dev.db`) |
| Auth | Supabase (optional; guest session fallback) |
| Runtime | Node.js `20.x` locally (`.tool-versions` pins `20.19.0`; CI runs Node `26`) |
| Testing | Vitest + Playwright |

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Default `.env.local` works with zero changes for local dev (uses a local SQLite file).

```env
# Database — Turso (libsql). Leave TURSO_DATABASE_URL unset for local SQLite (file:./dev.db).
# NOTE: the app reads TURSO_DATABASE_URL / TURSO_AUTH_TOKEN (see src/lib/db.ts, src/lib/env.ts).
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=

# Supabase — leave blank to use guest session.
# Canonical key names: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY).
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/todos`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Create production build |
| `npm run start` | Start the built app |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run test` | Run Vitest unit tests (alias for `test:unit`) |
| `npm run test:unit` | Run Vitest unit tests |
| `npm run test:unit:watch` | Run Vitest in watch mode |
| `npm run test:unit:coverage` | Run unit tests with coverage |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run Playwright E2E tests in UI mode |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting with Prettier (CI gate) |

## Project structure

```
src/
  app/
    api/todos/          # REST API routes (GET, POST, PATCH, DELETE)
    todos/              # Todos page (/todos)
    layout.tsx          # Root layout
    page.tsx            # Redirects / → /todos
  components/
    TodoForm.tsx        # Create todo form
    TodoList.tsx        # Filtered todo list
    TodoItem.tsx        # Single todo row with inline edit
  lib/
    db.ts               # Turso/libsql client (local or remote)
    todos.ts            # Data access layer — CRUD operations
    auth.ts             # Supabase auth + guest session fallback
    validate.ts         # Input validation helpers
    env.ts              # Boot-time env var validation
  types/
    todo.ts             # Todo, CreateTodoInput, UpdateTodoInput types

tests/
  unit/                 # Vitest unit tests
  e2e/                  # Playwright smoke tests
```

## API routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/todos` | List all todos |
| `POST` | `/api/todos` | Create a todo |
| `GET` | `/api/todos/[id]` | Get a todo by ID |
| `PATCH` | `/api/todos/[id]` | Update a todo |
| `DELETE` | `/api/todos/[id]` | Delete a todo |

### Create todo — request body

```json
{
  "title": "Buy milk",
  "description": "Optional notes",
  "due_date": "2026-04-20",
  "priority": "medium",
  "tags": ["shopping"],
  "list_id": "optional-list-id"
}
```

`title` is required. All other fields are optional.

### Todo schema

| Field | Type | Notes |
|---|---|---|
| `id` | `string` (UUID) | Primary key |
| `title` | `string` | Required, max 500 chars |
| `description` | `string \| null` | Max 5000 chars |
| `due_date` | `string \| null` | ISO 8601 date |
| `completed` | `boolean` | Default `false` |
| `priority` | `"low" \| "medium" \| "high"` | Default `"medium"` |
| `tags` | `string` | JSON array string |
| `list_id` | `string \| null` | Optional grouping |
| `created_at` | `string` | ISO 8601 timestamp |
| `updated_at` | `string` | ISO 8601 timestamp |

## Database

Uses Turso (libsql) with automatic table creation on first run. No migrations needed locally.

| Mode | Config |
|---|---|
| Local dev | `TURSO_DATABASE_URL` unset — code defaults to the SQLite file `file:./dev.db`, no token |
| Production | `TURSO_DATABASE_URL=libsql://your-db.turso.io` + `TURSO_AUTH_TOKEN` |

`dev.db` is created automatically and is gitignored.

> Note: `DATABASE_URL` / `DATABASE_AUTH_TOKEN` appear in `.env.example` and in CI
> (`.github/workflows/ci.yml`) but are **not read by the application** — `src/lib/db.ts`
> and `src/lib/env.ts` read `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` only.

## Authentication

Supabase auth is optional. When `NEXT_PUBLIC_SUPABASE_URL` and the anon key are not set, the app falls back to a guest session automatically — useful for local dev and CI.

Auth files: `src/lib/auth.ts`

## Environment variables

### Database

| Variable | Description |
|---|---|
| `TURSO_DATABASE_URL` | Turso URL (`libsql://…`) or local SQLite path; unset → `file:./dev.db` |
| `TURSO_AUTH_TOKEN` | Required when `TURSO_DATABASE_URL` is a remote Turso URL |

### Auth (optional)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key — safe for browser; `SUPABASE_ANON_KEY` also accepted |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Legacy anon-key name — still accepted by `src/lib/auth.ts` as a fallback |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key — server-side only |

### App (optional)

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` \| `test` \| `production` |

## Deployment (Vercel)

1. Connect the repo in Vercel.
2. Add a Turso database (Vercel integration or manual env vars).
3. Optionally add Supabase env vars for auth.
4. Deploy — Vercel auto-detects Next.js.

Production requires `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`. Missing required vars throw a validation error at startup (see `src/lib/env.ts`).

## Upstream fork base (ECC plugin surface)

This repository is a fork of [`affaan-m/everything-claude-code`](https://github.com/affaan-m/everything-claude-code) (the "ECC" plugin) with the todo app above built on top. Installing this repo as a Claude Code plugin gives you access to 47 agents, 181 skills, and 79 commands, plus hooks, rules, MCP configs, and selective-install tooling. Per `AGENTS.md`, the upstream surface is kept intentionally — do not modernize or prune it without owner approval.

| Component | Count | Location |
|---|---|
| Agents | 47 agents | `agents/` |
| Commands | 79 commands | `commands/` (59 carry plugin `description:` frontmatter) |
| Skills | 181 skills | `skills/<name>/SKILL.md` |

Authoritative catalog references: `docs/COMMAND-AGENT-MAP.md` (command → agent/skill map), `WORKING-CONTEXT.md` (upstream catalog truth), `agent.yaml` (export surface).

## Documentation map

Full map with per-directory counts and purposes: **[`docs/INDEX.md`](docs/INDEX.md)**.

| Docs | What |
|---|---|
| `README.md`, `AGENTS.md`, `CLAUDE.md` | App-first instructions and conventions |
| `MODERNIZATION_TODO.md` | Modernization plan/status (dated 2026-08-24) |
| `WORKING-CONTEXT.md` | Upstream repo working context (dated 2026-04-08) |
| `COMMANDS-QUICK-REF.md` | Slash-command cheat sheet (upstream plugin commands) |
| `docs/INDEX.md` | **Start here** — where every doc category lives |
| `docs/*.md` | Upstream specs (install architecture, skill policy, ECC 2.0, troubleshooting) |
| `docs/<locale>/` | Translated docs: `zh-CN` (309), `tr` (137), `ja-JP` (96), `ko-KR` (63), `pt-BR` (47), `zh-TW` (58) |
| `docs/releases/` | Release notes (1.8.0, 1.10.0) |
| `.claude-plugin/`, `.codex-plugin/`, `.codebuddy/`, `.cursor/`, `.kiro/`, `.gemini/`, `.codex/`, `.trae/`, `.opencode/`, `.agents/` | Per-harness install surfaces (manifests, rules, skills, commands) |
