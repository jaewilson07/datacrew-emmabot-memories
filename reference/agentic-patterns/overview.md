---
description: Overview of all agentic patterns from the claude-cookbooks repository. Reference for cutting-edge Claude API patterns.
---
# Agentic Patterns from Claude Cookbooks

Source: `claude-cookbooks` repo at `/home/jaewilson07/GitHub/knowledge-base/claude-cookbooks/`
GitHub: https://github.com/anthropics/claude-cookbooks

## Pattern Categories

### Basic Multi-LLM Workflows
- [[reference/agentic-patterns/basic-workflows]] — Prompt chaining, parallelization, routing
- Source: `patterns/agents/basic_workflows.md`

### Advanced Agent Orchestration
- [[reference/agentic-patterns/agent-orchestration]] — Async multi-agent, orchestrator-workers, evaluator-optimizer
- Source: `patterns/agents/async_multi_agent_orchestration.md`, `patterns/agents/orchestrator_workers.md`, `patterns/agents/evaluator_optimizer.md`

### Research Agent Patterns
- [[reference/agentic-patterns/research-patterns]] — Research lead, subagent, citations agent prompts
- Source: `patterns/agents/prompts/research_lead_agent.md`, `research_subagent.md`, `citations_agent.md`

### Tool Use Patterns
- [[reference/agentic-patterns/tool-use]] — Calculator, customer service, parallel tools, structured JSON, tool choice, PTC
- Source: `tool_use/` directory

### Claude Agent SDK
- [[reference/agentic-patterns/claude-agent-sdk]] — Research agent, chief of staff, observability, SRE, hosting
- Source: `claude_agent_sdk/` directory

### Extended Thinking
- [[reference/agentic-patterns/extended-thinking]] — Extended thinking with and without tool use
- Source: `extended_thinking/` directory

### Capabilities (RAG, Classification, Summarization, etc.)
- [[reference/agentic-patterns/capabilities]] — RAG, classification, summarization, text-to-SQL, knowledge graph
- Source: `capabilities/` directory

## Key Models Referenced
- Sonnet: `claude-sonnet-5` (alias, not dated)
- Haiku: `claude-haiku-4-5` (alias, not dated)
- Opus: `claude-opus-4-8` (alias, not dated)
- Never use dated model IDs in API calls; use non-dated aliases

## Repo Structure
```
capabilities/          # RAG, classification, summarization, text-to-SQL, knowledge graph
claude_agent_sdk/     # Agent SDK tutorials (8 notebooks)
coding/               # Frontend aesthetics
evals/                # Agentic search benchmarks
extended_thinking/    # Extended thinking patterns
managed_agents/       # CMA (Claude Managed Agents) examples
misc/                 # Batch processing, caching, JSON mode, PDF, evals, moderation
multimodal/           # Vision, charts, forms, sub-agents
patterns/agents/      # Core orchestration patterns + prompts
skills/               # Skills introduction, financial applications, custom development
tool_use/             # Tool use patterns (12 notebooks)
third_party/          # Pinecone, LlamaIndex, MongoDB, Wikipedia, WolframAlpha
```

## Conversion Status
All 88 notebooks converted to markdown on 2026-06-30. See `CONVERSION_SUMMARY.md` in the repo.
