# unspin

Add plain English explanations to Claude Code's spinner verbs.

**Before:**

```
· Prestidigitating... (thinking)
```

**After:**

```
· Prestidigitating [doing magic tricks]... (thinking)
```

## Install

```bash
npx unspin
```

That's it. Your Claude Code spinner verbs now include explanations.

## Commands

```bash
npx unspin            # Install annotated verbs
npx unspin --undo     # Restore Claude Code defaults
npx unspin --list     # See all verbs and their meanings
npx unspin --dry-run  # Preview without changing anything
npx unspin --force    # Override existing custom verbs
```

## How it works

unspin writes to `~/.claude/settings.json`, setting `spinnerVerbs` with `mode: "replace"`. Each of Claude Code's ~185 default spinner verbs gets a bracketed explanation appended:

```
Cogitating [thinking deeply]
Flibbertigibbeting [chattering wildly]
Prestidigitating [doing magic tricks]
```

To go back to normal, run `npx unspin --undo`.

## Requirements

- Node.js >= 20
- Claude Code (the CLI tool from Anthropic)

## License

MIT
