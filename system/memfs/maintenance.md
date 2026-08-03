---
description: Placement test and maintenance rules for memory files. Enforces what goes in system/ vs reference/ vs users/ vs knowledge-base/.
---
# Memory Maintenance

## The Placement Test

Before adding or moving any file, run this test:

| Question | If YES | If NO |
|----------|-------|------|
| Is it durable across many future conversations? | → continue | → don't put in `system/` |
| Does it affect behavior often enough to justify always-on tokens? | → continue | → `reference/` or `knowledge-base/` |
| Is it global rather than specific to one user, incident, version, or work item? | → `system/` | → `users/` or `reference/` |

**One "no" = it doesn't belong in `system/`.** No exceptions.

## Where Things Go

| Content type | Location | Why |
|-------------|----------|-----|
| Persona, identity, voice | `system/` | Always-on, defines who I am |
| Working patterns (diagnostic procedures) | `system/` | Affects behavior across all conversations |
| Platform config (where I run, tools) | `system/` | Global, durable |
| Compact routing indexes (gotchas, patterns) | `system/` | Pointers, not content — keeps tokens low |
| Domo reference docs (gotchas, patterns, API notes) | `knowledge-base/` | Shared with IdrisBot, not persona-specific |
| Agentic patterns, SDK references | `knowledge-base/` | Shared knowledge, loaded on demand |
| Per-member context | `users/` | Private, git-ignored, never shared |
| Outdated/deduplicated content | `archives/` | Keep history, don't delete |
| Research outputs | `knowledge-base/research/` | Shared, curated |

## Maintenance Checklist (run periodically)

1. **Audit `system/`** — is every file still passing the placement test? Move failures to `reference/` or `knowledge-base/`
2. **Check for duplication** — same fact in two files? Consolidate
3. **Check for contradictions** — updated guidance that makes old guidance wrong? Fix or archive
4. **Check for bloat** — any `system/` file over ~30 lines? Split into compact index + `reference/` detail
5. **Check `users/`** — stale entries? Members who left the community? Archive
6. **Review diffs before committing** — never place credentials, PII, or private client data in memory
7. **Verify `.gitignore`** — `users/` must always be excluded

## Current System File Budget

Each `system/` file is pinned into the system prompt = always-on tokens. Keep them lean:

- `persona.md` — who I am, how I show up (~30 lines)
- `identity.md` — who I represent, boundaries (~25 lines)
- `human.md` — the community I serve (~15 lines)
- `priorities.md` — my mission (~5 lines)
- `platform.md` — where I run, compact routing (~30 lines)
- `gotchas.md` — index only, links to `reference/gotchas/` (~15 lines)
- `patterns.md` — index only, links to `reference/patterns/` (~10 lines)

**Target: <150 lines total across all `system/` files.** If we exceed that, something needs to move to `reference/` or `knowledge-base/`.
