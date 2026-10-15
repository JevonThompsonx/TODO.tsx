# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository has **two layers**:

1. **The active project** — a full-stack Todo app in `src/` (Next.js 16 App Router, React 19,
   TypeScript, Tailwind 4, Turso/libsql, optional Supabase auth with guest fallback).
2. **The upstream fork base** — a fork of `affaan-m/everything-claude-code` (the "ECC"
   Claude Code plugin): agents, skills, hooks, commands, rules, and MCP configurations.

**Primary instructions live in [`AGENTS.md`](AGENTS.md)** (app-first conventions, gates,
constraints). Repo-wide documentation map: [`docs/INDEX.md`](docs/INDEX.md).
App work stays in `src/`, `tests/`, and root configs — do not modernize the upstream
plugin surface (`agents/`, `skills/`, `commands/`, `hooks/`, `rules/`, `scripts/`,
`mcp-configs/`, `docs/`) without owner approval.

## Running Tests

```bash
# Todo app (npm scripts — see package.json)
npm run test:unit      # vitest run
npm run test:e2e       # playwright (needs `npx playwright install chromium` once)
npm run lint           # eslint
npm run typecheck      # tsc --noEmit

# Upstream plugin test suite (Node test runner)
node tests/run-all.js
node tests/lib/utils.test.js
node tests/lib/package-manager.test.js
node tests/hooks/hooks.test.js
```

## Architecture

The todo app (`src/`) is organized as:

- `src/app` — Next.js App Router pages and `src/app/api/todos/` REST routes
- `src/components` — Todo UI components
- `src/lib` — `db.ts` (Turso client), `todos.ts` (CRUD), `auth.ts` (Supabase + guest fallback), `validate.ts`, `env.ts`
- `src/types` — shared Todo types
- `tests/` — Vitest unit tests + Playwright E2E tests

The upstream plugin base is organized into several core components:

- **agents/** - Specialized subagents for delegation (planner, code-reviewer, tdd-guide, etc.)
- **skills/** - Workflow definitions and domain knowledge (coding standards, patterns, testing)
- **commands/** - Slash commands invoked by users (/tdd, /plan, /e2e, etc.)
- **hooks/** - Trigger-based automations (session persistence, pre/post-tool hooks)
- **rules/** - Always-follow guidelines (security, coding style, testing requirements)
- **mcp-configs/** - MCP server configurations for external integrations
- **scripts/** - Cross-platform Node.js utilities for hooks and setup
- **tests/** - Test suite for scripts and utilities

## Key Commands

- `/tdd` - Test-driven development workflow
- `/plan` - Implementation planning
- `/e2e` - Generate and run E2E tests
- `/code-review` - Quality review
- `/build-fix` - Fix build errors
- `/learn` - Extract patterns from sessions
- `/skill-create` - Generate skills from git history

## Development Notes

- Package manager detection: npm, pnpm, yarn, bun (configurable via `CLAUDE_PACKAGE_MANAGER` env var or project config)
- Cross-platform: Windows, macOS, Linux support via Node.js scripts
- Agent format: Markdown with YAML frontmatter (name, description, tools, model)
- Skill format: Markdown with clear sections for when to use, how it works, examples
- Skill placement: Curated in skills/; generated/imported under ~/.claude/skills/. See docs/SKILL-PLACEMENT-POLICY.md
- Hook format: JSON with matcher conditions and command/notification hooks

## Contributing

Follow the formats in CONTRIBUTING.md:
- Agents: Markdown with frontmatter (name, description, tools, model)
- Skills: Clear sections (When to Use, How It Works, Examples)
- Commands: Markdown with description frontmatter
- Hooks: JSON with matcher and hooks array

File naming: lowercase with hyphens (e.g., `python-reviewer.md`, `tdd-workflow.md`)

## Skills

Use the following skills when working on related files:

| File(s) | Skill |
|---------|-------|
| `src/components/**`, `src/app/**` | `frontend-patterns` |
| `src/lib/**`, `src/app/api/**` | `backend-patterns` |
| `src/lib/auth.ts`, `src/lib/env.ts` | `security-review` |
| `tests/**` | `tdd-workflow`, `e2e-testing` |
| `*.md` (project docs) | `documentation-lookup` |

When spawning subagents, always pass conventions from the respective skill into the agent's prompt.
