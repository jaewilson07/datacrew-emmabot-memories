---
description: Audio transcription gotchas — local whisper models unreliable for Slack voice memos.
---
# Audio Transcription Gotchas

- **Local whisper can work, but is inconsistent** — the `base` model has produced both garbage (repetitive hallucinations like "I think it is" or "AXE") and accurate transcriptions on Slack audio clips. When it works, it works well. When it fails, it fails completely. Always verify the output makes sense before acting on it. If the transcription is garbage, ask the sender to type it out.
- **Install whisper in home dir, NOT /tmp** — `/tmp` has a 16GB tmpfs limit and torch alone is ~2GB, causing "Disk quota exceeded" errors. Install to `/home/jaewilson07/.local/whisper_env` instead: `uv venv /home/jaewilson07/.local/whisper_env && source /home/jaewilson07/.local/whisper_env/bin/activate && uv pip install openai-whisper`
- **Whisper cache exists** at `/home/jaewilson07/.cache/whisper/` (has `base.pt` and `tiny.pt` models). The venv at `/home/jaewilson07/.local/whisper_env` is persistent (unlike /tmp venvs which get cleaned up).
- **Voice-gateway on cubby is the PREFERRED transcription path** (verified 2026-10-09) — faster-whisper served at `http://cubby.lan:8885/v1/audio/transcriptions`, no auth needed. One-shot curl works:
  `curl -X POST http://cubby.lan:8885/v1/audio/transcriptions -F file=@audio.wav -F model=whisper-1 -F response_format=json`
  Returned an accurate transcription in ~1.3s. The same endpoint is proxied through the bonker gateway at `http://localhost:7630/v1/audio/transcriptions`.
- **Model name gotcha** — supported models are `whisper-1` and `large-v3-turbo` ONLY. `faster-whisper` is NOT a valid model name (returns a 400 listing the supported names). Prefer `large-v3-turbo` — far more accurate than the local `base` model.
- **Local whisper venv is the fallback** (`~/.local/whisper_env`, base model) if the gateway is unreachable — but see above: base is unreliable for Slack voice memos.
- **External cloud transcription still unavailable** — the OpenAI API key has no credits and no access to whisper-1 or gpt-4o-transcribe models. Hugging Face API is unreachable (DNS resolution fails). Groq key not available. (This is why the cubby voice-gateway matters.)
