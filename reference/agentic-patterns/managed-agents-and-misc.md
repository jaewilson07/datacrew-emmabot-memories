---
description: Managed agents (CMA) and miscellaneous patterns: prompt caching, JSON mode, batch processing, context compaction, citations. From claude-cookbooks managed_agents/ and misc/ directories.
---
# Managed Agents & Miscellaneous Patterns

Source: `managed_agents/` and `misc/` directories in claude-cookbooks

## Claude Managed Agents (CMA)

Source: `managed_agents/` directory (11 notebooks)

### Key CMA Notebooks

| Notebook | Pattern |
|---|---|
| `CMA_orchestrate_issue_to_pr.md` | End-to-end issue → bug fix → PR → CI → review → merge |
| `CMA_iterate_fix_failing_tests.md` | Iterate on fixing failing tests |
| `CMA_coordinate_specialist_team.md` | Coordinate a team of specialist agents |
| `CMA_explore_unfamiliar_codebase.md` | Explore an unfamiliar codebase |
| `CMA_gate_human_in_the_loop.md` | Human-in-the-loop gating |
| `CMA_operate_in_production.md` | Operate in production environments |
| `CMA_prompt_versioning_and_rollback.md` | Prompt versioning and rollback |
| `CMA_remember_user_preferences.md` | Remember user preferences |
| `CMA_verify_with_outcome_grader.md` | Verify with outcome grader |
| `data_analyst_agent.md` | Data analyst agent |
| `slack_data_bot.md` | Slack data bot |
| `sre_incident_responder.md` | SRE incident responder |

### Issue-to-PR Orchestration Pattern

End-to-end maintainer workflow: read issue → find bug → fix → open PR → survive CI → address review → merge.

**Key concepts:**
- **Multi-turn steering across a long chain**: Session filesystem and conversation history persist across turns
- **Mid-chain recovery**: Agent reads CI failure or review comment and adapts (not just retry blindly)
- **State flows through chain**: issue body → file paths → fix diff → PR number → CI output → review comment → merge

```python
agent = client.beta.agents.create(
    name="cookbook-orchestrate",
    model=MODEL,
    system=(
        "You are a maintainer bot. You read issues, explore "
        "the codebase, write fixes, and shepherd PRs through CI and review. "
        "When CI fails or a reviewer requests changes, read what they said "
        "and address it, don't just retry blindly."
    ),
    tools=[
        {
            "type": "agent_toolset_20260401",
            "default_config": {
                "enabled": True,
                "permission_policy": {"type": "always_allow"},
            },
        }
    ],
)
```

### Key CMA Patterns
- **Agent toolset**: `agent_toolset_20260401` type for managed agent tools
- **Permission policy**: `always_allow` for autonomous operation
- **Session persistence**: State persists across turns via session filesystem
- **Environment configuration**: Network access, package managers, file mounts
- **Specialist teams**: Coordinate multiple agents with different specialties
- **Human-in-the-loop**: Gate operations requiring human approval
- **Outcome grading**: Verify agent results with automated grading

## Prompt Caching

Source: `misc/prompt_caching.md`

### Two Approaches

1. **Automatic caching** (recommended): Add `cache_control` at top level of request. System manages cache breakpoints automatically.

2. **Explicit cache breakpoints**: Place `cache_control` on individual content blocks for fine-grained control.

### Benefits
- **Latency reduction**: >2x faster
- **Cost reduction**: Up to 90% for repetitive tasks

### Automatic Caching

```python
response = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are a helpful assistant.",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[{"role": "user", "content": user_query}]
)
```

### Explicit Cache Breakpoints

```python
messages = [
    {"role": "user", "content": [
        {"type": "text", "text": large_context, "cache_control": {"type": "ephemeral"}},
        {"type": "text", "text": user_query}
    ]}
]
```

### Use Cases
- Large context documents (books, codebases, documentation)
- Repetitive system prompts
- Few-shot examples that don't change between calls
- Long conversation histories

## Other Misc Patterns

### JSON Mode (`misc/how_to_enable_json_mode.md`)
- Force Claude to output valid JSON
- Use system prompt + response format constraints

### Batch Processing (`misc/batch_processing.md`)
- Process multiple requests in batch
- Cost savings for non-urgent workloads

### Context Compaction (`misc/session_memory_compaction.md`)
- Manage long conversation contexts
- Automatic context compaction patterns

### Citations (`misc/using_citations.md`)
- Built-in citation support
- Source attribution for generated content

### Moderation Filter (`misc/building_moderation_filter.md`)
- Content moderation with Claude
- Classification of harmful content

### PDF Upload (`misc/pdf_upload_summarization.md`)
- Upload and summarize PDF documents
- Multimodal document processing

### Speculative Prompt Caching (`misc/speculative_prompt_caching.md`)
- Advanced caching strategies
- Predictive cache warming

### Metaprompt (`misc/metaprompt.md`)
- Use Claude to generate prompts
- Meta-level prompt engineering
