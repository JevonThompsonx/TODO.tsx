# Modernization TODO — TODO.tsx

**Repository:** `/home/hermes/Projects/TODO.tsx`
**Baseline:** `main@a2cb0f4`
**Branch:** `modernization/2026-08-24` (to be created)
**Date:** 2026-08-24

---

## ⚠️ Scope Warning

This is **NOT** a simple todo app. It's a fork of `affaan-m/everything-claude-code` (50K+ stars, 6K+ forks) — a massive AI coding plugin with:
- 47 specialized subagents (`agents/`)
- 181 workflow skills (`skills/`)
- 79 slash commands (`commands/`)
- 14 MCP server configurations (`mcp-configs/`)
- Cross-platform Node.js utilities (`scripts/`)
- Hook-based automations (`hooks/`)

Modernization should be **extremely conservative** — this is a fork of a large upstream project with its own conventions.

---

## Stack
- Next.js 16.2.3, React 19.2.4, TypeScript 5
- Vitest 4.1.4 (unit), Playwright 1.59.1 (e2e)
- Supabase SSR + libsql/Turso client
- Tailwind CSS 4, @tailwindcss/postcss

## Security
- [ ] CSP with nonces — verify current setup
- [ ] Rate limiting on API routes
- [ ] Auth session management
- [ ] Input validation (Zod?)
- [ ] No hardcoded secrets in 181 skills + 47 agents

## Reliability
- [ ] Database migrations + backups
- [ ] Error boundaries + logging
- [ ] Health checks

## Maintainability
- [ ] Dead code elimination (181 skills — audit for orphans)
- [ ] Dependency hygiene (pinned versions?)
- [ ] Documentation accuracy
- [ ] Fork sync strategy with upstream

## Performance
- [ ] Bundle size (dynamic imports?)
- [ ] Image optimization

## Developer QoL
- [ ] CI pipeline (GitHub Actions?)
- [ ] Pre-commit hooks (gitleaks, shellcheck?)
