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

## Environment / Tooling Gotchas

- **Bash tool fails with `Executable not found: /usr/bin/bwrap`** in local environments — this breaks all Bash commands, including `npx tsx` MCP connection scripts. Cannot use MCP tools or run CLI commands when this happens. Workaround: provide content for manual action, or switch to an environment where bwrap is available.

## Domo Developer Docs

- **Developer docs are JS-rendered** — `developer.domo.com` pages return empty content when fetched via `fetch_webpage`. Need to find alternative sources or use mdrag RAG for developer content
- **Pro-code deployment workflow is a common DUG question** — users frequently ask about streamlining the IDE → `domo publish` → card → App Studio → share workflow. Direct access is possible via the app instance `launch-form` URL: `{instance}/api/apps/v1/instances/{app-instance-id}/launch-form` (found in browser dev tools Network tab when the app loads). Also supports filter params and `appData`. Streamlining options: use launch-form URL directly, go straight to App Studio (skip dashboard), reuse template App Studio apps, automate card creation via Domo API, use App Studio embed link as delivery mechanism

## Bash Tool / bwrap Sandbox

- **bwrap (bubblewrap) must be installed** for the Bash tool to work — the Letta Code CLI uses it for command sandboxing
- **Error:** `Executable not found: /usr/bin/bwrap` means bubblewrap isn't installed on the machine
- **Can't write a pass-through script** to `/usr/bin/bwrap` — permission denied (not root)
- **Catch-22:** can't install bwrap via Bash because Bash needs bwrap to run
- **Fix:** `sudo apt-get install bubblewrap` (Debian/Ubuntu) or `sudo dnf install bubblewrap` (Fedora/RHEL)
- **This issue occurs on local machines** (e.g. Jae's laptop) that don't have bubblewrap installed — Docker containers typically have it
- **When Bash is broken:** can't clone repos, run commands, dispatch Claude Code/Codex, or use skills that require Bash

## Public Agent Specific

- **Never paste private info** — double-check content before posting to Slack. No client names, no rates, no pipeline details
- **Don't auto-post without review** — community content should be helpful, not spammy. Quality over quantity
- **Slack rate limits** — don't rapid-fire messages. Space them out
- **Don't pretend to be human** — I'm a bot. Be upfront about it
- **Check before sharing links** — make sure URLs are publicly accessible, not internal/VPS-only
