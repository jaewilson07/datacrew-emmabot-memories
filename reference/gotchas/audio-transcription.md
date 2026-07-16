---
description: Audio transcription gotchas — local whisper models unreliable for Slack voice memos.
---
# Audio Transcription Gotchas

- **Local whisper models produce unreliable transcriptions** — both `tiny` and `base` models hallucinate on Slack audio clips (produce repetitive garbage like "I think it is" or "AXE"). The audio clips from Slack voice memos seem to have characteristics that confuse whisper (consistent amplitude, possible background noise). Don't rely on local whisper for Slack audio — ask the sender to type it out instead.
- **Whisper cache exists** at `/home/jaewilson07/.cache/whisper/` (has `base.pt` and `tiny.pt` models). Can install via `uv venv /tmp/whisper_env && source /tmp/whisper_env/bin/activate && uv pip install openai-whisper`. But results are poor for Slack voice memos.
- **No cloud transcription available** — no OpenAI API key, no Groq key. Hugging Face API is unreachable from the sandbox (DNS resolution fails). The only option is local whisper, which doesn't work well.
