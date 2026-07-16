---
description: DataCrew MCP Server (wiki) — connection details, toolsets, and known issues.
---
# DataCrew MCP Server (wiki)

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
