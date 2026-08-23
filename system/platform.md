---
description: Where I run, what tools I have, and how to use them.
---
# Platform

## Running Location

- **Host:** bonker (Jae's self-hosted server, migrated from Hostinger VPS as of ~June 2026)
- **Runtime:** Letta Code CLI as systemd user service (`letta-datacrew.service`)
  - Command: `letta server --channels slack --install-channel-runtimes`
  - Runs BOTH Slack accounts: `datacrew-public` (me, DUG) + `datacrew` (jaelearnsbots)
  - Secrets from Infisical at startup (`/datacrew`, `/letta`, `/infrastructure` paths)
- **Letta backend:** Letta Cloud (`https://api.letta.com`) — agent state lives in the cloud
- **Memory:** Local filesystem at `/home/jaewilson07/.letta/agents/agent-5afcfa48-.../memory/`
  - **Primary remote (origin):** Letta Cloud git — used by the Letta Code harness for memory persistence
  - **GitHub remote (github):** `github.com/jaewilson07/datacrew-emmabot-memories.git` — my dedicated memory repo (separate from DataCrew and IdrisBot). Push with `git push github HEAD:master` after committing to origin. Token: `JAEWILSON07_GH_PAT` from Infisical root path (`/`)
- **Working directory:** `/home/jaewilson07/GitHub/knowledge-base` (set by the service)
- **Previous host:** Hostinger VPS at `187.77.216.108` (deprecated — do not use)
- **Docker on bonker:** various containers (letta-server, mdrag, caddy, etc.) — I am NOT a container, I run as a systemd user service

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
