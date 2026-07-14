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
- **cboti path mismatches** — when importing cboti with a direct python binary (not via the package install), add `sys.path.insert(0, '../libraries/cboti/src')` to find the source. Path issues were common in the old Docker container; on bonker, check the actual install location.

## Environment / Tooling Gotchas

- **Bash tool requires bwrap (bubblewrap)** — the Letta Code CLI uses it for command sandboxing. Error `Executable not found: /usr/bin/bwrap` means bubblewrap isn't installed. Fix: `sudo apt-get install bubblewrap` (Debian/Ubuntu). When Bash is broken: can't clone repos, run commands, dispatch Claude Code/Codex, or use skills that require Bash. This occurs on local machines without bubblewrap; Docker containers typically have it.
- **MCP server URL is `wiki.datacrew.space` not `mdrag` or `wikki`** — old `mdrag.datacrew.space` 301-redirects to `wiki.datacrew.space` (one 'k'). `wikki.datacrew.space` (two k's) also redirects. Always use `https://wiki.datacrew.space/mcp/` directly.
- **`save_url_to_knowledge` returns 401** — internal auth forwarding bug on the wiki MCP server. Use `save_text_to_knowledge` instead — read the content locally and pass as text.
- **MCP toolsets are lazy-loaded** — call `list_capabilities` to see all toolsets, then `reveal_toolset(name)` to access tools. Default tools don't include `search_web`, `query_rag`, etc. — they're in the `web` and `rag` toolsets.
- **MCP requires SSE Accept header** — must send `Accept: application/json, text/event-stream` or get "Not Acceptable" error. Responses come as SSE events (`event: message\ndata: {...}`).
- **MCP session ID required** — after `initialize`, extract `Mcp-Session-Id` from response headers and include it in all subsequent requests.
- **Never `env | grep` without filtering** — printing all env vars exposes secrets (Slack tokens, API keys, JWTs, OAuth credentials). Always filter to specific vars or use `grep -i VARNAME` for a single var.

## Domo Developer Docs

- **Developer docs are JS-rendered** — `developer.domo.com` pages return empty content when fetched via `fetch_webpage`. Need to find alternative sources or use mdrag RAG for developer content
- **Pro-code deployment workflow is a common DUG question** — users frequently ask about streamlining the IDE → `domo publish` → card → App Studio → share workflow. Direct access is possible via the app instance `launch-form` URL: `{instance}/api/apps/v1/instances/{app-instance-id}/launch-form` (found in browser dev tools Network tab when the app loads). Also supports filter params and `appData`. Streamlining options: use launch-form URL directly, go straight to App Studio (skip dashboard), reuse template App Studio apps, automate card creation via Domo API, use App Studio embed link as delivery mechanism

## Domo AI Chat

- **AI Chat button missing is a common DUG question** — users frequently can't find the AI Chat button even after confirming AI is enabled and grants are correct. Root causes (in order of likelihood):
  1. **Old navigation layout** — AI Chat icon only appears in the new left-side navigation (rolled out Aug 2025). If instance is on old top navigation, the button won't show. Admin enables new nav via `Admin > Feature Management`
  2. **Consumption agreement required** — AI Chat and AI Readiness docs state: "available to users on a consumption agreement; non-consumption customers can request a trial via their CSM." If the instance is on traditional subscription, the feature isn't provisioned even with all settings/grants correct. CSM must enable it
  3. **No model provider configured** — check `Admin > AI Service Layer > AI Agent Settings` for Default Model Provider, and `Admin > AI Service Layer > Services` for Chat Completion service having a model assigned
  4. **Generative AI not actually toggled on** — `Admin > AI Service Layer > AI Settings` > "Generative AI Enabled for Instance" must be ON
- **Troubleshooting order**: check nav layout → check AI Settings toggle → check model provider → check grants → escalate to CSM for entitlement/consumption agreement
- **Mobile app workaround** — AI Chat is available in the Domo mobile app (More > AI) without grants, good for testing data/AI Readiness setup while web UI issues are sorted
- **Key docs**: Use AI Chat (https://www.domo.com/docs/s/article/000005539), AI Readiness (https://www.domo.com/docs/s/article/000005561), AI Admin Settings (https://www.domo.com/docs/s/article/AI-Admin-Settings), AI Admin Agent Settings (https://www.domo.com/docs/s/article/AI-Admin-Agent-Settings)

## Audio Transcription

- **Local whisper models produce unreliable transcriptions** — both `tiny` and `base` models hallucinate on Slack audio clips (produce repetitive garbage like "I think it is" or "AXE"). The audio clips from Slack voice memos seem to have characteristics that confuse whisper (consistent amplitude, possible background noise). Don't rely on local whisper for Slack audio — ask the sender to type it out instead.
- **Whisper cache exists** at `/home/jaewilson07/.cache/whisper/` (has `base.pt` and `tiny.pt` models). Can install via `uv venv /tmp/whisper_env && source /tmp/whisper_env/bin/activate && uv pip install openai-whisper`. But results are poor for Slack voice memos.
- **No cloud transcription available** — no OpenAI API key, no Groq key. Hugging Face API is unreachable from the sandbox (DNS resolution fails). The only option is local whisper, which doesn't work well.

## crew-dcs Code Engine

- **`create()` doesn't re-fetch after creation** — The API response from `POST /api/codeengine/v2/packages` doesn't include `versions`, so `current_version` is always `None` after creating a package. Fix: re-fetch via `get_by_id()` after `create()`. (Found 2026-07-14, fix pushed to crew-dcs `main` as commit `4b08d19`)
- **`from_dict()` version timing bug** — `versions` is set AFTER `__post_init__` runs, but `_set_current_version()` is only called in `__post_init__`. So `current_version` stays `None` even when versions are present. Fix: call `_set_current_version()` after versions are populated in `from_dict()`.
- **Return type annotation extraction broken** — `from_ast_function_return_arg()` passes `ast_fn.returns` (an `ast.Name` node) to `extract_ast_arg_type_annotation()` which expects an `ast.arg` with `.annotation` attr. All return types default to `"object"` instead of the correct type. Fix: use `ast.unparse(ast_fn.returns)` directly. Now `-> str` maps to `text` and `-> int` maps to `number`.
- **Version must be deployed before functions run** — after `upsert()`, call `deploy_release()` to deploy the version. Functions cannot be called until the version is released.
- **Code Engine input type support is incomplete** — Tested all Python type mappings live on domo-community (2026-07-14):
  - `str` → `text` ✅, `int` → `number` ✅, `float` → `decimal` ✅, `bool` → `boolean` ✅, `dict` → `object` ✅
  - `list` → `object` with `isList=True` ⚠️ — lists of dicts work, but lists of primitives (strings) fail with HTTP 400
  - Python default values are NOT applied by Code Engine — functions receive `None` instead of the default. All inputs must be explicitly passed
  - `str | None` (union type) maps to `object` and fails at runtime — avoid union types in Code Engine function signatures
  - Functions without type annotations get `object` type but may fail at runtime — always annotate
  - `from typing import Any` import caused `TypeError: 'type' object is not subscriptable` in Code Engine runtime — avoid importing from `typing` in Code Engine packages
- **Sample project exists in crew-dcs** — `projects/sample-codeengine-functions/` contains `sample_utils.py`, `type_test.py`, `upload.py`, and `README.md` documenting the Code Engine upload workflow and type test results

## Public Agent Specific

- **Never paste private info** — double-check content before posting to Slack. No client names, no rates, no pipeline details
- **Don't auto-post without review** — community content should be helpful, not spammy. Quality over quantity
- **Slack rate limits** — don't rapid-fire messages. Space them out
- **Don't pretend to be human** — I'm a bot. Be upfront about it
- **Check before sharing links** — make sure URLs are publicly accessible, not internal/VPS-only
