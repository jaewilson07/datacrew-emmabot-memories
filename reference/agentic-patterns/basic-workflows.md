---
description: Basic multi-LLM workflow patterns: prompt chaining, parallelization, and routing. From claude-cookbooks patterns/agents/basic_workflows.md.
---
# Basic Multi-LLM Workflows

Source: `patterns/agents/basic_workflows.md` in claude-cookbooks

Three fundamental multi-LLM workflows that trade cost or latency for improved task performance.

## 1. Prompt Chaining

Decomposes a task into sequential subtasks, where each step builds on previous results.

```python
def chain(input: str, prompts: list[str]) -> str:
    """Chain multiple LLM calls sequentially, passing results between steps."""
    result = input
    for i, prompt in enumerate(prompts, 1):
        result = llm_call(f"{prompt}\nInput: {result}")
    return result
```

**When to use:** Tasks that naturally decompose into sequential steps where each step transforms the previous output.

**Example:** Data extraction → Format conversion → Sorting (progressive transformation of raw text into formatted table).

## 2. Parallelization

Distributes independent subtasks across multiple LLMs for concurrent processing.

```python
def parallel(prompt: str, inputs: list[str], n_workers: int = 3) -> list[str]:
    """Process multiple inputs concurrently with the same prompt."""
    with ThreadPoolExecutor(max_workers=n_workers) as executor:
        futures = [executor.submit(llm_call, f"{prompt}\nInput: {x}") for x in inputs]
        return [f.result() for f in futures]
```

**When to use:** Same task applied to multiple independent inputs; speed matters more than cost.

**Example:** Stakeholder impact analysis — analyze impact on multiple stakeholders simultaneously.

## 3. Routing

Dynamically selects specialized LLM paths based on input characteristics.

```python
def route(input: str, routes: dict[str, str]) -> str:
    """Route input to specialized prompt using content classification."""
    # LLM classifies input, then routes to specialized handler
    selector_prompt = f"Analyze the input and select the most appropriate team..."
    route_response = llm_call(selector_prompt)
    route_key = extract_xml(route_response, "selection").strip().lower()
    selected_prompt = routes[route_key]
    return llm_call(f"{selected_prompt}\nInput: {input}")
```

**When to use:** Different input types need different processing; classification adds value.

**Example:** Customer support ticket routing — classify ticket, route to appropriate team.

## Key Design Patterns

- **XML for structured output:** Use `<reasoning>` and `<selection>` XML tags for reliable parsing
- **LLM as classifier:** First call classifies, second call processes with specialized prompt
- **ThreadPoolExecutor for parallelism:** Simple Python concurrency for parallel LLM calls
- **Chain-of-thought routing:** Ask LLM to explain reasoning before making routing decision
