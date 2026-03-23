# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is unspin?

A zero-dependency Node.js CLI tool that adds plain English explanations to Claude Code's obscure spinner verbs. It writes annotated verbs into `~/.claude/settings.json` so that when Claude Code shows "Prestidigitating..." users also see "[doing magic tricks]".

## Commands

- `npm test` — run all tests (uses node:test, no test runner needed)
- `node bin/unspin.js` — run CLI locally
- `node bin/unspin.js --dry-run` — preview output without writing

## Architecture

- `bin/unspin.js` — CLI entry point, arg parsing, dispatches to install/undo/list/dry-run
- `src/verbs.json` — key-value map of 185 spinner verbs to plain English meanings
- `src/formatter.js` — transforms verb map into annotated strings, sentinel detection
- `src/settings.js` — reads/writes ~/.claude/settings.json with atomic writes
- `tests/` — tests use node:test with temp directories (no mocking of real settings)

## Key Design Decisions

- Zero dependencies: only Node.js built-ins. Keeps npx fast.
- Sentinel value `__unspin__` as first element in verbs array to detect unspin-generated config vs user-custom verbs.
- `UNSPIN_SETTINGS_PATH` env var overrides settings path for testing.
- Atomic writes via temp file + rename to prevent settings.json corruption.
