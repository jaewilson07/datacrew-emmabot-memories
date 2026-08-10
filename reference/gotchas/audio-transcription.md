---
description: Audio transcription gotchas — local whisper models unreliable for Slack voice memos.
---
# Audio Transcription Gotchas

- **Local whisper can work, but is inconsistent** — the `base` model has produced both garbage (repetitive hallucinations like "I think it is" or "AXE") and accurate transcriptions on Slack audio clips. When it works, it works well. When it fails, it fails completely. Always verify the output makes sense before acting on it. If the transcription is garbage, ask the sender to type it out.
- **Install whisper in home dir, NOT /tmp** — `/tmp` has a 16GB tmpfs limit and torch alone is ~2GB, causing "Disk quota exceeded" errors. Install to `/home/jaewilson07/.local/whisper_env` instead: `uv venv /home/jaewilson07/.local/whisper_env && source /home/jaewilson07/.local/whisper_env/bin/activate && uv pip install openai-whisper`
- **Whisper cache exists** at `/home/jaewilson07/.cache/whisper/` (has `base.pt` and `tiny.pt` models). The venv at `/home/jaewilson07/.local/whisper_env` is persistent (unlike /tmp venvs which get cleaned up).
- **No cloud transcription available** — the OpenAI API key has no credits and no access to whisper-1 or gpt-4o-transcribe models. Hugging Face API is unreachable (DNS resolution fails). Groq key not available. Local whisper is the only option.
