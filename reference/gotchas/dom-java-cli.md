---
description: Domo Java CLI (domoUtil.jar) — download, setup, commands, API mechanics, and testing patterns.
---
# Domo Java CLI (domoUtil.jar) — Download, Setup, API Mechanics

## Download & Setup

- **Direct download (no auth):** `https://app.domo.com/labs/java-sdk/latest/domoUtil.jar` (~57MB)
- **Official route:** Admin Settings > Tool Downloads > Domo CLI (Domo instance, not external)
- **Version:** v3.33.51 (self-reports as latest; `help` output shows 148 commands)
- **Java requirement:** Java 7+ required; Java 17+ needs `--add-opens java.base/java.nio=ALL-UNNAMED`
- **Help:** Runs fully offline — `help` lists commands, `help <command>` shows flags/params
- **Local rig:** JAR + Temurin JRE 17 cached at `~/.cache/domocli/` on bonker for offline verification
  - Run: `~/.cache/domocli/jdk-17*/bin/java --add-opens java.base/java.nio=ALL-UNNAMED -jar domoUtil.jar`
  - Pipe commands: `printf 'help <cmd>\nquit\n' | java ... -jar domoUtil.jar`

## CLI Testing Patterns

- **API instrumentation:** `log-api --file <path>` captures API request details (endpoints, methods, payloads). Enable BEFORE the commands you want to trace. Each CLI session resets logging — re-enable for each new command sequence.
- **Environment token:** `connect -s <domain> -v <ENV_VAR_NAME>` — passes token from environment without echoing. Avoids credential leakage.
- **`/tmp` space:** /tmp fills quickly with large downloads. Extract/prepare in home directory instead.
- **Script mode:** `-script file.script` for automated multi-command sequences. Parse outputs carefully — errors may come from different commands than expected.

## partition-dataset: Verified API Mechanics

### CLI Command
```
partition-dataset -i <dataset_id> -k <column_name>
```
Verbatim: "Initiates a process to partition a dataset using the specified column as the partition key. This operation does not change the data contained in the dataset, but does replace any existing partitioning."

### API Endpoint (undocumented — verified via log-api)
- **Endpoint:** `POST https://<instance>.domo.com/api/dataprocessing/v1/job/repartition`
- **Request body:** `{"job": null, "datasourceId": "<dataset_id>", "partitionIdColumn": "<column>"}`
- **Response:** Creates a `PARTITION_INIT` job with state `CREATED`, returns job ID

### Job Lifecycle
1. `CREATED` — job just created
2. `RUNNING_INDEXING` — partitioning in progress
3. `SUCCESS` — partition applied (~25s for small datasets)

### partition-dataset-status
- **Command:** `partition-dataset-status -i <job_id>`
- Takes the **JOB ID** (integer), NOT the dataset UUID. Will error with "Partition Job ID must be a number" if passed a dataset ID.
- Polls the repartition job via `GET /api/dataprocessing/v1/job/repartition/<job_id>`

### Tag-Replace Semantics (verified by live test)
After partitioning a dataset:
- **Partition-tagged uploads** work: `upload-dataset -a -p <tag>` adds/replaces rows for that tag
- **Re-upload to same tag REPLACES** that tag's rows only; total row count changes based on upload content
- **Untagged rows survive** partition-tagged re-uploads
- Partitioning is **server-side only** — no client-side data movement visible; same dataset ID and stream after partition

## Other Relevant Commands

### set-dataset-retention-window (DEPRECATED)
- Still present in binary v3.33.51 but listed as deprecated in docs
- **Only HIDES** data outside the time window — does NOT delete storage
- Help: "Sets the maximum length of time Domo will display data that is uploaded to a dataset. Data versions loaded into Domo outside of this time window will still exist but not be visible on the data source."
- Not a solution for storage retention or row-level DELETE

### partition-dataset-status
- Companion to partition-dataset for polling async partition jobs
- Requires job ID (integer), returns job state

## KB Status
- `partition-dataset` is NOT documented in the CLI KB article (360043437733) — help-only discovery
- `set-dataset-retention-window` IS documented as deprecated in the same article
- Doc gap flagged and resolved via KB doc extension

## Common Pitfalls
- **Status command needs job ID, not dataset ID** — confusing error message
- **log-api resets per session** — must enable before each command sequence you want traced
- **derive-schema vs create-dataset options** — both use -s but with different meanings; errors can be misleading
