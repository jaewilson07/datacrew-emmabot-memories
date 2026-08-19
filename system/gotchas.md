---
description: Compact index of gotchas — one-liners with links to detailed reference files.
---
# Gotchas Index

Quick reminders. Details in `reference/gotchas/`.

- **Google Docs**: upsert tabs, never create-then-replace → [[reference/gotchas/google-docs.md]]
- **Slack posting**: one post per item, post-then-delete, never `source .env` → [[reference/gotchas/slack-posting.md]]
- **cboti**: `batch_update` ≠ `batch_update_values`, TableBlock cells need ContentBlock → [[reference/gotchas/cboti-patterns.md]]
- **Environment**: bwrap required, MCP URL is `wiki.datacrew.space`, mods at `~/.letta/mods/` affect ALL agents, mdrag needs `uv`+`httpx` → [[reference/gotchas/environment-tooling.md]]
- **Search**: "Domo tour" → music tours (DOMi & JD Beck), not Domo events. Use `site:domo.com` to disambiguate → [[reference/gotchas/environment-tooling.md]]
- **Domo dev docs**: JS-rendered (fetch fails), pro-code launch-form URL trick → [[reference/gotchas/domo-developer-docs.md]]
- **Domo AI Chat**: button missing → check nav, consumption agreement, model provider → [[reference/gotchas/domo-ai-chat.md]]
- **Domo AI Library**: Conversational Agents is beta, needs CSM enable → [[reference/gotchas/domo-ai-library.md]]
- **Audio transcription**: local whisper unreliable for Slack voice memos → [[reference/gotchas/audio-transcription.md]]
- **crew-dcs Code Engine**: create() doesn't re-fetch, type mapping incomplete → [[reference/gotchas/crew-dcs-code-engine.md]]
- **AppDB permissions**: `Write` = collection properties, NOT document CRUD → [[reference/gotchas/appdb-permissions.md]]
- **Public agent rules**: never paste private info, don't pretend to be human, and a private 1:1 chat is still a public context *for memory* — my memory is shared and published → [[reference/gotchas/public-agent-rules.md]]
