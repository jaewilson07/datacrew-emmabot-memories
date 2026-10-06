---
description: Compact index of gotchas — one-liners with links to detailed reference files.
---
# Gotchas Index

Quick reminders. Details in `reference/gotchas/`.

- **Tool-use loops**: agent gets trapped in repetitive tool-call cycles, self-aware but unable to break. If you've tried the same approach 3 times and failed, step back and check docs or ask for help → [[reference/gotchas/tool-use-loops.md]]
- **Google Docs**: upsert tabs, never create-then-replace → [[reference/gotchas/google-docs.md]]
- **Slack posting**: one post per item, post-then-delete, never `source .env` → [[reference/gotchas/slack-posting.md]]
- **cboti**: `batch_update` ≠ `batch_update_values`, TableBlock cells need ContentBlock → [[reference/gotchas/cboti-patterns.md]]
- **Environment**: bwrap required, MCP URL is `wiki.datacrew.space`, mods at `~/.letta/mods/` affect ALL agents, mdrag needs `uv`+`httpx`; `wikki.*` 301 = hard error for httpx `follow_redirects=False` clients (MDRAG_URL must use `wiki.` host) → [[reference/gotchas/environment-tooling.md]]
- **Search**: "Domo tour" → music tours (DOMi & JD Beck), not Domo events. Use `site:domo.com` to disambiguate → [[reference/gotchas/environment-tooling.md]]
- **Domo dev docs**: JS-rendered (fetch fails), pro-code launch-form URL trick → [[reference/gotchas/domo-developer-docs.md]]
- **Domo AI Chat**: button missing → check nav, consumption agreement, model provider → [[reference/gotchas/domo-ai-chat.md]]
- **Domo AI Library**: Conversational Agents is beta, needs CSM enable → [[reference/gotchas/domo-ai-library.md]]
- **Audio transcription**: local whisper unreliable for Slack voice memos → [[reference/gotchas/audio-transcription.md]]
- **crew-dcs Code Engine**: create() doesn't re-fetch, type mapping incomplete → [[reference/gotchas/crew-dcs-code-engine.md]]
- **AppDB permissions**: `Write` = collection properties, NOT document CRUD → [[reference/gotchas/appdb-permissions.md]]
- **Public agent rules**: never paste private info, don't pretend to be human, and a private 1:1 chat is still a public context *for memory* — my memory is shared and published → [[reference/gotchas/public-agent-rules.md]]
- **Duplicate answers**: scan thread history for your own prior messages before replying — don't post the same content twice → [[reference/gotchas/slack-posting.md]]
- **Function name hallucination**: verify Domo function names against the Beast Mode Functions Reference Guide before citing them — `userAttribute()` doesn't exist in Domo (it's Tableau's `USERATTRIBUTE`); user context lives in the policy layer (Dynamic PDP), not Beast Mode → [[reference/gotchas/beast-mode-function-names.md]]
- **Doc URL hallucination**: never construct developer.domo.com permalinks (hash slugs can't be guessed); portal moved to `www.domo.com/docs/portal/...`; cite only tool-returned URLs, or describe the doc location by name → [[reference/gotchas/doc-url-hallucination.md]]
- **Code Engine dual surfaces**: external = `/api/codeengine/...` + X-DOMO-Developer-Token; in-app = `/domo/codeengine/v2/packages/{alias}` (manifest-wired) — custom apps can't call `/api` endpoints at all (Joseph Meyers correction) → [[reference/gotchas/codeengine-dual-api-surfaces.md]]
- **Summary Number**: no grain selector for "Use Current Value" (inherited from chart, docs imply otherwise); use `SUM(1)` not COUNT (NULL ambiguity); can't reproduce the number in a plain table card → fix the data model first (check for JOINed facts — UNION instead) → [[reference/gotchas/summary-number-count-vs-sum1.md]]
- **"Show chart data"**: shows the chart's POST-grouping query — cannot verify raw-data hypotheses (distinct timestamps, duplicates). Use DataSet preview or COUNT(DISTINCT) Beast Mode probe instead → [[reference/gotchas/summary-number-count-vs-sum1.md]]
- **Customer-specific connectors**: "P&G" in a connector name = Procter & Gamble, NOT generally available — doc pages look identical to GA connectors. Never recommend a company-branded connector; ground truth is the connector picker in the instance → [[reference/gotchas/customer-specific-connectors.md]]
- **DataSet View credits**: virtual ≠ free — Views/Fusion rows cost 1 credit per 2M/month (vs 1/1M materialized); views save *execution* credits, not storage. Check domo.com/consumption-terms before any cost claim → [[reference/gotchas/dataset-view-credits.md]]
- **Autocomplete ≠ capability**: Domo formula editors (Views Explorer Calculated Columns, Beast Mode) accept window functions like `rank() over(...)` that the FUNCTIONS autocomplete doesn't surface — "no matches when typing" ≠ unsupported. Undocumented; doc gap filed → [[reference/gotchas/dataset-view-credits.md]]
- **Account edit clobbers credentials**: writeback connectors read the input DataSet via the Platform API (`api.domo.com/v1/datasets`) with the Client ID/Secret stored in the Account — a 401 there = broken stored credentials, not DataSet permissions. Editing an account (even rename-only) re-submits the full credential form and can clear fields not re-entered → [[reference/gotchas/account-edit-credential-clobber.md]]
- **Quota exhaustion → public spam**: raw quota/credit errors post verbatim into Slack threads from the Cloud bridge — NO mod can intercept (past all hook points). Check `/v1/metadata/balance` + `/v1/organizations/self/quotas`; quota-watchdog mod DMs Jae early → [[reference/gotchas/letta-quota-turn-failures.md]]
- **Mod event contracts**: turn_end only accepts `{continue: string}` (feeds a follow-up turn) — no message mutation; llm events don't fire on Cloud backend; TS2591 on type-check is expected noise → [[reference/gotchas/mod-event-contracts.md]]
- **GitHub PR head sync lag**: after force-pushing a rebased PR, PR head can stay at old SHA (no CI, mergeable CONFLICTING) — check githubstatus.com, verify ref with `git ls-remote`, nudge with an empty commit (disappears in squash merge) → [[reference/gotchas/github-pr-head-sync-lag.md]]
- **pkill self-match**: `pkill -f` pattern matching the invoking exec_command's own cmdline kills the wrapping shell mid-run — match on something not in your command string (e.g. `pkill -f "port 8765"`) or kill by exact PID → [[reference/gotchas/pkill-self-match.md]]

- **Agent messaging**: `letta -p` CLI times out silently (300s), may not deliver — never assume success; verify via message list or use SendAgentMessage tool; parallel agent execution means tasks may already be done by another agent
- **AI toolkit via MCP**: skills/references do NOT pass through (Ben Schein, Sept 2026); AI Readiness metadata IS reachable via undocumented `/api/ai/readiness/v1/data-dictionary/dataset/{id}` — wrap it as an MCP tool → [[reference/gotchas/ai-readiness-mcp-passthrough.md]]
