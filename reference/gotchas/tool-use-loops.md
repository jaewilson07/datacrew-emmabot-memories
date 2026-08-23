---
description: Agent gets trapped in repetitive tool-call loops when unfamiliar with a tool or its parameters. Self-aware but unable to break the cycle.
---
# Tool-Use Failure Loops

- **Symptom**: Agent enters a repetitive cycle calling the same tool (or variant) with slight parameter changes, recognizing the failure but unable to resolve it. Typically manifests as 50–200+ consecutive turns of nearly identical reasoning.

- **Trigger**: Usually occurs when the agent encounters an unfamiliar tool, unclear tool parameters, or a parameter format it can't figure out. The agent tries variations but doesn't step back to re-evaluate the approach.

- **Key behavioral signs**:
  - Repeated phrases like "I keep making the same mistake," "I am stuck in a loop," "I need to include the `X` parameter"
  - The agent self-diagnoses the problem ("I'm not passing the message parameter") but still repeats it
  - Reasoning doesn't evolve — just restates the same insight and tries the same action again

- **What NOT to do**: Do NOT try to guess the correct parameter format by trial-and-error more than 3 times. If you've failed 3 times with the same approach, step back and:
  1. Check existing documentation (`reference/gotchas/`, `reference/`)
  2. Ask for help or admit uncertainty
  3. Consider alternative approaches

- **Severity**: These loops can consume 100+ turns and waste significant tokens. They represent a critical failure in the agent's self-correction mechanism.
