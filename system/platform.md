---
description: Where I run, what tools I have, and how to use them.
---
# Platform

## Running Location

- **Primary host:** bonker (Jae's self-hosted server)
- **Also run in:** Letta Cloud sandbox (ephemeral Linux, `/root/workspace` cwd) — when Jae or
  another agent sends me work via the Agent tool with `computer: cloud`. No Infisical secrets,
  no GitHub token, no MCP servers there — memory MemFS and shared repos are synced, tools differ.
- **Runtime (bonker):** Letta Code CLI as systemd user service (`letta-datacrew.service`)
  - Command: `letta server --channels slack --install-channel-runtimes`
  - Runs THREE Slack accounts: `datacrew-public` (me, DUG) + `datacrew` (`domo_user_group` — same workspace as emmabot, NOT jaelearnsbots; corrected 2026-10-15) + `idrisbot`
  - Secrets from Infisical at startup (`/datacrew`, `/letta`, `/infrastructure`)
  - **Also served from `.letta-alix-home`** (chat.letta.com conversations, incl. this one; sibling service
    `letta-alix.service` = alix bot migrated from cubby): HOME overridden to the alix home → `gh` unauthenticated
    there, memory projection is a separate clone **without the `github` backup remote**, Paperclip key only reachable
    via old-home absolute path. Canonical-home question pending Jae (2026-10-26). Use absolute paths, not `~`, from
    this home.
- **Letta backend:** Letta Cloud (`https://api.letta.com`)
- **Memory (bonker):** `/home/jaewilson07/.letta/agents/agent-5afcfa48-.../memory/`
  - **Memory (sandbox):** `/root/workspace/.letta/agents/agent-5afcfa48-.../memory/` — same repo, git-synced
  - **Primary remote (origin):** Letta Cloud git for memory persistence
  - **GitHub remote (github):** `github.com/jaewilson07/datacrew-emmabot-memories.git` — push with
    `git push github HEAD:master`. Token: `JAEWILSON07_GH_PAT` from Infisical root path (`/`) — **not available in sandbox**
  - **Push BOTH remotes after every commit batch** — origin alone silently strands the github backup
    (found ~15 commits / 1 month behind on 2026-10-28; merge, never force-push, when it diverges)
- **Working directory (bonker):** `/home/jaewilson07/GitHub/knowledge-base`
  - **FACADE WIPED (2026-10-25 09:40 MDT; discovered fire #21, 2026-10-26):** all 134 symlinks + the facade's local-only
    `.git` (no GitHub remote) destroyed; only `.letta/settings.local.json` remains. **Do NOT write into
    `~/GitHub/knowledge-base` — it is no longer a facade.** All content is safe in the real repo
    `~/GitHub/datacrew-private-memories` (GitHub: `jaewilson07/letta-datacrew-memories`, HEAD `b812a0e`).
    Doc-gap workflow now: write docs at `reference/domo/gotchas/<topic>.md` in the REAL repo → PR → `resolve_doc_gap`.
    Lost with the wipe: claude-cookbooks (untracked real dir; `scripts/ingest_to_mdrag.py` line 12 points there —
    recoverable from upstream).
  - **Wipe confirmed INTENTIONAL (Jae, 2026-10-26 chat):** goal = consolidate memory on one repo; facade stays retired,
    no restoration. **Boundary rule (Jae):** alix/Picassa/Petra may share a memory + GitHub repo, but it must be kept
    SEPARATE from letta-agent memory (DataCrew, IdrisBot, EmmaBot — each keeps its own per-agent repo). My repo setup
    already complies (origin = per-agent Letta Cloud git). PR #55 (orphaned doc-gap files) still pending Jae's merge.
  - **resolve_doc_gap auto-ingest FIXED + verified (deployed 2026-10-26 23:17 UTC):** doc-gap tools are the agent-level
    mod `mods/dug-community.ts` in this MemFS repo (NOT Cloud-side). Fix (commit `d19034e`, Paperclip DAT-1775, status
    done): KB root default repointed to `/home/jaewilson07/GitHub/datacrew-private-memories` (`KNOWLEDGE_BASE_DIR` env
    override still available), `MDRAG_COLLECTION` 'domo-official-docs'→'domo', resolve_doc_gap probes direct then
    `reference/`-prefixed paths (covers the 29 old-layout ledger records), skip message lists both attempted paths.
    Deployed via Jae-approved `letta-datacrew.service` restart; verified end-to-end (slicer gap re-resolve → mdrag
    ingestion success, doc 60aee6df). Manual-ingest workaround (curl POST `https://wiki.datacrew.space/api/v1/ingest/text`,
    collection_id `6a34c9220c958fca1b9df8a3`) is now only an emergency fallback. IdrisBot post-deploy review of d19034e
    pending; fix-forward next window if issues.
  - **Cloudflare bans python-urllib on wiki.datacrew.space (verified 2026-10-26):** POSTs from python urllib (UA
    "Python-urllib/3.x") get Cloudflare "error code: 1010" (browser-signature ban) → looks like a 403 auth failure
    but isn't; curl with the same token works. For mdrag API calls from exec shells, use curl (build JSON payloads
    with python to a temp file, then `curl -d @file`).
  - **History:** facade (commit 28e05d6, PR #27 squash-merged with Jae's green light) served 2026-09-26 → 2026-10-25.
  - **Jae's explicit merge authorization in Slack overrides the agents-never-merge rule** — but only for that named PR; the default rule stands.

## Site publishing (datacrew.space)

- **Separate nested git repo:** the site lives at `~/GitHub/datacrew/website/` with its OWN `.git` (remote:
  `jaewilson07/datacrew-site.git`) — the outer `~/GitHub/datacrew` repo gitignores `website/`. Commit/push site
  changes from inside `website/`, not the outer repo.
- **Articles:** `website/content/blog/YYYY-MM-DD-slug/index.mdx` (frontmatter: title/date/slug/topic/audience/excerpt/tags).
- **Deploy:** auto-deploys to Cloudflare Pages via `.github/workflows/deploy.yml` on push to `main`.
- **Husky pre-commit runs `tsc`:** if it fails on "Cannot find module 'jsdom'", local `node_modules` is stale
  (jsdom IS declared in package.json) — fix: `npm i --no-save jsdom @types/jsdom` (never commit that change).
- **Secret hygiene:** the website repo's origin URL has an embedded `ghp_` token — never echo `git remote -v`
  output to transcripts/channels.

## Git / PR Workflow (Jae directive 2026-09-25)

- **All agent work goes through GitHub PRs** — own work or commissioned Claude work. No direct pushes to `main`/`master`.
- **Jae is sole merge authority** — agents open PRs, comment, flag issues; never merge (own or peers' PRs) unless Jae explicitly authorizes in-channel.
- Applies to: `letta-datacrew-memories` (and any bonker repo with a GitHub remote). `datacrew-shared` is Letta Cloud git,
  main-only push/pull — no PRs possible there; decision-log entries commit directly to main.
- Decision record: `datacrew-shared/project/decision-log.md` 2026-09-25 entry.

## Slack Adapter

- **`listen_mode`** — per-account only (not per-channel). When `true`, unmentioned replies are read-only until `@mention`. No per-channel equivalent in Slack.
- **`channel-mention-gate` mod** — DISABLED (disruptive UI). Needed for per-channel gate behavior, but the `turn_start` cancel creates noisy "Interrupted" messages.
- **Routing** — `routing.yaml` maps chat IDs to agents. `routing.yaml` + channel config determine which agent handles each channel.
- **`allowBots`** — per-account setting (not in docs). `false` drops bot messages; `\"mentions\"` accepts only explicit bot mentions. Set to `\"mentions\"` on all 3 accounts.
- **Bot IDs** (for mention checks in mods): EmmaBot `U0B35MJ9540` (datacrew-public), DataCrew `U0AQ7N23LKT` (datacrew), IdrisBot `U0BHRTU63E1` (idrisbot)
- **Bot token locations (verified directly 2026-10-14):** `~/.letta/channels/slack/accounts.json` holds ALL THREE datacrew account bot+app tokens in plaintext (datacrew-public, datacrew, idrisbot) — an earlier claim that it held only alix+petra was wrong (Rizz's scout read a stale file). Treat the file as sensitive: never echo it to transcripts or channels. The datacrew-public (EmmaBot) token also lives in the running `letta-code-channels-datacrew-public` service env (Infisical `/datacrew` path; config `channel-configs/datacrew-public.yaml`). Bonker-side workers can post as emmabot via `chat.postMessage` with the token from either source (verified ×2 on 2026-10-14: Rizz's relay to DUG thread 1791994555.561209 read the token from the service env; another fleet agent read accounts.json in-process, never printed).
- **`DATACREW_SLACK_BOT_TOKEN` (the `datacrew` account) is in the SAME workspace as emmabot** — `auth.test` (verified 2026-10-15 via `x-oauth-scopes` headers) shows team `domo_user_group` for both tokens; the earlier "private jaelearnsbots account" note was WRONG about the workspace. Corrected rule: (a) **POSTING to DUG is still emmabot-only (`datacrew-public`)** — identity matters; (b) **READ-scoped calls may use the datacrew token**, which has scopes emmabot lacks — notably `users:read.email` and `users.profile:read` (emmabot's token does NOT have `users:read.email`; profile emails return null with it). **For profile-email lookups, use the datacrew token.**

### Channel Types (first-party vs custom stream)

The `--channels` flag accepts both first-party adapters and custom channel plugins. Two families:

- **First-party `slack`**: Stable, no thinking indicator. Responses appear only at turn completion. `datacrew-public` and `datacrew` use this — no streaming, so build tasks = minutes of radio silence.
- **Custom stream channels**: Clone the first-party adapter + add a live streaming sidecar (thinking/response shown while turn runs, then removed). Currently running in prod: `bid-buddy-stream`, `buzz-stream`, `openwebui-stream`, `wiki-stream`, `mermaid-stream`, and `slack-stream` (built but not enabled for high-traffic accounts). All three bot accounts use `idrisbot` for the custom-channel proof phase.
- **Phased rollout rationale**: Custom channel plugin deploy path was unproven in Sept 2026. Proven on lowest-traffic account (`idrisbot`) first, then expanded. `slack-stream` is built and ready but not enabled for `datacrew-public`/`datacrew` yet — enabled by config choice, not capability gap.
- **Streaming enables visibility**: Accounts on custom stream channels show thinking progress mid-turn; accounts on first-party `slack` don't. This explains why DataCrew appears "dead" to observers during build tasks.

## Shared Memory

- **`datacrew-shared`** repo — shared memory on Letta Cloud for EmmaBot, DataCrew, IdrisBot (team conventions, project decisions, research). Not part of personal MemFS.
- **Agent-to-agent messaging:** `letta -p --from-agent $LETTA_AGENT_ID --agent <target-id> "message"` — via Letta API, not Slack. Hidden conversations.

## Key References

- MCP server details & toolsets → [[reference/mcp-server.md]]
- Available skills → [[reference/platform-skills.md]]
- Domo doc references & agentic patterns → [[reference/domo-doc-references.md]]
- crew-dcs repo & "file a ticket for another agent" workflow → [[reference/projects/crew-dcs.md]]
