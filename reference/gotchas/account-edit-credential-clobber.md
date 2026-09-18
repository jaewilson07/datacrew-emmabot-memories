# Account Edit Can Clobber Stored Credentials (writeback connector 401)

**Origin:** Sandra Palmer (DUG #help-connectors-and-integrations, 2026-09-18) — SFTP Writeback dataset
401s on `api.domo.com/v1/datasets/{id}` after a user "only" renamed the account.

## The two facts that explain the error

1. **Writeback connectors read their input DataSet via the Platform Datasets API**
   (`api.domo.com/v1/datasets/...`), authenticated with the **Domo Client ID + Client Secret**
   stored in the connector's *Account* (alongside the SFTP credentials). A 401 on that URL =
   the stored client credentials broke — **not** a DataSet permissions problem.
   (SFTP Writeback prerequisites: https://domo-support.domo.com/s/article/360042932474)

2. **Editing an account re-submits the full credential form.** The Accounts UI edit modal
   (Account options → Edit account) is the same form for renaming and for credential changes;
   saving it submits every field. A "rename-only" save that doesn't re-enter credentials can
   overwrite/clear what was stored. Renaming is documented as safe
   (https://www.domo.com/docs/s/article/360042926054) but the doc never warns about this.
   Community-confirmed pattern with other connectors (NetSuite):
   https://community-forums.domo.com/main/discussion/59534/ — fix was a fresh account with
   the same credentials.

## Diagnostic / fix sequence

1. Edit the account again, re-enter the **full** credential set (Client ID, Client Secret,
   SFTP details) → Connect.
2. Verify the Client ID/Secret still match an active client in developer.domo.com with the
   `data` scope (rotated secret / revoked client also produces 401).
3. If the edit won't take: create a **new account** with the same credentials, test, then
   reassign the DataSet to it (Accounts UI reassign; selective reassign via stream API →
   knowledge-base `domo/gotchas/reassign-dataset-account-api.md`).
4. Rule out the separate writeback requirement: writeback DataSet owner must be owner/co-owner
   of the input DataSet.
5. Still 401 → support ticket with the error's ticket ID (`toe` field in the error body).

## Doc gap

Flagged: `gap` 2026-09-18 (account-edit-credential-clobber). Docs cover rename and edit flows
separately; nothing explains the Platform-API auth path for writeback input reads, or that an
edit save re-submits all credential fields.

Thread: https://domo-user-group.slack.com/archives/C019RKE5CHW/p1789746410388339
