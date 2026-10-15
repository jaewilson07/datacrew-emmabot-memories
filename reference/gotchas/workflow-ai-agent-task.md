---
description: Domo Workflow AI Agent Task — shipped AI Pro feature, runtime configuration, and execution caveats. Use when members ask about embedding AI/agents in workflows or triggering AI from App Studio.
---
# Workflow AI Agent Task Gotchas

- **AI Agent Tasks within Workflows** is a shipped AI Pro feature (Jan 2026 release notes). **No beta or CSM enablement needed.** Distinct from Conversational Agents (beta/AI Library).
- **Configuration**: runtime-variable prompts/instructions, tool attachments (Code Engine packages or other workflows), Knowledge base attachments. The AI Agent Task is an activity type within Workflows.
- **App Studio integration**: The App Studio Workflow element can trigger workflows directly from dashboards/apps — the in-app trigger for agent workflows is native.
- **Execution model caveats**:
  - **One turn per execution** — each workflow run fires a single AI Agent Task invocation, not a multi-turn conversation. No conversational loop.
  - **Form-submit UX** — workflows trigger on form submission or scheduled events, not continuous chat interaction.
  - **Consumption pricing** — charged under the AI Pro tier's consumption model (per Jan 2026 release notes).
  - **1-hour step limit** — individual workflow steps timeout after 1 hour.
- **When to recommend**: suitable for one-shot AI actions (summarize, classify, generate content, call tools) triggered by workflow events. NOT suitable for conversational chat — use AI Chat or Conversational Agents for that.
- **When NOT to recommend**: members wanting a persistent chat session or multi-turn dialogue with the AI. The AI Agent Task does not maintain conversation state between invocations.
- **Key docs**: AI Agent Tasks within Workflows, Build an AI Agent Task in Workflows
- **Distinction from Conversational Agents**: Conversational Agents (AI Library, beta, CSM) = persistent conversational UI with toolkits; AI Agent Task (Workflows, shipped, AI Pro) = single-invocation AI activity within workflow automation. Different tools for different jobs.
