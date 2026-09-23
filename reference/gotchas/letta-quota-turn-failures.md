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
