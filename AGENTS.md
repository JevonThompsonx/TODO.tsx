# AGENTS.md — TODO.tsx (todo app on a fork base)

**Active project:** full-stack Todo app — `src/` (Next.js `16.3.4` App Router, React 19,
TypeScript 5, Tailwind 4, Turso/libsql with local `file:./dev.db` out of the box,
optional Supabase auth with guest-session fallback).
**Branch:** `fix/ci-node26-2026-09-03` — the `modernization/2026-08-24` branch was merged
to `main` via PR #30 (merge `2d9e7ed`); open PRs to `main` only when gates green.
**Last verified:** 2026-09-03 — gates green at `aa77624` (tsc/eslint/prettier/vitest/build).

Prior AGENTS.md (upstream-ECC boilerplate) backed up at
`./AGENTS.md.pre-change-2026-09-03`. That file described only the fork base, never
this app — do not restore it as the primary instructions.

## Where things live

| Path | What | Touch? |
| ---- | ---- | ------ |
| `src/app`, `src/components`, `src/lib`, `src/types` | The todo app (active work) | Yes |
| `tests/unit`, `tests/e2e`, `playwright.config.ts`, `vitest.config.ts` | App tests | Yes |
| `README.md`, `MODERNIZATION_TODO.md`, `docs/INDEX.md` | App docs/status + repo doc map | Yes, keep in sync |
| `.github/workflows/ci.yml` | Real CI: lint → typecheck → unit → build → e2e → Vercel | Yes (exists — the "no .github" claim was wrong) |
| `agents/`, `skills/`, `commands/`, `hooks/`, `rules/`, `mcp-configs/`, `scripts/`, `docs/`, `ecc2/` … | Upstream `everything-claude-code` fork base | **No** — see below |

## Upstream fork base (do NOT modernize unprompted)

This repo is a fork of `affaan-m/everything-claude-code` with a todo app built on top
(see `MODERNIZATION_TODO.md` scope warning). Consequences:

- `docs/` (incl. `ja-JP/`, `ko-KR/`, `zh-CN/`, `business/`, `releases/`, ECC specs) is
  **upstream content, kept intentionally** — not app docs, not dead weight. Never delete
  or "prune" without explicit owner approval.
- Same for `agents/`, `skills/`, `commands/`, `hooks/`, `rules/`, `mcp-configs/`,
  `scripts/` (upstream plugin surface + Node utilities).
- App work stays in `src/`, `tests/`, root configs, `README.md`, `MODERNIZATION_TODO.md`.

## Upstream catalog (counts verified 2026-10-15)

The fork base provides 47 specialized agents, 181 skills, 79 commands:

```
agents/            — 47 specialized subagents
commands/          — 79 slash commands (59 with plugin description: frontmatter)
skills/            — 181 workflow skills and domain knowledge
rules/             — 89 rule docs (common/ + 15 language dirs)
mcp-configs/       — 27 MCP server templates in mcp-servers.json
contexts/          — 3 mode files (dev, research, review)
```

Repo-wide documentation map (every category with verified counts): `docs/INDEX.md`.

## Commands (npm; Node 20 locally)

`.tool-versions` pins `nodejs 20.19.0`; CI runs Node `26` since `15bdeb2`
(`NODE_VERSION: '26'` in `.github/workflows/ci.yml`).

```bash
npm run dev            # dev server (local SQLite, zero credentials)
npm run lint           # eslint (bare `eslint` = flat config scope)
npm run typecheck      # tsc --noEmit
npm run test:unit      # vitest run
npm run test:e2e       # playwright (needs `npx playwright install chromium` once)
npm run build          # next build (CI uses DATABASE_URL='file::memory:')
npm run format:check   # prettier --check . (next-env.d.ts ignored)
```

Gate order before push: `typecheck` → `lint` → `test:unit` → `format:check` → `build`
(`test:e2e` when UI flows change). Never push red.

## Conventions (app code only)

- Server data access behind `src/lib/todos.ts`; API routes under `src/app/api/todos/`
  validate input at the boundary with typed errors (no unvalidated client input).
- No hardcoded secrets; Supabase vars optional (guest fallback); local dev needs none.
- `eslint-disable` inventory (2026-09-03, app code — leave in place, document if touched):
  `src/lib/todos.ts:107`, `src/app/todos/page.tsx:52`,
  `tests/unit/OptimizedImage.test.tsx:10`, `tests/scripts/skill-create-output.test.js:33`
  (+ 2 in upstream `scripts/`, out of scope).
- Conventional commits (`feat:`, `fix:`, `docs:`, …); scope diffs to the app unless the
  task explicitly says otherwise.
