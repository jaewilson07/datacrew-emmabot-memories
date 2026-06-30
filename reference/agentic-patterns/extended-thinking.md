---
description: Extended thinking patterns: basic thinking, thinking with tool use, thinking budget, redacted thinking, preserving thinking blocks. From claude-cookbooks extended_thinking/ directory.
---
# Extended Thinking Patterns

Source: `extended_thinking/` directory in claude-cookbooks (2 notebooks)

## Overview

Extended thinking gives Claude enhanced reasoning capabilities for complex tasks, with transparency into its step-by-step thought process before the final answer. Claude creates `thinking` content blocks where it outputs internal reasoning.

## Basic Extended Thinking

```python
response = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=4000,
    thinking={
        "type": "enabled",
        "budget_tokens": 2000  # Thinking budget
    },
    messages=[{"role": "user", "content": "Solve this complex problem..."}]
)
```

### Response Structure
Response contains multiple content block types:
- `thinking` — Internal reasoning block (has `thinking` text and `signature`)
- `redacted_thinking` — Redacted thinking (has `data`, not readable)
- `text` — Final answer

```python
for block in response.content:
    if block.type == "thinking":
        print(f"Thinking: {block.thinking}")
        print(f"Signature: {block.signature}")
    elif block.type == "redacted_thinking":
        print(f"Redacted (data length: {len(block.data)})")
    elif block.type == "text":
        print(f"Answer: {block.text}")
```

## Extended Thinking with Tool Use

Key behavior: Model thinks before making tool requests, but does NOT repeat thinking after receiving tool results. Claude will not output another thinking block until after the next non-`tool_result` user turn.

```python
MODEL_NAME = "claude-sonnet-5"
MAX_TOKENS = 4000
THINKING_BUDGET_TOKENS = 2000

response = client.messages.create(
    model=MODEL_NAME,
    max_tokens=MAX_TOKENS,
    thinking={
        "type": "enabled",
        "budget_tokens": THINKING_BUDGET_TOKENS
    },
    tools=tools,
    messages=messages
)
```

### Preserving Thinking Blocks

For multi-turn conversations with extended thinking:
- Thinking blocks must be preserved across turns
- Include thinking blocks in the message history
- Don't strip thinking blocks from responses

## Key Parameters

| Parameter | Description |
|---|---|
| `thinking.type` | `"enabled"` to turn on extended thinking |
| `thinking.budget_tokens` | Token budget for thinking (e.g., 2000) |
| `max_tokens` | Must be >= thinking budget + response tokens |

## Token Counting

```python
result = client.messages.count_tokens(
    model="claude-sonnet-5",
    messages=messages,
    tools=tools  # optional
)
print(f"Input tokens: {result.input_tokens}")
```

## Error Handling

- Check for `redacted_thinking` blocks — some thinking may be redacted
- Handle cases where thinking blocks are missing
- Validate signatures for thinking blocks in multi-turn conversations

## Use Cases

- Complex reasoning tasks (math, logic, coding)
- Tasks requiring step-by-step decomposition
- When transparency into reasoning process is needed
- Tool use decisions that benefit from explicit reasoning
