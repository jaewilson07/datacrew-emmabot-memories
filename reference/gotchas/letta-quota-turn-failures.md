---
description: Quota exhaustion behavior — raw quota/credit errors post verbatim into Slack threads from the Cloud bridge, no mod can intercept; check balance/quotas endpoints; re-drive queued work from thread history after reset.
---

# Letta quota/credit exhaustion → public "Turn failed" spam

## Symptom

When the org runs out of Letta credits or a quota bucket empties mid-day, every
turn fails and the Slack channel bridge posts the raw error verbatim into the
public thread:

```
Turn failed: You've used all of your Letta tier model inferences for this day
(30,000 per day). Quota resets in 8h 4m. Please upgrade your plan or try again
after the reset. Insufficient credits ($-0.648) to fulfill this request...
```

This repeats for *every* subsequent message in the thread — on 2026-09-22 it
posted ~10 of these into Jim Stephenson's public thread, and community members
noticed ("go home you're drunk").

## Recurrence: 2026-10-14

- The 30k/day Letta tier quota exhausted at ~19:36 UTC and every "Turn failed"
  error again posted **publicly** into the Slack thread as the bot — 3× visible
  spam this time.
- The outage killed turns **and scheduled wakes** for ~8h, until a mention
  re-invocation at 03:07 UTC the next day.
- The quota-watchdog mod did **not** prevent the public posting (it DMs Jae,
  but the raw error still lands in the thread).
- **When quota is exhausted, queued work dies silently** — after the reset,
  re-drive that work from the Slack thread history, not from internal state
  (the agent has no record of what it never got to run).

## Sustained Negative Balance (2026-10-31 → Nov 5) — RESOLVED

- The balance went to **-1159 credits** (≈ -$1.16) in the Oct 14 exhaustion and
  persisted at that level for over a week without payment. **Resolved 2026-11-14.**
- **Credit recovery timeline:**
  - **Nov 6 (fire #31):** balance STILL -1159, but lettaTier daily bucket
    recovering ("high" vs empty on Nov 5). Silent fire death risk still active.
  - **Nov 14 (fire #39):** balance recovered to **+855**. Fires #32–#38 (Nov
    7–13) had produced zero turns — a 7-day silent gap separate from credit
    debt (see below). All quota buckets "empty" at fire #39 start.
  - **Nov 18 (fire #43):** balance jumped to **+20,732** (monthly billing reset:
    19,877 monthly + 855 carryover). All quota buckets healthy.
- **Two failure modes observed under negative balance:**
  1. **Public error spam** — turns that start successfully post the raw error
     to Slack (the behavior documented above).
  2. **Silent fire death** — scheduled wakes (cron fires) produce **zero turns,
     zero messages, zero errors**. The cron system reports `failed=0/missed=0`.
     This happened Nov 2–4: fires #28, #29, and the Nov 4 slot never produced
     any output at all. Diagnosed via recall agent reconstruction (fire #30,
     Nov 5).
- **Nothing queued work is lost** — the ledger was empty and DUG activity
  continued in other conversations during the silent gap. But any fire-specific
  state or context that would have been produced in a dead fire is simply gone.
- **Current status (2026-11-18):** Balance +20,732, all buckets healthy, no
  fire death risk from credit debt. The underlying pattern remains valid if
  credits run negative again in the future.

## Silent Gap Despite Credit Recovery (2026-11-07 → Nov 13)

- Fires #32–#38 (Nov 7–13) produced **zero turns** over 7 consecutive days,
  despite the credit balance recovering to **+855** by Nov 14.
- At fire #39 start, all quota buckets were reported as "empty" — the wake
  fired but the turn had no headroom to run, OR the cron runner itself was
  down between Nov 7–13.
- The root cause was not credit debt (which had been resolved by fire #39),
  suggesting a secondary failure mode: quota bucket state lag behind balance
  recovery, or an infrastructure issue with the cron dispatcher.
- **Diagnostic note:** this gap was only detectable because fire #39 (Nov 14)
  itself fired but showed zero repo changes over the full Nov 1–14 window.
  Without a fire that produces output, a silent gap can go unnoticed for
  weeks.
- **Current status (2026-11-18):** Resolved after billing cycle reset on
  Nov 18 (balance +20,732, all buckets healthy). Fires running normally.

## Mechanism

- The error posting happens **inside the Slack channel bridge in letta.js**
  (Cloud backend), *after* all mod hook points. **No mod can intercept it.**
- Balance went negative (-648 credits = -$0.648) without any warning — there
  is no built-in notification when credits run low.
- Quota buckets: `lettaTier` (30k/4h) and `basic` are the active ones for us;
  `standard`/`premium` are empty (unused tier).

## Diagnostic / fix

- **Check status**: `GET https://api.letta.com/v1/metadata/balance` and
  `GET https://api.letta.com/v1/organizations/self/quotas` with the Letta API
  key. Balance units: 1 credit = $0.001.
- **Watchdog mod** (2026-09-23, `~/.letta/mods/quota-watchdog.ts`, synced to
  infra-bonker): hooks `turn_start`, checks once/hour, DMs Jae when balance
  < 500 credits or any bucket is empty. State: `.quota-watchdog-state.json`.
- **Upstream fix needed**: quota/credit errors should map to a generic
  message (like DB-lock timeouts do) instead of raw error text — file Letta
  feedback (submitting-feedback skill).
- Community-facing: when this happens, post an apology + the actual answer
  once quota resets; don't leave the thread dangling.

## Related

- [[slack-posting]] — post-then-delete, one post per item
