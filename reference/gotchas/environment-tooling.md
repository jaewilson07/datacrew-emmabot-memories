---
description: Environment and tooling gotchas — bwrap, MCP server, mod scoping, env var safety, mdrag ingestion.
---
# Environment / Tooling Gotchas

- **Bash tool requires bwrap (bubblewrap)** — the Letta Code CLI uses it for command sandboxing. Error `Executable not found: /usr/bin/bwrap` means bubblewrap isn't installed. Fix: `sudo apt-get install bubblewrap` (Debian/Ubuntu). When Bash is broken: can't clone repos, run commands, dispatch Claude Code/Codex, or use skills that require Bash. This occurs on local machines without bubblewrap; Docker containers typically have it.
- **MCP server URL is `wiki.datacrew.space` not `mdrag` or `wikki`** — old `mdrag.datacrew.space` 301-redirects to `wiki.datacrew.space` (one 'k'). `wikki.datacrew.space` (two k's) also redirects. Always use `https://wiki.datacrew.space/mcp/` directly.
- **`save_url_to_knowledge` returns 401** — internal auth forwarding bug on the wiki MCP server. Use `save_text_to_knowledge` instead — read the content locally and pass as text.
- **MCP toolsets are lazy-loaded** — call `list_capabilities` to see all toolsets, then `reveal_toolset(name)` to access tools. Default tools don't include `search_web`, `query_rag`, etc. — they're in the `web` and `rag` toolsets.
- **MCP requires SSE Accept header** — must send `Accept: application/json, text/event-stream` or get "Not Acceptable" error. Responses come as SSE events (`event: message\ndata: {...}`).
- **MCP session ID required** — after `initialize`, extract `Mcp-Session-Id` from response headers and include it in all subsequent requests.
- **Never `env | grep` without filtering** — printing all env vars exposes secrets (Slack tokens, API keys, JWTs, OAuth credentials). Always filter to specific vars or use `grep -i VARNAME` for a single var.
- **Mods at `~/.letta/mods/` run on ALL agents** — bonker hosts EmmaBot, IdrisBot, and DataCrew; a harness-level mod affects every agent. Agent-specific mods must go in `$MEMORY_DIR/mods/` (agent-level). The dug-community mod was originally at harness level and caused all 3 agents to trigger simultaneously on the same doc gaps.
- **dug-community state is harness-scoped** — `~/.letta/mods/dug-community-state.json` is shared by all agents. If one agent resolves a gap, the others see it. If one resolves with a wrong `resolutionPath`, the others inherit that error. Always verify another agent's resolution path points to a real file.
- **mdrag ingestion requires `uv` + `httpx`** — the ingestion function uses `uv run --with httpx python3 -c "..."` (not the crew-dcs package, which may not be installed). Requires the `domo-official-docs` collection to pre-exist on mdrag. If `domo-rag.ts` `queryMdrag` fails: it uses `source_group` parameter — the correct param is `topics`.
