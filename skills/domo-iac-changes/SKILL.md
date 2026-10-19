---
name: domo-iac-changes
description: This skill should be used when the user needs to plan, execute, or audit Infrastructure-as-Code changes (Domo dataset definitions, cards, dashboard configs, access policies, etc.) — particularly changes to existing infrastructure rather than greenfield builds. Use when: (1) modifying Domo templates or dataset configs, (2) planning infrastructure updates where drift between desired and current state is a concern, (3) creating automation scripts that change Domo resources, (4) performing change management for any Domo resource that has state. NOT for: creating new projects from scratch, one-off manual changes, or troubleshooting access issues.
version: 0.1.0
---

# Domo IaC Changes

Managing changes to Domo infrastructure (datasets, cards, dashboards, PDPs, templates) follows a strict four-phase pattern. This is what Jae calls "nightmares" when skipped — the gap between *what you want* and *what you get* in Domo's stateful API is where things go wrong.

## The Four Phases

### 1. Current + Desired Config
Document the **current state** (what exists now) and **desired state** (what should exist after). Don't skip the current state — Domo drifts, and assumptions about what's already configured are the #1 source of errors.

- Capture current config: `GET` existing resources, export configs, snapshot state
- Define desired config: the target state, version-controlled if possible
- Diff them: what's changing, what's staying the same, what's being deprecated

### 2. Dry-Run Artifact
Generate an artifact that demonstrates what the change **will do** without actually applying it.

- For datasets: a test dataflow with sample data, output schema validation
- For cards/dashboards: a mock card, preview render with test data
- For PDPs: a test user context that exercises the new policy
- For templates: a dry-run deployment to a test workspace

The dry-run should produce a tangible artifact someone can review (output file, screenshot, test run).

### 3. Manual Validation Gate
**Never automate directly from dry-run → production.** A human must validate the dry-run artifact before changes go live.

- Share dry-run artifacts with stakeholders
- Verify output correctness, not just structural validity
- Get explicit approval (or document the reason for skipping)
- This is the gate where "I didn't realize it would do X" gets caught

### 4. Undo by Reversed Config
Plan the rollback **before** making the change. The undo path should be:

- Reverse the config change (desired → current = rollback config)
- A dry-run artifact for the rollback (optional but recommended)
- A rollback script or procedure (automated if possible)
- A manual validation gate for the rollback (same as step 3)

## Graduation TODO List

This skill starts as a manual checklist. Graduate to higher automation as confidence grows:

- [ ] Phase 1 (current + desired): Automated diff generation (compare GET results → structured diff)
- [ ] Phase 2 (dry-run): Self-generating dry-run artifacts (scripted → validated output)
- [ ] Phase 3 (manual gate): Structured approval workflow (ticket, checklist, sign-off)
- [ ] Phase 4 (undo): Automated rollback (reversed-config apply + validation)

Each graduation point should be validated before proceeding to the next.

## Why This Matters

Domo's stateful resources don't support `PUT`-style idempotent updates in most cases. Changes are often:
- Additive (new cards can't be "updated" — they need to be replaced)
- Contextual (card sharing, PDPs, dataset access — multiple layers)
- Irreversible without careful attention (dataflows, template references)

The four-phase pattern forces the gap between "I know what I want" and "I know what Domo will do" to be explicitly examined before action.
