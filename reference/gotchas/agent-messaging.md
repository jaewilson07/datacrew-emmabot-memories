---
description: Agent-to-agent messaging gotchas — CLI delegation is unreliable, agent identity resolution issues, parallel execution is common.
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

## Agent Identity Resolution

- **`delegate_to_agent` has identity mapping issues**: The tool may map an agent name (e.g., "DataCrew") to your own agent instead of the intended target ("Cannot delegate to yourself" error when trying to delegate to DataCrew from EmmaBot).
- **Root cause**: The Letta Cloud multi-agent router may resolve names differently than the system prompt identity.
- **Workaround**: Use `SendAgentMessage` tool directly with the target's `agent_id` instead of name-based delegation.
- **Discovering agent IDs**:
  1. Check `reference/agent-ids.md` for known fleet IDs
  2. Check `routing.yaml` for definitive account→agent mappings
  3. Check `~/.letta/channels/slack/` for account configs
  4. Use `list_agents` API + grep/filter for the right one
  5. Cross-reference with `platform.md` known agent IDs

## Parallel Agent Execution

- When consulting other agents, they may execute the task before you (especially if they have bonker access)
- They may choose a **different approach** than yours (e.g., symlink facade vs archive+symlink)
- **Always verify current state** before assuming you need to execute
- Check if the task is already done (git log, filesystem state, PR status)
- If already done (even differently), verify and report — don't re-execute

## `delegate_to_agent` Relay Gotchas (verified 2026-10-26)

- **Timeout ≠ failure:** `delegate_to_agent` relays through the datacrew-cloud agent and its synchronous wait
  ETIMEDOUTs (~2.5 min) — but delivery SUCCEEDS. Never assume failure on the timeout: verify with
  `letta messages search --query "<distinctive phrase>" --agent <target-agent-id>` (use a full ISO datetime for
  `--start-date`, e.g. `2026-10-26T00:00:00Z` — bare dates fail Zod validation). Never blind-retry a "failed"
  delegation — duplicate delivery causes duplicate work.
- **The relay MANGLES the message:** markdown backtick code spans are stripped/replaced (paths, commands, IDs
  vanish from the delivered text), and URLs inside backticks get FETCHED and inlined — wiki.datacrew.space URLs
  came back as Cloudflare challenge HTML because the fetch lacked a browser UA. When briefing another agent
  through `delegate_to_agent`, put critical specifics (paths, commands, IDs) in plain text rather than code
  spans, and verify what actually arrived.
- **Delegating to IdrisBot lands their turn in the Cloud sandbox (managed_sandbox)**, where Paperclip writes are
  impossible (API behind CF Access; `paperclip_*` are bonker-only mod tools). Division of labor that works:
  sandbox agent reviews/analyzes, a bonker-side agent executes writes/filing.
