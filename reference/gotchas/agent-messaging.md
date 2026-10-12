---
description: Agent-to-agent messaging gotchas — CLI delegation is unreliable, parallel execution is common.
---
# Agent Messaging Gotchas

## `letta -p` CLI Is Unreliable

- `letta -p --from-agent $LETTA_AGENT_ID --agent <target-id> "message"` has a 300s timeout and **times out silently** — it may or may not deliver the message
- First call succeeded (189s) but second call timed out on the same target
- "Cannot delegate to yourself" error if the agent name resolves to your own agent
- **Do not assume success** — always verify via message list after using `letta -p`
- **Preferred approach:** Use `SendAgentMessage` tool (Letta Cloud backend) — more reliable, async delivery confirmed

## Mid-Turn SendAgentMessage Collision

- **Sending `SendAgentMessage` to a forked agent WHILE its turn is already running will crash the fork** — the backend throws `"Another request is already processing for this conversation"` and the fork task terminates (e.g., task_38 died after 29 tool uses / 5 minutes).
- **Root cause**: The forked agent has an active turn; sending a new message queues it as a follow-up, but the delivery collision interrupts the running turn instead of queueing properly.
- **Rule**: When delegating to forked agents, bake ALL context and clarifications into the initial prompt. Do NOT send mid-turn follow-up messages to the fork.
- **Safe pattern**: Use the default conversation (not a task-specific conversation), and provide the complete brief upfront. The delegating agent should not message the fork after dispatch.

## Parallel Agent Execution

- When consulting other agents, they may execute the task before you (especially if they have bonker access)
- They may choose a **different approach** than yours (e.g., symlink facade vs archive+symlink)
- **Always verify current state** before assuming you need to execute
- Check if the task is already done (git log, filesystem state, PR status)
- If already done (even differently), verify and report — don't re-execute
