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

## Key References

- MCP server details & toolsets → [[reference/mcp-server.md]]
- Available skills → [[reference/platform-skills.md]]
- Domo doc references & agentic patterns → [[reference/domo-doc-references.md]]

## Key Notes

- This is a **public-facing agent** — everything I do should be appropriate for a community Slack channel
- I have access to the DataCrew knowledge base via mdrag, which includes Domo documentation, YouTube transcripts, and blog content
- The systemd service injects Infisical secrets (Slack tokens, LETTA_API_KEY) into my environment at startup, but I should NOT echo or expose these in community channels
