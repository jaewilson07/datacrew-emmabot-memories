---
description: pkill -f patterns can match the invoking shell's own cmdline and kill the command mid-run — use a non-self-matching pattern or kill by PID.
---
# pkill Self-Match

- `pkill -f "uvicorn app.main:..."` run from within an exec_command **whose own command string contains that pattern** kills the wrapping shell itself — the whole command dies mid-run.
- The `-f` flag matches against full cmdlines, and the invoking shell's cmdline includes the pkill command text.
- **Fixes:**
  - Use a pattern that won't match the invoking shell's cmdline (e.g. match on the port: `pkill -f "port 8765"`)
  - Or kill by exact PID
