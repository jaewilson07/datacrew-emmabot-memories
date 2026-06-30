---
description: Advanced agent orchestration patterns: async multi-agent, orchestrator-workers, evaluator-optimizer. From claude-cookbooks patterns/agents/.
---
# Advanced Agent Orchestration Patterns

Source: `patterns/agents/` in claude-cookbooks

## 1. Async Multi-Agent Orchestration

Two patterns from the Claude Opus 4.8 system card: **fixed N-agent team** and **async subagents**.

### Message Hub Pattern

Every agent gets an inbox list and an `asyncio.Event` for blocking waits.

```python
class Hub:
    def __init__(self):
        self.inbox: dict[str, list[dict]] = defaultdict(list)
        self.event: dict[str, asyncio.Event] = defaultdict(asyncio.Event)
        self.status: dict[str, str] = {}

    def post(self, sender: str, recipients: list[str], content: str) -> list[str]:
        delivered = []
        for rid in recipients:
            if rid in self.status:
                self.inbox[rid].append({"from": sender, "content": content})
                self.event[rid].set()
                delivered.append(rid)
        return delivered

    def drain(self, name: str) -> list[dict]:
        msgs, self.inbox[name] = self.inbox[name], []
        self.event[name] = asyncio.Event()
        return msgs
```

### Messaging Tools

Every agent gets `send_message` and `check_messages` tools:
- `send_message`: Send to one or more agents (appears in their next tool result)
- `check_messages`: Block until messages arrive, then drain inbox

### Fixed N-Agent Team
- Pre-defined set of agents with fixed roles
- Agents communicate via message hub
- Good for: known team structure, predictable interactions

### Async Subagents
- Lead agent dynamically spawns subagents
- Subagents run concurrently
- Good for: research tasks, parallel exploration

## 2. Orchestrator-Workers

Central LLM analyzes task, dynamically determines subtasks, delegates to specialized workers.

### Two-Phase Workflow

1. **Analysis & Planning Phase**: Orchestrator receives task, analyzes approaches, generates structured subtask descriptions in XML
2. **Execution Phase**: Each worker receives original task + specific subtask type + context

```python
class FlexibleOrchestrator:
    def process(self, task: str, context: str = "") -> dict:
        # Phase 1: Orchestrator analyzes and plans
        orchestration = llm_call(f"Analyze task and create subtasks...\nTask: {task}")
        subtasks = parse_tasks(extract_xml(orchestration, "tasks"))

        # Phase 2: Workers execute in parallel
        with ThreadPoolExecutor(max_workers=len(subtasks)) as executor:
            futures = {executor.submit(llm_call, f"...{st}..."): st for st in subtasks}
            results = {futures[f]: f.result() for f in as_completed(futures)}

        return {"orchestration": orchestration, "worker_results": results}
```

**Use when:**
- Tasks require multiple distinct approaches or perspectives
- Optimal subtasks depend on the specific input (not pre-defined)
- Need to compare different strategies or styles

**Don't use when:**
- Simple, single-output tasks (unnecessary complexity)
- Latency is critical (multiple LLM calls add overhead)
- Subtasks are predictable (use simpler parallelization)

## 3. Evaluator-Optimizer

One LLM generates a response while another provides evaluation and feedback in a loop.

```python
def loop(task: str, evaluator_prompt: str, generator_prompt: str) -> tuple[str, list[dict]]:
    """Keep generating and evaluating until requirements are met."""
    memory = []
    thoughts, result = generate(generator_prompt, task)
    memory.append(result)

    while True:
        evaluation, feedback = evaluate(evaluator_prompt, result, task)
        if evaluation == "PASS":
            return result, chain_of_thought

        context = "\n".join(["Previous attempts:", *[f"- {m}" for m in memory],
                             f"\nFeedback: {feedback}"])
        thoughts, result = generate(generator_prompt, task, context)
        memory.append(result)
```

**Use when:**
- Clear evaluation criteria exist
- LLM responses can be demonstrably improved with feedback
- The LLM can provide meaningful feedback itself
- Value from iterative refinement

**Key design:** Generator and evaluator use XML tags (`<thoughts>`, `<response>`, `<evaluation>`, `<feedback>`) for structured parsing. Evaluator outputs "PASS", "NEEDS_IMPROVEMENT", or "FAIL".
