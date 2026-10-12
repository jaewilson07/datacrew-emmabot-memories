---
description: crew-dcs repo facts and Jae's agent-delegation issue workflow (labels, house style) — where "file a ticket on crew-dcs" goes.
---
# crew-dcs Repo & Agent-Delegation Workflow

## Repo

- **GitHub:** `hector-dcs/crew-dcs` — org/user is `hector-dcs`, NOT `jaewilson07`. Private repo.
- **Local checkout:** `/home/jaewilson07/GitHub/crew-dcs`
- **Stack:** Python, src layout, `uv`, mkdocs. Repo self-described as "domolibrary2".
- SDK/API details → [[reference/domo-python-sdks.md]]; Code Engine gotchas → [[reference/gotchas/crew-dcs-code-engine.md]]

## Agent-Delegation Issue Workflow

Jae's recurring pattern: "file a GitHub issue so I can delegate a Claude/another agent to build it." When Jae says "create a ticket on crew-dcs" or "file a ticket for another agent," use this repo and these conventions:

- **Labels:** `ready-for-agent` (PRD ready for agent implementation), `agent-reported` (filed by an agentic developer), `agent-in-progress` (a routine claimed it), `ready-for-human` (needs human decision first)
- **House style:** `## What to build`, `## Acceptance criteria` (checkboxes), `## Blocked by` sections

## Filed 2026-10-12

- crew-dcs issue #1771 — IaC change pattern (build out domo-iac-changes skill), labeled `ready-for-agent` + `agent-reported`
- letta-datacrew-memories PR #37 — domo-iac-changes skill stub + scheduled-report-private-dataset gotcha
