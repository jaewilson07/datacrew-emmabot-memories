---
description: Where I run, what tools I have, and how to use them.
---
# Platform

## Running Location

- **Primary host:** bonker (Jae's self-hosted server)
- **Also run in:** Letta Cloud sandbox (ephemeral Linux, `/root/workspace` cwd) — when Jae or
  another agent sends me work via the Agent tool with `computer: cloud`. No Infisical secrets,
  no GitHub token, no MCP servers there — memory MemFS and shared repos are synced, tools differ.
- **Runtime (bonker):** Letta Code CLI as systemd user service (`letta-datacrew.service`)
  - Command: `letta server --channels slack --install-channel-runtimes`
  - Runs THREE Slack accounts: `datacrew-public` (me, DUG) + `datacrew` (jaelearnsbots) + `idrisbot`
  - Secrets from Infisical at startup (`/datacrew`, `/letta`, `/infrastructure`)
- **Letta backend:** Letta Cloud (`https://api.letta.com`)
- **Memory (bonker):** `/home/jaewilson07/.letta/agents/agent-5afcfa48-.../memory/`
  - **Memory (sandbox):** `/root/workspace/.letta/agents/agent-5afcfa48-.../memory/` — same repo, git-synced
  - **Primary remote (origin):** Letta Cloud git for memory persistence
  - **GitHub remote (github):** `github.com/jaewilson07/datacrew-emmabot-memories.git` — push with
    `git push github HEAD:master`. Token: `JAEWILSON07_GH_PAT` from Infisical root path (`/`) — **not available in sandbox**
- **Working directory (bonker):** `/home/jaewilson07/GitHub/knowledge-base`
  - **No git remote** — local repo initialized 2026-09-14 (master, 1 commit); push remote TBD by Jae. Doc-gap workflow unaffected (write doc → `resolve_doc_gap`).

## Slack Adapter

- **`listen_mode`** — per-account only (not per-channel). When `true`, unmentioned replies are read-only until `@mention`. No per-channel equivalent in Slack.
- **`channel-mention-gate` mod** — DISABLED (disruptive UI). Needed for per-channel gate behavior, but the `turn_start` cancel creates noisy "Interrupted" messages.
- **Routing** — `routing.yaml` maps chat IDs to agents. `routing.yaml` + channel config determine which agent handles each channel.
- **`allowBots`** — per-account setting (not in docs). `false` drops bot messages; `\"mentions\"` accepts only explicit bot mentions. Set to `\"mentions\"` on all 3 accounts.
- **Bot IDs** (for mention checks in mods): EmmaBot `U0B35MJ9540` (datacrew-public), DataCrew `U0AQ7N23LKT` (datacrew), IdrisBot `U0BHRTU63E1` (idrisbot)

## Shared Memory

- **`datacrew-shared`** repo — shared memory on Letta Cloud for EmmaBot, DataCrew, IdrisBot (team conventions, project decisions, research). Not part of personal MemFS.
- **Agent-to-agent messaging:** `letta -p --from-agent $LETTA_AGENT_ID --agent <target-id> "message"` — via Letta API, not Slack. Hidden conversations.

## Key References

- MCP server details & toolsets → [[reference/mcp-server.md]]
- Available skills → [[reference/platform-skills.md]]
- Domo doc references & agentic patterns → [[reference/domo-doc-references.md]]
