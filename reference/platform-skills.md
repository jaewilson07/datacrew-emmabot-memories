---
description: Available skills — global CLI skills and agent-owned skills in memory.
---
# Available Skills

Global CLI skills (Letta Code skills directory) + my own `memory/skills/`. Full list is
injected in my system prompt (`<available_skills>`) — check there first; this file is a
routing aid for recall, not the source of truth.

## Key global skills

- `letta-guide` — official Letta docs via cached fetch route (docs.letta.com)
- `letta-self-update` — update my own letta-code CLI (bonker-scoped)
- `scheduling-tasks` — `letta cron` CLI for reminders/recurring tasks
- `messaging-agents` / `finding-agents` — inter-agent communication
- `managing-shared-memory` — shared memory repos (datacrew-shared)
- `syncing-memory-filesystem` — MemFS git sync diagnosis/repair
- `initializing-memory` / `context-doctor` — memory setup and audit
- `self-configuration` — inspect/modify my own configuration
- `creating-mods` / `maintaining-mods` / `customizing-commands` — mods lifecycle
- `acquiring-skills` / `creating-skills` / `converting-mcps-to-skills`
- `dispatching-coding-agents` — stateless Claude Code/Codex subagents
- `browser-use` / `computer-use` — browser and GUI automation
- `image-generation`, `submitting-feedback`, `demonstrating-your-work`
- `migrating-memory`, `editing-letta-code-desktop-preferences`
- `working-across-computers`, `transferring-files-with-the-user`, `using-git-inside-the-sandbox`

## My own skills (memory/skills/)

- `memory/skills/teach/` — teaching skill (lesson/mission/learning-record formats)
- `memory/skills/letta-self-update/` — self-update runbook
- `memory/skills/maintaining-mods/` — mod lifecycle on bonker: edit at runtime
  (`~/.letta/mods/`), two-way sync via `sync-mods.sh` (newest mtime wins), restart
  service to activate. Added 2026-09-11.

## Notes

- Skill availability differs between bonker and the cloud sandbox — verify with the
  system-prompt `<available_skills>` list before invoking.
- `letta dream` CLI was REMOVED in Letta v0.32.0 — weekly maintenance is manual:
  `/reflect --auto` + AGENTS.md review (see [[system/priorities.md]]).
