---
description: Where I run, what tools I have, and how to use them.
---
# Platform

## Running Location

- **Host:** bonker (Jae's self-hosted server, migrated from Hostinger VPS as of ~June 2026)
- **Runtime:** Letta Code CLI running as a **systemd user service** (`letta-datacrew.service`)
  - Service file: `~/.config/systemd/user/letta-datacrew.service`
  - Start script: `~/GitHub/homeserver/apps/letta-code-channels-datacrew-public/start-bare.sh`
  - Command: `letta server --channels slack --install-channel-runtimes`
  - Runs BOTH Slack accounts: `datacrew-public` (me, DUG) + `datacrew` (jaelearnsbots)
  - Secrets injected from Infisical at startup (`/datacrew`, `/letta`, `/infrastructure` paths, prod env)
- **Letta backend:** Letta Cloud (`https://api.letta.com`) — agent state lives in the cloud
- **Memory:** Local filesystem at `/home/jaewilson07/.letta/agents/agent-5afcfa48-.../memory/`
  - **Primary remote (origin):** Letta Cloud git — used by the Letta Code harness for memory persistence
  - **GitHub remote (github):** `github.com/jaewilson07/datacrew-emmabot-memories.git` — my dedicated memory repo (separate from DataCrew and IdrisBot). Push with `git push github HEAD:master` after committing to origin. Token: `JAEWILSON07_GH_PAT` from Infisical root path (`/`)
- **Working directory:** `/home/jaewilson07/GitHub/knowledge-base` (set by the service)
- **Previous host:** Hostinger VPS at `187.77.216.108` (deprecated — do not use)
- **Docker on bonker:** `letta-server`, `letta-shim` containers, `mdrag-local`, `caddy`, `gateway`, `wiki`, `neo4j`, `auth`, `domo-mcp`, etc. — but I am NOT one of these containers

## Slack Adapter Configuration

- **`listen_mode`** — per-account setting in the Slack config (not per-channel). When `true`, unmentioned Slack thread replies are delivered read-only until an `@mention`. Useful when you want an agent in a shared channel but only responding when specifically addressed. Slack has NO per-channel equivalent (Discord has `allowed_channels` mode map, Slack does not).
- **`channel-mention-gate` mod** — `~/.letta/mods/channel-mention-gate.ts` + config at `~/.letta/mods/.channel-mention-gate.json`. Emulates per-channel `listen_mode` for Slack by cancelling `turn_start` when a message arrives in a gated channel without an @mention of the bot. **DISABLED** as of 2026-08-03 — the `turn_start` cancel mechanism surfaces as a disruptive "Interrupted" message in the Letta web app, making it too noisy for a silent gate. Config renamed to `.channel-mention-gate.json.disabled`. The real fix is a Letta feature request for per-channel `listen_mode` on Slack.
- **Multi-agent channel routing** — routes in `routing.yaml` bind a chat ID to an agent + conversation. Multiple agents can share the same Slack channel via separate routes. Each agent's reply behavior is controlled by its own account config (`listen_mode` or lack thereof).
- **Channel config file** — defines which accounts have access to which channels. Routing config (separate from channel config) determines which agent handles messages from each channel.
- **`allowBots`** — per-account Slack setting (not in docs, but in type defs). `false` (default) drops bot-authored messages; `\"mentions\"` accepts only explicit foreign bot mentions. No accept-all mode (intentional pair-loop guard). Relevant for agent-to-agent via Slack. Set to `\"mentions\"` on all 3 accounts as of 2026-08-03.
- **Bot user IDs** (for checking mentions in mods): EmmaBot `U0B35MJ9540` (datacrew-public), DataCrew `U0AQ7N23LKT` (datacrew), IdrisBot `U0BHRTU63E1` (idrisbot). Useful for mod development that checks `<@...>` mention syntax.

## Shared Memory

- **`datacrew-shared`** repository (`repo-api-96928a50-9c08-4729-96db-ec553d4550ee`) — shared memory on Letta Cloud, attached to EmmaBot, DataCrew, and IdrisBot. Used for team conventions, project decisions, research artifacts. Not part of personal MemFS. Access via Letta API (`/v1/repositories/{id}/files`).
- **Decision log:** `project/decision-log.md` in the shared repo — jointly maintained by all three agents.
- **Agent-to-agent messaging:** `letta -p --from-agent $LETTA_AGENT_ID --agent <target-id> \"message\"` — sends directly through Letta API, not Slack. Conversations are hidden. Can continue with `--conversation <id>`.

## Key References

- MCP server details & toolsets → [[reference/mcp-server.md]]
- Available skills → [[reference/platform-skills.md]]
- Domo doc references & agentic patterns → [[reference/domo-doc-references.md]]

## Key Notes

- This is a **public-facing agent** — everything I do should be appropriate for a community Slack channel
- I have access to the DataCrew knowledge base via mdrag, which includes Domo documentation, YouTube transcripts, and blog content
- The systemd service injects Infisical secrets (Slack tokens, LETTA_API_KEY) into my environment at startup, but I should NOT echo or expose these in community channels
