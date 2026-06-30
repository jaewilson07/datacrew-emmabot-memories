---
description: Claude Agent SDK patterns: research agent, chief of staff, observability, SRE, hosting, vulnerability detection. From claude-cookbooks claude_agent_sdk/ directory.
---
# Claude Agent SDK Patterns

Source: `claude_agent_sdk/` directory in claude-cookbooks (8 notebooks + standalone implementations)

## SDK Fundamentals

The Claude Agent SDK provides two main interfaces:

1. **`query()`** — Simple one-shot agent calls with async iteration
2. **`ClaudeSDKClient`** — Persistent client for multi-turn conversations with `ClaudeAgentOptions`

### Key Concepts
- Agent loops with `query()` and async iteration
- WebSearch tool for autonomous research
- Multimodal capabilities with the Read tool
- Conversation context management with `ClaudeSDKClient`
- System prompts for agent specialization

## Agent Implementations

### Notebook 00: One-Liner Research Agent
- Simplest agent — built in a few lines of code
- Core SDK concepts: `query()`, async iteration, WebSearch, Read tool
- System prompts for agent specialization

### Notebook 01: Chief of Staff Agent
- Multi-agent executive assistant for a startup CEO
- **Key features:**
  - Memory & Context: Persistent instructions with CLAUDE.md files
  - Output Styles: Tailored communication for different audiences
  - Plan Mode: Strategic planning without execution
  - Custom Slash Commands: User-friendly shortcuts
  - Hooks: Automated compliance tracking and audit trails
  - Subagent Orchestration: Coordinating specialized agents
  - Bash Tool Integration: Python script execution

### Notebook 02: Observability Agent
- DevOps monitoring with external system integration via MCP
- **Key features:**
  - Git MCP Server: 13+ tools for repository analysis
  - GitHub MCP Server: 100+ tools for GitHub platform integration
  - Real-time monitoring: CI/CD pipeline analysis and failure detection
  - Intelligent incident response: Automated root cause analysis

### Notebook 03: Site Reliability Agent
- SRE incident response with read-write remediation
- **Key features:**
  - MCP Tool Server: 12+ tools for metrics, infrastructure, diagnostics
  - Prometheus Integration: PromQL queries for error rates, latency
  - Read-Write Remediation: Edit config files, restart Docker services
  - Safety Hooks: PreToolUse hooks validate write operations
  - End-to-End Incident Lifecycle: Detection → Remediation → Post-mortem

### Notebook 04: Migrating from OpenAI Agents SDK
- Migration guide from OpenAI Agents SDK to Claude Agent SDK

### Notebook 05: Session Browser
- Building a session browser for agent conversations

### Notebook 06: Vulnerability Detection Agent
- Security vulnerability detection agent

### Notebook 07: Hosting the Agent
- Hosting options: Docker, Kubernetes, Modal
- Production deployment patterns

## Key Architecture Patterns

### MCP Integration
- Connect agents to external systems via Model Context Protocol
- Git MCP Server: 13+ tools
- GitHub MCP Server: 100+ tools
- Custom MCP Tool Servers: JSON-RPC subprocess for domain-specific tools

### Hooks for Compliance
- PreToolUse hooks: Validate operations before execution
- PostToolUse hooks: Audit trail after execution
- Safety validation: Config sanity checks, pool size ranges, etc.

### Subagent Orchestration
- Coordinate specialized agents for domain expertise
- Financial analyst, recruiter subagents (chief of staff example)
- Each subagent has its own system prompt and tools

### Output Styles
- Tailored communication for different audiences
- Executive style vs technical style
- Custom output styles defined in `.claude/output-styles/`

### CLAUDE.md for Memory
- Persistent instructions in CLAUDE.md files
- Agent reads CLAUDE.md for context and rules
- Similar to how Letta Code agents use memory blocks

## Production Deployment

### Hosting Options
- **Docker:** Container-based deployment
- **Kubernetes:** K8s manifests with gateway and egress proxy
- **Modal:** Serverless deployment

### Key Production Considerations
- API key management via environment variables
- Docker for isolated execution
- MCP servers for external tool integration
- Hooks for compliance and audit trails
