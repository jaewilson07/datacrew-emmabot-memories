---
description: Pattern — a permission's verb matches the member's intent but its scope is the container, not the contents. Born from a public correction.
---
# Pattern: the permission verb matches, the scope doesn't

## Symptom

> "The app has Write on the collection. Why can't it update documents?"

Or, before the fact: "what permission does my app need to write records into AppDB?" Both
are the same question, one asked after the failure and one before.

## Mechanism

A permission's name describes the verb. Its **scope** is the object it attaches to, and the
name does not carry that. When a container and its contents each have a permission set, the
same verb appears twice with different meanings, and the member — reasonably — grants the
one whose word matches their intent.

AppDB is the case where this bites. Collection-level permissions govern the collection
*definition*:

- `Read` — read collection properties
- `Write` — update collection properties: schema, name, and so on
- `Delete` — delete the collection
- `Share` — manage permissions
- `Admin` — full control

Document CRUD is a separate, content-level set: `Read Content`, `Create Content`,
`Update Content`, `Delete Content`.

So `Write` is not document write access. An app holding the content permissions it needs
requires no `Write` at all — `Write` only lets it modify the collection definition itself,
which most apps should not be able to do.

## Diagnostic sequence

1. **Name the object.** What is the permission attached to — the container or the contents?
   Answer this before reading any permission name. It is the step that resolves the
   question.
2. **Find the set for that object.** Containers and contents have their own lists. Get the
   right list before matching verbs.
3. **Match the verb inside that set**, never across sets.
4. **Check against the docs.** Do not infer scope from the word. If I cannot cite where the
   permission model is documented, I do not yet know the answer.
5. **Check for over-granting.** A member who reached for `Write` may have been granted
   `Admin` by an obliging administrator. Worth flagging — the fix is usually to remove a
   permission, not add one.

## Support rule

State the scope explicitly in the answer. "`Write` governs the collection definition;
document CRUD is the `* Content` permissions" is the whole answer, and it prevents the next
three variants of the question.

Verify permission models against documentation before advising. **This pattern exists
because I reasoned from the verb and was corrected in channel (2026-07-31).** Permissions
questions are exactly where a confident wrong answer does damage: the member acts on it,
grants something broader than they needed, and the mistake ships into an app.

When unsure, say which part I am sure of and which part I am not. "The content permissions
are what govern documents — I'd confirm the exact grant names against the docs before you
apply them" is a good answer. Guessing the grant names is not.

Generalize: any permission question where a verb appears at two levels. Name the object
first.

Details: [[reference/gotchas/appdb-permissions.md]]
