---
description: Diagnosing Jarvis voice (livekit-stream) latency — what holds the transcript, what holds the turn, and where the real seconds go.
---
# Voice Latency (Jarvis / livekit-stream)

When Jae reports the voice bot "holds my transcript before it reaches the agent" (asked 2026-10-26), the delay splits into two parts — and the bridge is the SMALLER one.

## Architecture (verified 2026-10-26)

Voice path: LiveKit server (bonker :7881) → `jarvis-voice-worker` container (LiveKit Agents pipeline: silero VAD → batch STT → AdapterLLM → TTS) → `livekit-stream` channel adapter on the Letta channel-gateway (host port 8791) → Letta agent turn → SSE deltas back → TTS.

Source: `~/GitHub/infra-bonker/apps/jarvis-voice-worker/` (agent.py, adapter_llm.py, livekit_llm.py).

## Hold #1 — the bridge (seconds, by design)

- **STT is batch REST, not streaming** (openai.STT non-streaming; VAD segments the audio). No transcript text exists until end-of-speech is detected.
- **Turn detection holds the turn open across mid-sentence pauses**: dynamic endpointing (env `LIVEKIT_MIN_ENDPOINTING_DELAY`=0.8s, `LIVEKIT_MAX_ENDPOINTING_DELAY`=6.0s) + semantic EOT model (`LIVEKIT_TURN_DETECTOR=multilingual`). Evidence 2026-10-26: mid-sentence pause → first STT fragment held ~13s until speaker finished, then whole utterance forwarded at once.
- **Preemptive generation deliberately OFF** — running the LLM on interim text would land partial/duplicate user messages in the stateful Letta conversation (code comment in agent.py).
- End-of-speech → transcript forwarded to adapter: **<1 second**.

## Hold #2 — the Letta agent turn (30-50s, the real culprit)

- `thinking → speaking` gaps measured 36-50s in worker logs = model inference + tool calls (e.g. MessageChannel) + TTS synthesis.
- **Turns serialize per user**: adapter returns 409 while a turn is in flight; a new utterance queues behind the current turn. Speaking again while the agent thinks does NOT parallelize.

## Diagnosis recipe

`docker logs jarvis-voice-worker --since 15m` — correlate `[STT] transcript=... final=True` and `[agent-state] thinking` timestamps:
- speaking-end → STT final → thinking gap = bridge/turn-detection hold
- thinking → speaking gap = Letta agent turn (the big one)

Tuning knobs are env vars on the worker (compose: `~/GitHub/infra-bonker/apps/jarvis-voice-worker/docker-compose.yml`): `LIVEKIT_TURN_DETECTOR=off` (plain VAD endpointing, faster but cuts off at pauses), endpointing min/max delays. But the high-leverage lever is the agent turn itself, not the bridge.
