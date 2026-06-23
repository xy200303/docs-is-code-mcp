---
name: 'claude'
version: '1.3.0'
title: 'CLAUDE.md'
type: 'agent-protocol'
status: 'reference'
source: 'spec-coding-mcp'
description: 'Startup protocol for Claude-style coding agents working on Spec Coding MCP.'
category: 'workflow'
triggers:
  - startup
  - claude
  - spec-context
  - guidance
appliesTo:
  - agents
  - model-startup
  - workflow-routing
updated: '2026-06-23'
---

# CLAUDE.md

Project: Spec Coding MCP

## Startup Protocol

This file is only the model startup router. It should stay short.

Before code or documentation changes:

1. Call `spec_context` and read the current workflow state.
2. Treat selected specs and open execution checklist items as the only task source.
3. Execute open checklist items from top to bottom; when none exist, follow the selected spec.
4. If principles are unclear, call `spec_guidance_list`, then `spec_guidance_read`: engineering rules use `engineering`, UI/UX rules use `ui-ux`.
5. Record meaningful progress with `spec_checkpoint`.
6. Call `spec_done` only after implementation, checklist updates, verification, and final behavior records are complete.

## Guidance

- `engineering`：engineering, code style, architecture, and business confirmation rules.
- `ui-ux`：fact-first, context-sensitive UI/UX design principles.
- `spec-writing`：spec workflow, execution checklist, progress records, done archives, and behavior records.
- `git-commit`：safe verification, staging, commit message, and final report workflow.
- `pr-submit`：PR template discovery, branch push, PR body, creation, and fallback workflow.
- `quality-review`：implementation self-review for code quality, tests, architecture, UI/UX states, and delivery risk.

Read guidance only when needed; do not copy long guidance into normal context.

## Hard Stop

Ask the user before implementing unclear or high-risk business rules involving money, permissions, state machines, concurrency, idempotency, retries, rollback, compliance, or role differences.

## Shared Memory / Vault

The `specs/` directory acts as a durable vault — a folder of plain-text files that persists context across sessions, chats, and agents.

### Vault Structure

```
specs/
├── README.md          # vault index and conventions
├── active/            # current work: what is being done now
├── todo/              # lightweight execution checklists
├── done/              # completed specs with final behavior contracts
├── review/            # source review tasks for codebase understanding
└── guidance/          # editable agent guidance (engineering, UI/UX, git, PR, etc.)
```

### Vault Principles

- Specs are the shared memory: do not lock context inside a single chat transcript. Write decisions, blockers, owners, dates, and links into specs.
- Each spec file is a persistent work record. The next session or agent picks up from it, not from stale conversation memory.
- Treat the vault as append-only for records. Do not rewrite history; add new checkpoint records.
- Keep the vault clean: do not edit files unless there is meaningful new context to add.

### Cross-Session Handoff

When resuming work after a context reset or new session:

1. Read `spec_context` first — selected specs and open TODOs are the authoritative task source.
2. Do not re-derive context from stale conversation memory; the specs directory is the shared memory.
3. Check for `[watch]` TODOs that may now be satisfiable (CI passed, review arrived, etc.).
4. If previous session left uncommitted changes, inspect `git status` before continuing.
5. Keep the working tree clean: avoid reverting user edits made between sessions.
## Boundaries

- Do not guess business rules.
- Do not use stale conversation context over selected specs or open TODOs.
- Do not overwrite user edits or make unrelated reshuffles.
- Keep changes small, focused, and verified.
