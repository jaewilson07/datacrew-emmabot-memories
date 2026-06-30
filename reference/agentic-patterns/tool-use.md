---
description: Tool use patterns: parallel tools, customer service agent, tool choice, batch tool, structured JSON, PTC. From claude-cookbooks tool_use/ directory.
---
# Tool Use Patterns

Source: `tool_use/` directory in claude-cookbooks (12 notebooks)

## Tool Choice Options

Three `tool_choice` parameter values:

| Value | Behavior | Use Case |
|---|---|---|
| `auto` | Claude decides whether to use tools | Default — let Claude decide |
| `any` | Must use one of the provided tools | Force tool use, but let Claude pick which |
| `tool` | Force a specific tool | Must call a specific tool |

```python
response = client.messages.create(
    model=MODEL,
    tools=tools,
    tool_choice={"type": "auto"},  # or "any" or {"type": "tool", "name": "specific_tool"}
    messages=[{"role": "user", "content": user_query}]
)
```

## Parallel Tool Calls

Claude may not always make parallel tool calls even when `disable_parallel_tool_use` is not set. **Workaround: introduce a "batch tool"** that wraps multiple tool invocations.

```python
batch_tool = {
    "name": "batch_tool",
    "description": "Call multiple tools simultaneously. Pass an array of tool invocations.",
    "input_schema": {
        "type": "object",
        "properties": {
            "invocations": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "tool_name": {"type": "string"},
                        "tool_input": {"type": "object"}
                    }
                }
            }
        }
    }
}
```

When the batch tool is present, the model will use it to call multiple tools simultaneously.

## Customer Service Agent Pattern

Define client-side tools with clear schemas:

```python
tools = [
    {
        "name": "get_customer_info",
        "description": "Retrieves customer information based on their customer ID.",
        "input_schema": {
            "type": "object",
            "properties": {
                "customer_id": {"type": "string", "description": "The unique identifier for the customer."}
            },
            "required": ["customer_id"],
        }
    },
    {
        "name": "get_order_details",
        "description": "Retrieves order details based on order ID.",
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {"type": "string"}
            },
            "required": ["order_id"],
        }
    },
    {
        "name": "cancel_order",
        "description": "Cancels an order based on the provided order ID.",
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {"type": "string"}
            },
            "required": ["order_id"],
        }
    }
]
```

**Key pattern:** Process tool calls in a loop — Claude calls tools, you execute and return results, Claude continues.

## Tool Use Notebooks in the Repo

| Notebook | Pattern |
|---|---|
| `calculator_tool.md` | Basic calculator tool integration |
| `customer_service_agent.md` | Multi-tool customer service with tool loop |
| `parallel_tools.md` | Batch tool for parallel tool calls |
| `extracting_structured_json.md` | Structured JSON output from tool use |
| `tool_choice.md` | Tool choice parameter options (auto/any/tool) |
| `programmatic_tool_calling_ptc.md` | Programmatic tool calling (PTC) |
| `vision_with_tools.md` | Vision + tool use combined |
| `tool_search_with_embeddings.md` | Tool search using embeddings |
| `tool_search_alternate_approaches.md` | Alternate approaches to tool search |
| `automatic-context-compaction.md` | Automatic context compaction |
| `context_engineering/context_engineering_tools.md` | Context engineering with tools |
| `memory_cookbook.md` | Memory patterns with tools |
| `threat_intel_enrichment_agent.md` | Threat intelligence enrichment agent |
| `tool_use_with_pydantic.md` | Tool use with Pydantic validation |

## Key Design Patterns

- **Tool descriptions matter:** Clear, specific descriptions help Claude choose the right tool
- **Input schemas:** Use JSON Schema for tool input validation
- **Tool loop:** Claude calls → you execute → return results → Claude continues
- **Batch tool:** Wrap multiple tool calls for parallelism when model doesn't do it natively
- **System prompt for tool use:** Guide when to use tools vs existing knowledge
