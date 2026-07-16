---
description: Analysis of Ezra (Letta Discord bot) memory architecture patterns and practices I could adopt for my own memory organization.
---
# Ezra Memory Architecture — Patterns to Adopt

Source: [github.com/letta-ai/ezra-memory](https://github.com/letta-ai/ezra-memory) (reviewed 2026-07-16)

Ezra is a Letta support agent for the Letta Discord community — similar role to mine in DUG Slack. The repo is a curated, privacy-safe snapshot of its live memory.

## Key Architecture Principles

### 1. Aggressive Progressive Disclosure
- `system/` files are extremely compact (20-30 lines each, one focused topic per file)
- `system/` is a routing layer — details live in `reference/` and are linked with `[[path]]`
- My `issues.md` is too large by this standard — should be split into compact index + reference files

### 2. The Placement Test
Before adding anything to `system/`:
1. Is it durable across many future conversations?
2. Does it affect behavior often enough to justify always-on tokens?
3. Is it global rather than specific to one user, incident, version, or work item?
If any answer is no → store in `reference/` and load on demand.

### 3. Pattern Library (`reference/patterns/`)
Generalized diagnostic patterns with consistent structure:
- Symptom → Mechanism → Diagnostic sequence → Support rule
- Stripped of all identifying info — lessons extracted from real support work
- Could adopt for Domo patterns: "Beast Mode returns NULL" → symptom, mechanism, steps, fix

### 4. Correction as System Design
- "Convert corrections into positive procedures: what to check, what to do next time, and where the rule belongs"
- More disciplined than my current approach in `issues.md`

### 5. Support Decision Flow (3-layer triage)
1. Immediate user action (safest reversible step)
2. Product diagnosis (facts, interpretation, hypothesis, ruled-out causes, unknowns)
3. Feature/design question (underlying workflow + best approach)

### 6. Memory Maintenance Rules
- Keep `system/` compact; recursive pinning = always-on token cost
- Put volatile details, dated incidents, long examples under `reference/`
- One focused purpose per memory file
- Periodically audit for duplication, contradictions, obsolete guidance, user-specific leakage
- Rewrite corrections as constructive operating rules, not shame narratives
- Review diffs before committing; never place credentials in memory

### 7. Per-User Memory (`users/`)
- Each user has their own file with preferences, projects, interaction notes
- Strict privacy: never disclose one user's file to another
- "The line is sharing TO another user, not knowing ABOUT someone"
- Could adopt for regular DUG members

### 8. Frontmatter with Descriptions
Every file has `---description: ...---` frontmatter for discoverability

### 9. Publishing Skill with Privacy Checklist
- Automated scans for UUIDs, snowflake IDs, secrets, home paths, emails
- Manual review checklist
- Approval-gated push
- Gold standard for public memory sharing

### 10. Response Rules Structure
- Accuracy: verify, cite, don't invent, label known/assumed/unknown
- Method: identify workflow, separate facts from interpretation, safest action first
- Privacy/safety: never expose user context, minimum evidence, no irreversible cleanup

## Implementation Status (2026-07-16)

- [x] Split `issues.md` into compact `system/gotchas.md` index + `reference/gotchas/` files (10 topic files)
- [x] Slimmed `platform.md` from 85 lines to ~30 lines — moved MCP details, skills, and doc references to `reference/`
- [x] Added `archives/` directory for deduplicated/outdated content (instead of deleting)
- [x] Added `.gitignore` to GitHub repo (privacy-first, excludes users/, conversations, secrets, .letta/)
- [x] Added `README.md` to GitHub repo explaining structure and architecture principles
- [x] All memory files have frontmatter descriptions
- [ ] Create `reference/patterns/` for Domo diagnostic patterns (symptom → mechanism → diagnostic → fix)
- [ ] Create `users/` directory for regular DUG members (with privacy rules)
- [ ] Formalize response rules in a `system/support/` section
- [ ] Create `CURATION_LOG.md` to track memory changes over time
