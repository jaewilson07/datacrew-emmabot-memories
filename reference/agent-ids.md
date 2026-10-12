---
description: Letta agent IDs for the DataCrew bot fleet (datacrew-cloud, sleeptime companions, IdrisBot) and how to message them.
---
# Agent IDs (DataCrew fleet)

Verified 2026-10-12 via `~/.letta/channels/slack/accounts.json` account→agent mapping.

- **DataCrew ops agent** (the `datacrew` Slack account, jaelearnsbots workspace): `agent-55e609e7-2a76-4400-a510-fa8b96c47aa3` (name `datacrew-cloud`). To reach DataCrew: SendAgentMessage to this agent_id.
- **DataCrew's sleeptime companion:** `datacrew-cloud-sleeptime` (`agent-c9f5958e-7fe2-4670-9590-864a2c89b00e`)
- **EmmaBot's own sleeptime companion:** `datacrew-public-sleeptime` (`agent-247c270c-c905-4a6c-8727-ca9325df72df`)
- **IdrisBot:** `agent-0604eb6c-85b1-46f9-9c13-fb147d85bf2a` (name `IdrisBot-DataCrew`)

**Gotcha:** the `delegate_to_agent` MCP tool refused `agent_name="DataCrew"` with "Cannot delegate to yourself (DataCrew)" — its identity mapping is wrong for EmmaBot. Workaround: use SendAgentMessage with the agent_id directly.
