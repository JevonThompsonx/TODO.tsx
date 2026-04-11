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
| Framework | Next.js `16.2.3` (App Router) |
| Language | TypeScript `5.x` |
| Styles | Tailwind CSS `4.x` |
| Database | Turso / libsql (local: `file:./dev.db`) |
| Auth | Supabase (optional; guest session fallback) |
| Runtime | Node.js `20.x` |
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
# Local SQLite — no credentials needed
DATABASE_URL=file:./dev.db
DATABASE_AUTH_TOKEN=

# Supabase — leave blank to use guest session
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
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
| `npm run test` | Run Vitest unit tests |
| `npm run test:unit:coverage` | Run unit tests with coverage |
| `npm run test:e2e` | Run Playwright E2E tests |

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
| Local dev | `DATABASE_URL=file:./dev.db` — SQLite file, no token |
| Production | `TURSO_DATABASE_URL=libsql://your-db.turso.io` + `TURSO_AUTH_TOKEN` |

`dev.db` is created automatically and is gitignored.

## Authentication

Supabase auth is optional. When `NEXT_PUBLIC_SUPABASE_URL` and the anon key are not set, the app falls back to a guest session automatically — useful for local dev and CI.

Auth files: `src/lib/auth.ts`

## Environment variables

### Database

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite file path (local) or Turso URL (production) |
| `DATABASE_AUTH_TOKEN` | Required for remote Turso; leave empty for local SQLite |
| `TURSO_DATABASE_URL` | Alternative to `DATABASE_URL` (Vercel integration) |
| `TURSO_AUTH_TOKEN` | Alternative to `DATABASE_AUTH_TOKEN` (Vercel integration) |

### Auth (optional)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (safe for browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key — server-side only |

### App (optional)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Canonical public URL |
| `NODE_ENV` | `development` \| `test` \| `production` |

## Deployment (Vercel)

1. Connect the repo in Vercel.
2. Add a Turso database (Vercel integration or manual env vars).
3. Optionally add Supabase env vars for auth.
4. Deploy — Vercel auto-detects Next.js.

Production requires `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`. Missing required vars throw a validation error at startup (see `src/lib/env.ts`).
