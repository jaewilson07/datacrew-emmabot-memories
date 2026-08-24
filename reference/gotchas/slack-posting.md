---
description: Slack posting rules — message formatting, ordering, and token usage.
---
# Slack Posting Gotchas

- **One post per item** — NEVER combine multiple items into one message
- **Blank line between text and URLs** — separate description from links
- **Post first, then delete old** — NEVER delete before replacement is live
- **Use `SLACK_BOT_TOKEN`** for DUG Slack API calls
- **Do NOT `source datacrew/.env`** — JSON values break `source`. Use `grep VAR file | cut -d= -f2-` or Python `os.environ`
- **MessageChannel `action: "send"` REQUIRES `message` parameter** — if you omit `message`, the tool returns "Slack send requires message or media" and nothing posts. Do NOT retry without adding the message text. This caused a massive loop (50+ failed calls) where I kept passing `emoji` but no `message`. If you want to react-only, use `action: "react"` with `emoji` + `messageId` — but if you use `action: "send"`, you MUST include `message`. When in doubt, write the message text FIRST, then construct the tool call around it.
- **MessageChannel `chat_id` can fail with "No route" on non-notification turns** — when the turn is not a channel-notification, `chat_id` may fail with "No route for chat_id X on slack account Y for this agent/conversation." In this case, use `target: "channel:C0BSBE0F21F"` for top-level channel posts. If `target` also fails or you get stuck in a loop, FALL BACK to the Slack API via curl: `curl -s -X POST "https://slack.com/api/chat.postMessage" -H "Authorization: Bearer $PUBLIC_DATACREW_SLACK_BOT_TOKEN" -H "Content-Type: application/json" -d '{"channel":"C0BSBE0F21F","text":"message"}'`. For thread replies, add `"thread_ts":"<ts>"` to the JSON body. Do NOT retry the same failing MessageChannel call more than 3 times — switch to curl immediately.
