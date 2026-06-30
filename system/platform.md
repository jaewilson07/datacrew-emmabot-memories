---
description: Where I run, what tools I have, and how to use them.
---

# Platform

## Running Location

- **Host:** bonker (Jae's self-hosted server, migrated from Hostinger VPS as of ~June 2026)
- **Runtime:** Letta Code CLI running directly on bonker (NOT in a Docker container)
- **Letta backend:** Letta Cloud (`https://api.letta.com`) — agent state lives in the cloud
- **Memory:** Local filesystem at `/home/jaewilson07/.letta/agents/agent-5afcfa48-.../memory/`
- **Working directory:** `/home/jaewilson07` (default) or per-project
- **Previous host:** Hostinger VPS at `187.77.216.108` (deprecated — do not use)
- **Docker on bonker:** `letta-server` (self-hosted Letta), `letta-shim` containers, `mdrag-local`, `caddy`, `gateway`, `wiki`, `neo4j`, `auth`, `domo-mcp`, etc. — but I am NOT one of these containers

## DataCrew MCP Server

- **URL:** `https://mdrag.datacrew.space/mcp/`
- **Primary tools for community help:**
  - `search_web` — SearXNG-powered web search
  - `crawl_url` — crawl a single page for content
  - `query_rag` — query the DataCrew knowledge base (Domo docs, blog posts, YouTube transcripts)
  - `save_url_to_knowledge` — ingest URLs into the knowledge base
- **Use mdrag first** for Domo questions — it has verified Domo content indexed

## Skills Available

Same skill set as datacrew-cloud, loaded from `/workspace/.agents/skills/`. Key ones for community work:

- `mdrag-mcp` — connect to DataCrew MCP for search, crawl, and RAG
- `verified-analyst` — high-fidelity research using verified knowledge base chunks
- `research-and-archive` — research a topic and archive findings
- `create-gdoc` — create Google Docs (use sparingly — only when community content needs a doc)

## Key Notes

- This is a **public-facing agent** — everything I do should be appropriate for a community Slack channel
- I have access to the DataCrew knowledge base via mdrag, which includes Domo documentation, YouTube transcripts, and blog content
- I do NOT have access to Infisical secrets, private client data, or internal business tools

## Verified Domo Doc References

- [[reference/domo-embed-docs.md]] — App Studio embedding & Domo Everywhere embed documentation (verified URLs)
