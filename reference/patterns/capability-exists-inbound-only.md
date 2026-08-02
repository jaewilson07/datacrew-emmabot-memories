---
description: Pattern — member hunts for an outbound setting that only exists inbound. Establish direction before searching; PGP over SFTP is the worked example.
---
# Pattern: the capability exists, but only inbound

## Symptom

> "Where do I set the PGP key so Domo encrypts the file before it lands on our partner's
> SFTP server? I can see the PGP fields on the connector but not on the writeback."

The member has found the feature, confirmed it is real, and is now hunting for the setting
in the wrong direction. They will keep hunting, because they have proof the capability
exists.

## Mechanism

Domo's inbound and outbound data paths are separate products with separate feature sets,
and the naming does not signal that. A member reasonably reads "the SFTP connector supports
PGP" as "Domo supports PGP over SFTP."

For PGP specifically: Domo supports **decryption on import** and has **no PGP encryption on
export**. The SFTP Writeback connector exports plain CSV; its SSH key options are transport
authentication, not file-level encryption. Two adjacent facts reinforce the wrong
conclusion — the SFTP Advanced Security connector's public key is for *authentication*, and
the S3 Writeback connector *does* have encryption fields, but that is S3-specific and not
PGP.

Workbench is the third dead end: it is inbound-first, and its writeback reaches on-prem
databases over ODBC, not SFTP servers.

## Diagnostic sequence

1. **Establish direction.** Files into Domo, or files out of Domo? Ask before answering.
   The answer changes which product surface applies, and the member's phrasing usually
   does not make it explicit.
2. **Inbound → the feature is there.** SFTP Connector: File Encryption Type, PGP Private
   Key, PGP Passphrase, plus decryption/decompression ordering. Send the doc and stop.
3. **Outbound → say plainly that it does not exist.** Do not send them to Workbench, and
   do not send them to the S3 encryption fields hoping they generalize. Both are dead ends
   that look like leads.
4. **Move to workarounds.** The question becomes an architecture question, not a settings
   question. Cheapest first:
   - **External orchestration (recommended)** — export via API or SFTP Writeback to an
     intermediate host, then `gpg --encrypt --recipient <key>` and `sftp put`. Ordinary,
     well-understood, fully in the member's control.
   - **Code Engine** — a Python tile could encrypt, but which crypto libraries are
     available is unconfirmed, and delivery to SFTP is still unsolved. Offer as a
     direction to explore, labelled as unverified.
   - **Encrypt before Workbench picks the file up** — only relevant if the flow is
     genuinely inbound after all.

## Support rule

Ask the direction question first. It costs one line and prevents an answer aimed at the
wrong half of the platform.

When the answer is "Domo doesn't do this," say it in the first sentence and then spend the
rest of the reply on the workaround. A member who has proof the feature exists somewhere
will not stop searching on a hedge — "I don't think there's a setting for that" reads as
"look harder." Being direct is the kindness here.

Never imply Workbench can write to an external SFTP server. That specific misconception is
common enough to correct pre-emptively when it is nearby.

Generalize the shape, not the fact: before answering any "where is the setting for X"
question, confirm which direction data is moving. The PGP case is the worked example, not
the whole pattern.

Details and doc links: [[reference/domo-sftp-pgp.md]]
