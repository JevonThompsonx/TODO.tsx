# Documentation Index — TODO.tsx

Start here to find any documentation in this repository. All counts verified
2026-10-15 with `find` (excluding `.git/`, `node_modules/`, `dist/`, `build/`,
`.next/`, `.venv/`, `__pycache__/`, `.worktrees/`). Total: **1,433 Markdown files**.

This repo has two layers — see [`AGENTS.md`](../AGENTS.md) for the rules:

1. **The todo app** (active work) — `src/`, `tests/`, root configs.
2. **The upstream fork base** — a fork of `affaan-m/everything-claude-code` (the
   "ECC" Claude Code plugin). Kept intentionally; do not prune without owner approval.

## Primary entry points

| Doc | Purpose |
|---|---|
| [`README.md`](../README.md) | The todo app: purpose, quick start, scripts, API, deployment |
| [`AGENTS.md`](../AGENTS.md) | App-first instructions: commands, gates, conventions, constraints |
| [`CLAUDE.md`](../CLAUDE.md) | Same, for Claude Code (dual-layer overview) |
| [`COMMANDS-QUICK-REF.md`](../COMMANDS-QUICK-REF.md) | Cheat sheet for upstream plugin slash commands |
| [`MODERNIZATION_TODO.md`](../MODERNIZATION_TODO.md) | Modernization plan/status (dated 2026-08-24) |
| [`WORKING-CONTEXT.md`](../WORKING-CONTEXT.md) | Upstream repo working context (dated 2026-04-08) |
| [`CHANGELOG.md`](../CHANGELOG.md) | Release history (latest entry 1.10.0) |

## Documentation map

| Category | Path | Count | What lives there |
|---|---|---|---|
| App + repo root docs | `*.md` (repo root) | 23 | App README, AGENTS/CLAUDE, app prompt/agent cards, upstream guides (`the-*-guide.md`), assessment/eval snapshots |
| Upstream specs | `docs/*.md` | 23 | Install architecture, skill placement policy, ECC 2.0 specs, troubleshooting, codemap tooling |
| Translated docs | `docs/zh-CN/`, `docs/tr/`, `docs/ja-JP/`, `docs/ko-KR/`, `docs/pt-BR/`, `docs/zh-TW/` | 309 / 137 / 96 / 63 / 47 / 58 | Full translations of plugin docs (README, agents, commands, skills, rules) |
| Release notes | `docs/releases/` | 9 | 1.8.0 and 1.10.0 release bundles |
| Business + examples | `docs/business/`, `docs/examples/` | 2 / 2 | Launch copy, metrics, doc templates |
| Plugin commands | `commands/` | 79 | Slash commands (`/tdd`, `/plan`, `/e2e`, …). See `docs/COMMAND-AGENT-MAP.md` for command-to-agent mapping |
| Plugin agents | `agents/` | 47 | Specialized subagents (planner, code-reviewer, tdd-guide, …) |
| Plugin skills | `skills/` | 181 `SKILL.md` (237 `.md` total) | Workflow skills; extras are reference docs inside skill dirs |
| Rules | `rules/` | 89 | `common/` principles + 15 language dirs (typescript, python, golang, rust, kotlin, swift, php, …) |
| Context modes | `contexts/` | 3 | `dev`, `research`, `review` behavior modes |
| Claude plugin surface | `.claude-plugin/` | 2 | `plugin.json` manifest (38 agents listed), schema gotchas |
| Codex plugin surface | `.codex-plugin/`, `.codex/` | 1 / 1 | Codex plugin manifest, Codex AGENTS overrides |
| CodeBuddy surface | `.codebuddy/` | 2 | Installers + README (EN/zh) |
| Cursor surface | `.cursor/` | 50 | 39 rules + 11 skills |
| Kiro surface | `.kiro/` | 55 | 16 agents, 18 skills, 16 steering files, 3 docs |
| Gemini surface | `.gemini/` | 1 | `GEMINI.md` baseline |
| OpenCode surface | `.opencode/` | 37 | 34 command shims, README, migration guide (excl. bundled `node_modules/`) |
| Generic agents surface | `.agents/` | 36 | 34-skill mirror subset + reference docs |
| Claude local surface | `.claude/` | 8 | Guardrail rules, enterprise controls, local commands/skills |
| Trae surface | `.trae/` | 2 | IDE rules |
| CI docs | `.github/` | 2 | Workflow docs |
| Hooks | `hooks/` | 1 | `README.md` (hooks themselves are `hooks/hooks.json`) |
| Plugin install guide | `plugins/` | 1 | Marketplaces + plugin install guide |
| Other | `examples/`, `research/`, `ecc2/` | 8 / 1 / 1 | Usage examples, ECC 2.0 analysis, Rust control-plane readme |

## Catalog truth (verified counts, 2026-10-15)

Measured with `find` and `node scripts/ci/catalog.js` conventions:

- `agents/*.md` — **47**
- `commands/*.md` — **79** (59 carry plugin `description:` frontmatter)
- `skills/*/SKILL.md` — **181**
- `mcp-configs/mcp-servers.json` — **27** MCP server templates
- `rules/**/*.md` — **89**

Matches `WORKING-CONTEXT.md` ("Public catalog truth is 47 agents, 79 commands,
and 181 skills"). Note: `CHANGELOG.md` 1.10.0, `.claude-plugin/plugin.json`, and
`SOUL.md` still quote older snapshots (38/156/72, 38/156/72, 30/135/60) — treat
the numbers above as authoritative. `README.zh-CN.md` is current (47/181/79).

## Known documentation risks

- `SOUL.md`, `.claude-plugin/plugin.json`, `.gemini/GEMINI.md` — stale catalog
  counts (see above).
- `.env.example` documents `DATABASE_URL` / `DATABASE_AUTH_TOKEN`, which no code
  reads (only `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` are read); it also lists
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, which `src/lib/env.ts` does not accept
  (`src/lib/auth.ts` does, as a fallback). CI sets `DATABASE_URL: 'file::memory:'`
  in `.github/workflows/ci.yml`, which the app ignores.
- `node scripts/ci/catalog.js` (run via `scripts/ecc.js`) fails against current
  root docs: it expects catalog markers plus upstream cross-harness parity tables
  in `README.md` that this fork's app-focused README intentionally does not carry.
  It is not wired into `.github/workflows/`.
- `MODERNIZATION_TODO.md` (2026-08-24) and `WORKING-CONTEXT.md` (2026-04-08) are
  dated snapshots — read them as history, not current state.
- Translated trees (`docs/zh-CN/` etc.) are large mirrors; when changing an English
  source doc, check whether a translated counterpart exists.

## Contributing to docs

- App docs: edit `README.md`, `AGENTS.md`, `CLAUDE.md`, `MODERNIZATION_TODO.md` and
  keep them in sync (see `AGENTS.md` conventions).
- Upstream docs (`docs/`, `agents/`, `skills/`, `commands/`, `rules/`): follow the
  formats in `CONTRIBUTING.md` and `docs/SKILL-DEVELOPMENT-GUIDE.md`; the repo
  sanitizes non-ASCII symbols in Markdown — keep new docs ASCII-clean.
- Markdown is formatted by Prettier (`lint-staged` runs it on `*.md`); run
  `npx prettier --write <file>` before committing.
