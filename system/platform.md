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
- **Working directory:** `/home/jaewilson07/GitHub/knowledge-base` (set by the service)
- **Previous host:** Hostinger VPS at `187.77.216.108` (deprecated — do not use)
- **Previous runtime:** `letta-code-channels-datacrew-public` Docker container (deprecated as of ~June 2026 — replaced by systemd service)
- **Docker on bonker:** `letta-server` (self-hosted Letta), `letta-shim` containers, `mdrag-local`, `caddy`, `gateway`, `wiki`, `neo4j`, `auth`, `domo-mcp`, etc. — but I am NOT one of these containers

## DataCrew MCP Server (wiki)

- **URL:** `https://wiki.datacrew.space/mcp/` (note: `wiki` not `wikki` or `mdrag` — old `mdrag.datacrew.space` 301-redirects to `wiki.datacrew.space`)
- **Auth:** `X-DC-Token: $DATACREW_API_TOKEN` header (DataCrew JWT from Infisical `/datacrew` path)
- **Protocol:** MCP Streamable HTTP (JSON-RPC over HTTP with SSE responses). Requires `Accept: application/json, text/event-stream` header. Session ID returned in `Mcp-Session-Id` header on `initialize`.
- **Connection flow:** `initialize` → `notifications/initialized` → `reveal_toolset(name)` → `tools/call`
- **Toolsets are lazy-loaded** — call `list_capabilities` to see all toolsets, then `reveal_toolset(name)` to access tools
- **Key toolsets:**
  - `rag` — `query_rag`, `save_text_to_knowledge`, `save_url_to_knowledge`, `save_audio_to_knowledge`
  - `web` — `search_web`, `crawl_url`, `crawl_site`
  - `graph` — `add_episode`, `search_graph`, `ingest_structured_data`, etc.
  - `wiki` — `query_wiki`, `compile_wiki`, `detect_gaps`, etc.
  - `browser` — `start_browser_session`, `fetch_authenticated`, `capture_linkedin_page`
  - `learn` — `create_lesson`, `create_reference`, `add_learning_record`, etc.
- **Use wiki first** for Domo questions — it has verified Domo content indexed
- **Known issue:** `save_url_to_knowledge` returns 401 (internal auth forwarding bug). Use `save_text_to_knowledge` instead — it works fine.
- **Ingestion script:** `/home/jaewilson07/GitHub/knowledge-base/ingest_to_mdrag.py` — Python script that connects to MCP and ingests markdown files via `save_text_to_knowledge`

## Skills Available

Loaded from the Letta Code CLI global skills directory (`/usr/lib/node_modules/@letta-ai/letta-code/skills`) and my own `memory/skills/`. Key ones:

- `acquiring-skills` — discover and install skills from registries
- `converting-mcps-to-skills` — connect to MCP servers and create skills
- `creating-skills` — guide for creating new skills
- `dispatching-coding-agents` — dispatch stateless coding agents (Claude Code/Codex)
- `image-generation` — generate images from text prompts
- `scheduling-tasks` — schedule reminders and recurring tasks
- `messaging-agents` — send messages to other agents on the server
- `finding-agents` — find other agents on the same server
- `syncing-memory-filesystem` — manage git-backed memory repos
- `context_doctor` — repair degraded system prompt / memory
- `initializing-memory` — guide for initializing or reorganizing agent memory
- My own: `memory/skills/teach/` — teaching skill

## Key Notes

- This is a **public-facing agent** — everything I do should be appropriate for a community Slack channel
- I have access to the DataCrew knowledge base via mdrag, which includes Domo documentation, YouTube transcripts, and blog content
- The systemd service injects Infisical secrets (Slack tokens, LETTA_API_KEY) into my environment at startup, but I should NOT echo or expose these in community channels

## Verified Domo Doc References

- [[reference/domo-embed-docs.md]] — App Studio embedding & Domo Everywhere embed documentation (verified URLs)

## Agentic Patterns Reference (Claude Cookbooks)

Curated reference files from Anthropic's claude-cookbooks repo (88 notebooks converted to markdown at `/home/jaewilson07/GitHub/knowledge-base/claude-cookbooks/`). Use these when answering questions about Claude API patterns, agent architecture, or agentic development. Key content also ingested into the DataCrew knowledge base (wiki MCP `claude-cookbooks` collection) for RAG queries.

- [[reference/agentic-patterns/overview.md]] — Overview of all patterns + repo structure
- [[reference/agentic-patterns/basic-workflows.md]] — Prompt chaining, parallelization, routing
- [[reference/agentic-patterns/agent-orchestration.md]] — Async multi-agent, orchestrator-workers, evaluator-optimizer
- [[reference/agentic-patterns/research-patterns.md]] — Research lead/subagent/citations prompts
- [[reference/agentic-patterns/tool-use.md]] — Tool choice, parallel tools, customer service agent, batch tool
- [[reference/agentic-patterns/claude-agent-sdk.md]] — Agent SDK: research, chief of staff, observability, SRE
- [[reference/agentic-patterns/extended-thinking.md]] — Extended thinking + tool use
- [[reference/agentic-patterns/capabilities.md]] — RAG, classification, summarization, text-to-SQL
- [[reference/agentic-patterns/managed-agents-and-misc.md]] — CMA patterns, prompt caching, JSON mode, batch processing
