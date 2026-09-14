---
description: Placement test and maintenance rules for memory files. Enforces what goes in system/ vs reference/ vs users/ vs knowledge-base/.
---
# Memory Maintenance

## The Placement Test

All three must be YES for `system/`: durable across conversations, affects behavior often enough, global (not user/incident-specific). **One NO = don't put in `system/`.**

## Where Things Go

| Content | Location |
|---------|----------|
| Persona, identity, voice, patterns, platform config | `system/` |
| Compact routing indexes (gotchas, patterns) | `system/` (pointers only) |
| Domo reference docs, agentic patterns, SDK refs | `knowledge-base/` |
| Per-member context | `users/` (git-ignored) |
| Outdated/deduplicated content | `archives/` |

## Maintenance Checklist

1. **Audit `system/`** — placement test pass? Move failures to `reference/`
2. **Check duplication** — same fact in two files? Consolidate
3. **Check contradictions** — old guidance made wrong? Fix or archive
4. **Check bloat** — any `system/` file over ~30 lines? Split to index + `reference/` detail
5. **Check `users/`** — stale entries? Archive
6. **Review diffs** — no credentials, PII, or private data
7. **Verify `.gitignore`** — `users/` excluded

## System File Budget

Each `system/` file = always-on tokens. Keep them lean:

- `persona.md` (~30), `identity.md` (~25), `human.md` (~15), `priorities.md` (~5)
- `platform.md` (~30), `gotchas.md` (~15), `patterns.md` (~10)

**Target: <150 lines total.** If exceeded, move content to `reference/` or `knowledge-base/`.
