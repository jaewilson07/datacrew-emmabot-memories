---
description: Agent gets trapped in repetitive tool-call loops when unfamiliar with a tool or its parameters. Self-aware but unable to break the cycle.
---
# Tool-Use Failure Loops

- **Symptom**: Agent enters a repetitive cycle calling the same tool (or variant) with slight parameter changes, recognizing the failure but unable to resolve it. Typically manifests as 50–200+ consecutive turns of nearly identical reasoning.

- **Trigger**: Usually occurs when the agent encounters an unfamiliar tool, unclear tool parameters, or a parameter format it can't figure out. The agent tries variations but doesn't step back to re-evaluate the approach.

- **Key behavioral signs**:
  - Repeated phrases like "I keep making the same mistake," "I am stuck in a loop," "I need to include the `X` parameter"
  - The agent self-diagnoses the problem ("I'm not passing the message parameter") but still repeats it
  - Reasoning doesn't evolve — just restates the same insight and tries the same action again

- **What NOT to do**: Do NOT try to guess the correct parameter format by trial-and-error more than 3 times. If you've failed 3 times with the same approach, step back and:
  1. Check existing documentation (`reference/gotchas/`, `reference/`)
  2. Ask for help or admit uncertainty
  3. Consider alternative approaches

- **Concrete example from 2026-08-23**: I tried to post a Slack reply using `MessageChannel` with `action: "send"` but kept passing only `emoji` without the required `message` parameter. The tool returned "Slack send requires message or media" every time. I self-diagnosed the issue repeatedly ("I need to include the message parameter") but kept making the exact same call 100+ times over ~30 minutes. The fix was trivial: include the actual `message` text in the tool call. If I had stopped after 3 failures and re-read the tool schema, I would have avoided the loop.

- **Severity**: These loops can consume 100+ turns and waste significant tokens. They represent a critical failure in the agent's self-correction mechanism.

- **Concrete example from 2026-08-25**: I tried to proactively post messages to DUG Slack channels using `MessageChannel` with `action: "send"`. I kept including `replyTo` and `threadId` parameters (thinking I was still in a reply context) instead of using the `target` parameter. The tool requires exactly one of `chat_id` or `target`. I self-diagnosed the issue repeatedly ("I need to include the `target` parameter") but kept making the exact same call with `replyTo`/`threadId` instead 10+ times. The loop broke when the first attempt accidentally succeeded, then repeated for subsequent messages — I'd get `target` right once, then re-introduce `replyTo`/`threadId` on the next call. **Key insight**: When switching from a DM/inline-reply context to proactive channel posting, the agent defaults to reply-context parameters (`replyTo`, `threadId`) instead of proactive send parameters (`target`). Always check: is this a reply or a proactive send? Reply → use `chat_id` (or `replyTo`/`threadId` in thread). Proactive send → use `target`.
