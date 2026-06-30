---
description: Research agent patterns: research lead, subagent, and citations agent prompts. From claude-cookbooks patterns/agents/prompts/.
---
# Research Agent Patterns

Source: `patterns/agents/prompts/` in claude-cookbooks

Detailed prompts for multi-agent research orchestration. These are production-quality prompts from Anthropic's claude-cookbooks.

## Research Lead Agent

The lead agent does strategy, planning, delegation, and final report writing. Does NOT conduct primary research — coordinates and synthesizes.

### Query Type Classification

1. **Depth-first query**: Multiple perspectives on the same issue
   - Benefits from parallel agents exploring different viewpoints
   - Example: "What are the most effective treatments for depression?"
   - Plan: 3-5 different methodological approaches, synthesize findings

2. **Breadth-first query**: Distinct, independent sub-questions
   - Benefits from parallel agents each handling separate sub-topics
   - Example: "Compare the economic systems of three Nordic countries"
   - Plan: Enumerate sub-questions, prioritize, define clear boundaries

3. **Straightforward query**: Focused, well-defined
   - Single focused investigation or single resource fetch
   - Example: "What is the current population of Tokyo?"
   - Plan: Direct path, basic verification

### Subagent Count Guidelines

| Complexity | Subagents | Example |
|---|---|---|
| Simple/Straightforward | 1 | "What is the tax deadline?" |
| Standard | 2-3 | "Compare the top 3 cloud providers" |
| Medium | 3-5 | "Analyze the impact of AI on healthcare" |
| High | 5-10 (max 20) | "Fortune 500 CEOs birthplaces and ages" |

**Key rules:**
- Never more than 20 subagents
- Default to 3 subagents for most queries
- Prefer fewer, more capable subagents over many narrow ones
- More subagents = more overhead
- Always create at least 1 subagent

### Delegation Principles

- Deploy subagents immediately after finalizing research plan
- Each subagent gets 1 core objective
- Provide extremely detailed, specific instructions
- Include: research objectives, expected output format, background context, key questions, suggested sources, tool guidance, scope boundaries
- Lead synthesizes — does NOT write reports via subagents
- Stop research when diminishing returns hit

## Research Subagent

Individual research worker with OODA loop and research budget.

### OODA Loop
1. **Observe**: What info gathered, what still needed, what tools available
2. **Orient**: What tools/queries would be best, update beliefs
3. **Decide**: Make informed, well-reasoned tool selection
4. **Act**: Use the tool

### Research Budget
- Simple tasks: <5 tool calls
- Medium tasks: ~5 tool calls
- Hard tasks: ~10 tool calls
- Very difficult: up to 15 tool calls
- **Hard limit:** 20 tool calls, 100 sources

### Tool Selection Priority
1. **Internal tools** (Google Drive, Gmail, Calendar) — for personal/internal data
2. **web_search** — for web snippets
3. **web_fetch** — for full webpage content (always use to follow up on search results)
4. **REPL** — only for complex JavaScript calculations (no DOM, no API calls)

### Source Quality Assessment
- Flag speculation (future tense, "could", "may")
- Identify news aggregators vs original sources
- Watch for: false authority, passive voice, nameless sources, marketing language
- Maintain epistemic honesty — flag issues for lead to resolve

## Citations Agent

Specialized agent for adding correct citations to research reports.

### Key Rules
- Do NOT modify the synthesized text — only add citations
- Avoid citing unnecessarily — focus on key facts, conclusions, substantive claims
- Cite meaningful semantic units — complete thoughts, not individual words
- Minimize sentence fragmentation — avoid multiple citations in one sentence
- No redundant citations — don't cite same source multiple times in same sentence
- Output in `<exact_text_with_citation>` tags
- Text without citations compared to original — if not identical, result rejected

### Citation Guidelines
- Prioritize citing claims readers would want to verify
- Cite claims that add credibility to the argument
- Cite claims clearly related to a specific source
- Don't cite common knowledge
- Add citations at end of sentences, not mid-sentence
