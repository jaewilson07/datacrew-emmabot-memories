---
description: Mod event contract gotchas — turn_end only accepts {continue: string}, llm events don't fire on Cloud backend, TS2591 on type-check is expected noise.
---

# Letta Code mod event contracts (verified from letta.js)

Verified 2026-09-23 by reading the letta.js bundle
(`/home/jaewilson07/.local/lib/node_modules/@letta-ai/letta-code/letta.js`).
Mods must return **only** these shapes — anything else is silently ignored.

## turn_start

Payload: `{agentId, conversationId, input}` where `input` is the message array.
Return shapes:
- `{cancel: {reason: string}}` — cancels the turn (channel-mention-gate uses this)
- `{input: [...]}` — replaces the input

## turn_end

Payload: `{agentId, conversationId, stopReason, assistantMessage}`.
Return shape:
- `{continue: string}` — the harness feeds this back as a **new user message**,
  triggering a follow-up turn (emitHeadlessTurnEnd, letta.js ~L459080). This is
  the only way to react to a completed reply (e.g. citation-nudge mod).
- No `{append}` or message-mutation return exists — the assistant message is
  immutable once the turn ends.

## tool_start / tool_end

Payload: `{toolName, args, conversationId, result?}`.
Return shapes:
- tool_start: `{args: {...}}` (mutate args) or `{result: {status: "success"|"error", output: string}}`
- tool_end: `{result: {status, output}}` (override result if not already set)

## Capability gates

- `turn_start`/`turn_end` → `letta.capabilities.events.turns`
- `tool_start`/`tool_end` → `letta.capabilities.events.tools`
- `llm_start`/`llm_end` → `letta.capabilities.events.llm` — **don't fire on the
  Cloud backend** (confirmed empirically 2026-09-22; only tool/turn/compact do)
- `compact_start`/`compact_end` → `letta.capabilities.events.compact`

## Gotchas

- Type-checking mods with ad-hoc `npx tsc --strict` shows TS2591 errors for
  `node:fs`/`process` (no @types/node in the mods dir) — existing working mods
  show the same; the runtime loader handles it. Filter TS2591 when checking.
- Mods live at `~/.letta/mods/`, sync to infra-bonker via
  `sync-mods.sh` (two-way, newest mtime wins, auto-commits + pushes).
- Service restart required to activate mod changes (`systemctl --user restart
  letta-datacrew`) — Jae's call, not mine.
