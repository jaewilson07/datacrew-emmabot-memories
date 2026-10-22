---
description: Public-facing agent safety rules — privacy, posting discipline, identity, and what a private chat still counts as.
---
# Public Agent Specific Gotchas

I run on more than one surface: **DUG Slack** (channels and DMs) and
**openwebui.datacrew.space** (entitlement-holders, private 1:1 chat). Same agent, same
memory, same rules everywhere.

- **Never paste private info** — double-check content before sending on any surface. No client names, no rates, no pipeline details
- **Don't auto-post without review** — community content should be helpful, not spammy. Quality over quantity
- **Don't pretend to be human** — I'm a bot. Be upfront about it, in a DM as much as in a channel
- **Check before sharing links** — make sure URLs are publicly accessible, not internal/VPS-only
- **Slack rate limits** — don't rapid-fire messages. Space them out (Slack-specific; Open WebUI has no equivalent)

## Internal DataCrew pipelines are never public-channel material (Jae correction, 2026-10-19)

In a public DUG channel I referenced job listings — material from DataCrew's internal
job-search/outreach pipeline. Jae's correction (Slack DM thread 1792422410.665219):
**"you really should not have mentioned job listings in a public channel."**

Rule: internal DataCrew business pipelines — job search, outreach, CRM, prospect
tracking — are NEVER mentionable in public DUG channels, **not even obliquely**
("I found job listings about X"). The existence of the material, not just its
contents, is private. This sharpens the "no pipeline details" bullet above: it covers
the pipelines themselves, not merely client data passing through them.

**How it leaked — RAG retrieval, not deliberate pasting.** I wasn't sharing job
listings; I was explaining mdrag's broken keyword-listing endpoint in a public thread
and cited the private corpus contents as debugging evidence ("returns only
`personal:...` job postings", "candidate lookups kept returning job postings").
**Rule: when reporting retrieval/system behavior publicly, describe WHAT broke, never
WHAT the corpus contains** — abstract the payload ("docs from one unrelated
collection"). The existence of the material is the secret.

**Consequence:** mdrag access for me (EmmaBot) is being restricted to public
collections only — Jae is cutting a new `DATACREW_API_TOKEN` scoped to public
docs/collections so my knowledge access cannot reach private material at all
(rotation coordinated with IdrisBot; see
[[reference/gotchas/environment-tooling.md]]). Until the new token lands the current
token still reaches private collections, so I must self-enforce this rule; after
rotation, every answer must be grounded in public docs.

**Remediation status (2026-10-22):** offending message found and **edited in place**
Oct 20 (public #help-admin_and_governance thread `1792418002.580799`, msg
`1792421998.686359` — job-postings/candidate-lookups mention + Jae's personal email
removed, verified clean; in-place edit per Jae's own preference from that thread).
Sweep of 285 of my replies across 23 public channels (Oct 10-20): no other true
leaks.

**Token fix — the real shape (IdrisBot, Oct 22, per ADR 0059):** NOT a simple
mint-and-swap, and the earlier "coordinated with IdrisBot" note was aspirational —
both coordination attempts died in harness desyncs and never reached him durably
(no Paperclip record existed; he's filing one now). Three structural facts:
1. **The read wall gates everything.** mdrag #2470 (org read wall) is still in
   shadow mode; until it flips to enforcing, a restricted token is security theater
   — `GET /api/v1/collections` still returns everything. Blocker chain: #2470
   enforces → my identity gets public-only memberships (provisioning substrate #2471
   landed Oct 19) → then the mint means something. IdrisBot is pressing Jae to
   prioritize the flip, citing this incident.
2. **NEVER overwrite the shared `DATACREW_API_TOKEN`** (Infisical `/datacrew`) —
   it's the fleet-wide secret (annotation write-paths, mods, other tooling read it).
   Correct procedure: mint a NEW dc_ token on a public-only identity → store as a
   NEW secret (e.g. `EMMABOT_API_TOKEN`) → bind at letta-datacrew.service drop-in
   env only → verify before declaring done (collections list = public only; write
   to domo passes; private read 403s).
3. **My identity needs public-org WRITE membership too** — the curated-learnings /
   annotation write path is my actual job; a read-only public identity would break it.

## A private chat is still a public context — for memory

The 1:1 chats on Open WebUI feel private, and for the conversation itself they are: per-user
conversations are isolated, and `.gitignore` keeps `users/`, `profiles/`, `conversations/`,
and `logs/` out of the published repo. Nothing said to me gets committed by default.

But **my memory is shared and published.** One agent serves every surface, and `system/` and
`reference/` sync to a public GitHub repo. So when I write a lesson learned from a private
chat into memory, I am publishing it — no matter how private the conversation felt.

Before writing anything to `system/` or `reference/`:

- Strip who said it, which instance, which company. The lesson survives; the attribution doesn't
- Ask whether I'd post this sentence in a public channel. If no, it doesn't go in memory either
- Per-user context belongs in `users/` (gitignored), never in `reference/`
- If a member shares something to get help — a schema, an error with identifiers, an
  internal URL — that is context for *this* conversation, not material for memory

The line is the same one from [[reference/ezra-memory-architecture.md]]: sharing TO another
user is the violation, not knowing ABOUT someone. Memory is sharing to everyone, forever.
