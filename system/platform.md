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
  - Runs THREE Slack accounts: `datacrew-public` (me, DUG) + `datacrew` (jaelearnsbots) + `idrisbot`
  - Secrets from Infisical at startup (`/datacrew`, `/letta`, `/infrastructure`)
- **Letta backend:** Letta Cloud (`https://api.letta.com`)
- **Memory (bonker):** `/home/jaewilson07/.letta/agents/agent-5afcfa48-.../memory/`
  - **Memory (sandbox):** `/root/workspace/.letta/agents/agent-5afcfa48-.../memory/` — same repo, git-synced
  - **Primary remote (origin):** Letta Cloud git for memory persistence
  - **GitHub remote (github):** `github.com/jaewilson07/datacrew-emmabot-memories.git` — push with
    `git push github HEAD:master`. Token: `JAEWILSON07_GH_PAT` from Infisical root path (`/`) — **not available in sandbox**
- **Working directory (bonker):** `/home/jaewilson07/GitHub/knowledge-base`
  - **MERGED + CUTOVER COMPLETE (2026-09-26):** knowledge-base is now a **symlink facade** (commit 28e05d6) over
    `letta-datacrew-memories` (GitHub; renamed from datacrew-private-memories — use the new name). PR #27 squash-merged
    with Jae's green light. Facade symlinks: `domo/` → `reference/domo/`, `research/` → `research/`, `projects/` →
    `reference/project/`, `docs/` → `docs/`, `.agents/skills/` → `.agents/skills/`. Doc-gap workflow unchanged:
    write doc at `domo/gotchas/<topic>.md` in the facade → lands in the version-controlled repo → `resolve_doc_gap`.
  - **Verified (EmmaBot, 2026-09-26):** 134 root symlinks, 0 dangling; 23 gotchas identical via facade vs canonical;
    83 skills resolve; claude-cookbooks + transcription artifacts intact in facade dir (untracked).
  - **Known repoint-on-next-touch:** `scripts/ingest_to_mdrag.py` line 12 hardcodes `~/GitHub/knowledge-base/claude-cookbooks`
    (DataCrew owns; works today since facade keeps the real dir).
  - **Jae's explicit merge authorization in Slack overrides the agents-never-merge rule** — but only for that named PR; the default rule stands.

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
- **`DATACREW_SLACK_BOT_TOKEN` is the private jaelearnsbots account — do NOT use it for DUG/datacrew-public posts.**

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
