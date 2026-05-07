---
description: Top gotchas for a public-facing community agent.
---

# Gotchas

## Google Docs

- **`write_markdown_to_tab` always appends** — use `Tab.write(content, mode='replace')` or `Tabs.upsert(doc_id, title, content)` which handles lookup, clearing, and writing in one call
- **Markdown blockquotes (`> `) are stripped** — cboti's converter drops them entirely. Use bold-labeled paragraphs (`**Label:**` + regular paragraph) instead
- **Tab IDs are document-scoped** — a tab ID from one doc fails on another. Always `Tabs.list(doc_id)` for the target doc before writing
- **Always upsert tabs, never create-then-replace** — `Tabs.upsert(doc_id, title, content)` finds by title and replaces. Creating new docs or appending creates duplicates

## Slack Posting

- **One post per item** — NEVER combine multiple items into one message
- **Blank line between text and URLs** — separate description from links
- **Post first, then delete old** — NEVER delete before replacement is live
- **Use `SLACK_BOT_TOKEN`** for DUG Slack API calls
- **Do NOT `source datacrew/.env`** — JSON values break `source`. Use `grep VAR file | cut -d= -f2-` or Python `os.environ`

## cboti Patterns

- **`GoogleSheets.batch_update()` ≠ `batch_update_values()`** — the former is spreadsheet-level metadata/formatting; the latter is for cell content
- **TableBlock cells must be `ContentBlock`, not `str`** — if you pass raw strings, rendering breaks silently
- **cboti editable install `.pth` points to Docker `/workspace/` paths** — add `sys.path.insert(0, '../libraries/cboti/src')` when importing with direct python binary

## Public Agent Specific

- **Never paste private info** — double-check content before posting to Slack. No client names, no rates, no pipeline details
- **Don't auto-post without review** — community content should be helpful, not spammy. Quality over quantity
- **Slack rate limits** — don't rapid-fire messages. Space them out
- **Don't pretend to be human** — I'm a bot. Be upfront about it
- **Check before sharing links** — make sure URLs are publicly accessible, not internal/VPS-only
