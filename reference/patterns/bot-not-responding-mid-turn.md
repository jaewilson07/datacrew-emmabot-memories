---
description: Diagnostic pattern — DUG members report EmmaBot/DataCrew 'isn't responding'; usually mid-turn on a build task, not dead. Check the last_run_completion API probe first.
---

# Pattern — "Bot isn't responding in Slack" (usually mid-turn, not dead)

**Symptom**: Jae (or a member) reports a bot (DataCrew/IdrisBot) isn't responding in Slack.

**Mechanism**: Accounts on the *first-party* `slack` channel have NO streaming/thinking indicator — the bot is invisible during a turn and only posts at completion. A multi-minute build task = minutes of radio silence. Config comment in datacrew-public.yaml: "datacrew-public and datacrew stay on first-party `slack`" (streaming sidecar lives on custom channels only).

**Diagnostic (fast, 2 API calls)**:
1. `curl -H "Authorization: Bearer $LETTA_API_KEY" https://api.letta.com/v1/agents/<id>` → check `last_run_completion`. If it's minutes-ago or actively advancing, the bot is ALIVE and mid-turn.
2. `/messages?limit=30` → if you see recent `approval_request/tool_return` cycling with changing args, it's working. If args are IDENTICAL repeatedly → genuine tool-use loop ([[reference/gotchas/tool-use-loops.md]]).

**Rule**: "Not responding" for <15 min after a build-type request = almost always mid-turn. Check `last_run_completion` BEFORE restarting anything. Genuine stuck = no last_run_completion movement + identical repeated tool args.

Worked example 2026-10-09: Jae asked 26s after messaging DataCrew; agent was 5 min into a job-search CLI build. Nothing broken.
