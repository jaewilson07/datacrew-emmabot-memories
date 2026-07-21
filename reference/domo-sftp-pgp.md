---
description: Domo SFTP PGP encryption support — import-side decryption only, no export-side encryption.
---
# Domo SFTP & PGP Encryption

## Key Finding

Domo supports PGP **decryption** on the **import** side but does NOT support PGP **encryption** on the **export/writeback** side.

## Details

### Import Side (Files INTO Domo)
- The SFTP Connector supports PGP decryption of incoming files
- Fields available: File Encryption Type, PGP Private Key, PGP Passphrase
- Can also specify order of decryption and decompression
- Doc: https://www.domo.com/docs/s/article/000005408

### Export Side (Files OUT of Domo)
- The SFTP Writeback connector exports data as plain CSV to an external SFTP server
- No PGP encryption option for output files
- Supports SSH key authentication (RSA/DES in PEM format, NOT ssh-keygen)
- Doc: https://www.domo.com/docs/s/article/360042932474

### SFTP Advanced Security Connector
- Uses public key for SSH **authentication**, not file-level encryption
- Generates a public key in the connector UI that you place on the SFTP server
- Doc: https://www.domo.com/docs/s/article/360058713713

## Workarounds for Outbound PGP Encryption

1. **External orchestration** (recommended) — Export from Domo via API or SFTP Writeback to intermediate server, then use a script (`gpg --encrypt --recipient <key>` + `sftp put`) to encrypt and upload
2. **Domo Code Engine** — Potentially write a Python tile with PGP library, but uncertain which crypto libs are available and still need SFTP delivery
3. **Workbench + local pre-processing** — Encrypt locally before Workbench picks up the file (more manual)

## Common DUG Question Pattern

Users asking about encrypting files with a recipient's public key before uploading to a third-party SFTP server. This is an outbound scenario Domo doesn't natively handle.
