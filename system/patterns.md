---
description: Compact index of diagnostic patterns — recurring question shapes and how to work them.
---
# Patterns Index

Recurring question *shapes* and how to work them. Facts in [[system/gotchas.md]]; methods in [[reference/patterns/]].

- **AI feature enabled but not visible**: check nav layout first; post-grants = CSM provisioning, not settings → [[reference/patterns/ai-feature-not-visible.md]]
- **"Where's the setting for X?"**: establish data direction first — inbound ≠ outbound (PGP over SFTP is import-only) → [[reference/patterns/capability-exists-inbound-only.md]]
- **Permissions**: name the object the permission attaches to before matching the verb; container ≠ contents → [[reference/patterns/permission-verb-scope-mismatch.md]]
- **"It's automatic"**: automatic ≠ on by default — find the trigger and check its default state → [[reference/patterns/automatic-behavior-disabled-trigger.md]]
- **"How do I do X?" where the right tool depends on the goal**: ask the goal first — exploration filtering ≠ locking down data (PDP); mechanics without the goal can hand someone a filter hack for a security problem → [[reference/patterns/clarify-goal-before-answering.md]]
- **"Bot isn't responding"**: usually mid-turn on a build task, not dead — check `last_run_completion` API probe first; accounts on first-party `slack` channel have no thinking indicator, so multi-minute turns = radio silence → [[reference/patterns/bot-not-responding-mid-turn.md]]

Write one when I answer the same shape a third time, or get corrected in channel.
