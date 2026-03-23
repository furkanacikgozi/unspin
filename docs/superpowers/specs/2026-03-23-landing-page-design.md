# unspin Landing Page Design

## Overview

Single HTML file (`docs/index.html`) serving as a playful, colorful landing page for unspin. Hosted via GitHub Pages from the `docs/` folder. Zero dependencies — pure HTML/CSS/JS.

**Goals:** Drive npm usage (`npx unspin`) and GitHub community (stars, contributions).
**Tone:** Fun, colorful, playful — matching the "funny verbs" concept of unspin.
**Length:** Short scrollable — hero + a few sections, not too long.
**Language:** English (matching the project's README and docs).

## Technology

- Static single `docs/index.html` file
- No build step, no framework, no dependencies
- GitHub Pages serves from `docs/` directory
- Inline CSS and JS (single file)

## Page Structure

### 1. Hero Section (viewport height)

- **Background:** Vibrant gradient (purple → pink tones, e.g. `#667eea → #764ba2 → #f093fb`)
- **Title:** "🔮 unspin" in large bold text, white
- **Subtitle:** "Finally understand what Claude Code is doing"
- **Animated terminal mockup** (centered):
  - Dark rounded box simulating a terminal
  - Spinner verbs cycle every ~3 seconds with a fade animation
  - Each verb shows with its `[explanation]` in green
  - Example: `· Prestidigitating [doing magic tricks]... (thinking)`
  - Verbs sourced from a JS array: pick the most humorous/surprising ~12 verbs from `src/verbs.json`
  - Respects `prefers-reduced-motion`: if enabled, show a static verb instead of cycling
- **CTA:** `$ npx unspin` in a dark pill/button
  - On click: copies `npx unspin` to clipboard via `navigator.clipboard.writeText()`
  - Feedback: button text changes to "Copied!" for 2 seconds, then reverts
  - Keyboard accessible (focusable, Enter triggers copy)

### 2. Before / After Section

- **Layout:** Two terminal mockups side by side (stacked on mobile)
- **Left (Before):** 3-4 raw spinner verbs without explanations, red "❌" header, confused emoji
- **Right (After):** Same verbs with `[explanation]` in green, green "✅" header, sparkle emoji
- **Purpose:** Instantly communicates the value proposition

### 3. Features Section (3 cards)

Three colorful cards in a row (stacked on mobile):

1. **⚡ One Command** — `npx unspin` — that's it. No dependencies, no setup.
2. **📖 185 Verbs** — Plain English explanation for every spinner verb.
3. **↩️ Undo** — `npx unspin --undo` restores Claude Code defaults.

### 4. Footer CTA

- Two large buttons side by side:
  - **⭐ Star on GitHub** → `https://github.com/furkanacikgozi/unspin`
  - **📦 View on npm** → `https://www.npmjs.com/package/unspin`
- Minimal footer text: "MIT License"

## Animation Details

The hero terminal cycles through verbs using a simple JS interval:

```js
const verbs = [
  { verb: "Prestidigitating", meaning: "doing magic tricks" },
  { verb: "Confabulating", meaning: "making things up" },
  { verb: "Flibbertigibbeting", meaning: "chattering wildly" },
  { verb: "Cogitating", meaning: "thinking deeply" },
  { verb: "Defenestrating", meaning: "throwing out the window" },
  // ~12 of the most humorous verbs from src/verbs.json
];
```

Transition: fade out old verb, fade in new verb. Cycle every 3 seconds.

If `prefers-reduced-motion` is active, display a single static verb with no animation.

## Accessibility

- `prefers-reduced-motion` media query disables cycling animation
- All interactive elements are keyboard-accessible
- Sufficient color contrast (WCAG AA): verb text uses `#f0abfc` on `#1a1a2e` for 7.1:1 ratio
- Semantic HTML: proper heading hierarchy, landmark elements

## Responsive Design

- Mobile-first approach
- Before/After terminals stack vertically on mobile
- Feature cards stack vertically on mobile
- Hero text sizes scale down on smaller screens
- CTA buttons stack on mobile

## Color Palette

- **Background gradient:** `#667eea` → `#764ba2` → `#f093fb`
- **Terminal background:** `#1a1a2e`
- **Explanation text:** `#34d399` (green)
- **Verb text:** `#f0abfc` (pink, WCAG AA compliant on dark bg)
- **Card backgrounds:** White with subtle shadows
- **CTA buttons:** Purple (`#764ba2`) and blue (`#667eea`)

## Prerequisites

- Enable GitHub Pages in repo settings: Source → `main` branch, `/docs` folder

## Files Changed

- `docs/index.html` — new file, the landing page
