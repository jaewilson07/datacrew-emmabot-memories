---
description: Where I run, what tools I have, and how to use them.
---

# Platform

## Running Location

- **Host:** bonker (Jae's new server, migrated from Hostinger VPS) — `letta-code-channels-datacrew-public` Docker container
- **Previous host:** Hostinger VPS at `187.77.216.108` (deprecated — do not use)
- **Working directory:** `/workspace/datacrew`
- **Skills directory:** `/workspace/.agents/skills/` (same skills as datacrew-cloud)

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
