---
name: maintaining-mods
description: "How to create, edit, and deploy Letta Code mods on bonker: edit at runtime (~/.letta/mods/), sync to the infra-bonker repo with sync-mods.sh (two-way, newest mtime wins), restart the service to activate. Use when: (1) creating or editing a mod (tool, command, event, provider), (2) deploying mod changes so they survive a redeploy, (3) pulling repo-authored mods (e.g. written by Claude) into runtime, (4) diagnosing why a mod edit isn't taking effect."
metadata:
  version: 1.0.0
  created: 2026-09-11
---

# maintaining-mods

## The lifecycle (memorize this order)

```
edit ~/.letta/mods/<mod>.ts  →  bash sync-mods.sh  →  systemctl --user restart letta-datacrew
```

Mods are **not hot-loaded** — the running service keeps the old version in
memory until restart. An edit that "did nothing" is almost always a missing
restart.

## Where things live

| Location | Role |
|---|---|
| `~/.letta/mods/` | Runtime copy — what the service loads. Edit here. |
| `~/GitHub/infra-bonker/apps/letta-code-channels-datacrew-public/mods/` | IaC source — what a redeploy reproduces |
| `~/GitHub/infra-bonker/apps/letta-code-channels-datacrew-public/sync-mods.sh` | The two-way sync |

## The sync

```bash
bash ~/GitHub/infra-bonker/apps/letta-code-channels-datacrew-public/sync-mods.sh
```

- **Two-way, newest mtime wins**: runtime edits flow to the repo; repo-authored
  mods (Claude may write them there) flow to runtime.
- Runs automatically on every service start (wired into `start-bare.sh`), so a
  restart also reconciles.
- Auto-commits synced changes (author EmmaBot) and best-effort pushes; a failed
  push never blocks the service.
- **Only `.ts` files + `packages.json` sync.** Never: `.domo_rag_config.json`
  (contains a Domo token), `dug-community-state.json` (runtime state),
  `diagnostics/`, `packages/`, `.backup-*`.

## Creating a new mod

1. Load the `creating-mods` skill — follow its recipes (tools/commands/events).
2. Write the mod at `~/.letta/mods/<name>.ts`.
3. Type-check before deploying:
   ```bash
   cd /tmp/modcheck  # or any dir with @types/node installed
   npx tsc --noEmit --strict --target es2022 --module es2022 \
     --moduleResolution bundler --types node <mod>.ts
   ```
4. `bash sync-mods.sh` — the new file flows to the repo and gets committed.
5. `systemctl --user restart letta-datacrew` — activate.
6. If a mod breaks startup: recover with `letta --no-mods` or
   `LETTA_DISABLE_MODS=1 letta`.

## Gotchas

- **Mods at `~/.letta/mods/` affect ALL agents on bonker** (EmmaBot, IdrisBot,
  DataCrew). Agent-specific mods go in `$MEMORY_DIR/mods/`.
- **`requiresApproval: false`** is the proven precedent for headless Slack
  sessions (no human to answer approval prompts) — see domo-rag.ts, mdrag-save.ts.
- **Token access**: read `DATACREW_API_TOKEN` from `process.env` first, then
  `~/GitHub/infra-bonker/.env` as fallback. Do NOT shell out to the infisical
  CLI — its interactive login flow pollutes captured output.
- **No `turn_end` event exists** — the supported set is `conversation_open/close`,
  `tool_start/end`, `turn_start`, `compact_*`, `llm_*`. For "after X happens"
  nudges, use `tool_end` on the relevant tool.
- **`tool_end` result replacement**: return `{ result: { status, output } }` to
  append/rewrite what the agent sees (pattern used by mdrag-reminder.ts and the
  capture nudge in mdrag-annotation.ts).

## Worked example (2026-09-11)

The full flow in action — mdrag-annotation.ts: created the mod at runtime,
type-checked with tsc + `--types node`, ran sync-mods.sh (which also caught
pre-existing drift: dm-memory-gate.ts runtime-newer, google-connect.ts
repo-newer, notion.ts + zzz-diagnostic.ts runtime-only), committed, pushed,
then PR'd the branch. DUG thread 1789147435.776269.
