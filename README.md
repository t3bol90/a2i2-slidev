# A²I² Slidev Template

Slidev v51 template for academic and lab talks from the **A²I² Institute,
Deakin University**. Ships opinionated defaults — A²I² brand colours, KaTeX
math, BibTeX citations, a theorem engine, booktabs tables, and a custom Shiki
code theme — so authors can focus on content rather than layout plumbing.

**Live demo:** https://t3bol90.github.io/a2i2-slidev/

---

## Install

Requires **Node ≥ 20** and **pnpm ≥ 11** (version pinned via `packageManager`).

```bash
pnpm install
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server at <http://localhost:3030> (auto-opens browser) |
| `pnpm build` | Build a static SPA to `dist/` |
| `pnpm preview` | Serve the built deck locally |
| `pnpm export` | Export to PDF (`slides-export.pdf`) |
| `pnpm bib:build` | Re-parse `bibliography.bib` → `composables/bibliography.json` |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm typecheck` | TypeScript type check (`tsc --noEmit`) |

`bib:build` fires automatically via `predev`/`prebuild` hooks — only run it
manually if you update `bibliography.bib` mid-session without restarting the
dev server.

## Deploy

Every push to `main` triggers `.github/workflows/deploy.yml` and deploys to
**GitHub Pages** under `/<repo-name>/`.

**One-time setup for forks:** GitHub → Settings → Pages → Source: **GitHub
Actions**. Without this, the deploy job fails with "Pages not configured".

---

## Customisation

### Colours

Edit `styles/tokens.css`. Three brand tokens cascade through all layouts and
components:

```css
--a2i2-primary: #F05A40;   /* progress bar, left-bar accents, Cite superscripts */
--a2i2-secondary: #555555; /* chrome type (section name, footer) */
--a2i2-bg: #FFFFFF;        /* slide surface */
```

### Fonts

Fonts are self-hosted via `@fontsource` packages (Inter + JetBrains Mono).
Import additional faces in `styles/fonts.css` and update the `fonts:` block in
`slides.md`. The `provider: none` entry in the deck frontmatter suppresses
Slidev's default Google Fonts injection.

### Logos

Drop SVG or PNG assets into `public/logos/` and reference them in a
`layout: title` slide's `logos:` frontmatter array:

```yaml
logos:
  - { src: /logos/deakin.png, alt: Deakin University }
```

---

## Authoring guide

### Writing a new section

Follow the **depth-2 flat convention**: create `sections/NN-slug.md`, then
import it in `slides.md` via a `src:` block:

```yaml
---
src: ./sections/04-my-section.md
---
```

Start each section file with a `layout: section` divider (provides the
top-strip label and resets the theorem counter) followed by content slides.

### Math

KaTeX is configured in `setup/katex.ts`. Project-specific macros live there
alongside standard LaTeX syntax. Use `$…$` for inline math and `$$…$$` for
display math.

### `<Theorem>` / `<Proof>` and the theorem engine

Eight theorem-like wrappers share a per-section counter following the amsthm
convention (Theorem → Definition increments 3.1 → 3.2):

```vue
<Theorem name="Front-Door Identification">
  Given the mediation DAG, the interventional distribution satisfies …
</Theorem>

<Proof of="3.1">
  Apply the law of total probability over $H^{(L)}$ …
</Proof>
```

Available kinds: `Theorem`, `Definition`, `Proposition`, `Lemma`, `Corollary`,
`Proof`, `Remark`, `Example`. Pass `:qed="false"` to `<Proof>` to suppress the
QED square. Pass an explicit `:n="7"` to override auto-numbering.

### `<Cite>` and `<Footnotes>`

Add references to `bibliography.bib` (standard BibTeX format), then cite by
key:

```vue
This result was shown in <Cite k="vaswani2017attention" />.

<Footnotes />
```

`<Cite>` renders a blue superscript `[N]`; `<Footnotes>` lists all citations
cited on the current slide. Missing keys render as `[?key]` in red — no
silent failure.

### `<BookTable>`

Wraps any Markdown or HTML `<table>` for booktabs-style rendering (toprule,
midrule, bottomrule; no vertical rules):

```vue
<BookTable caption="Results on the test set" footnote="* averaged over 5 seeds">

| Method   | Score         |
|----------|---------------|
| Ours     | **91.2**      |
| Baseline | 84.7          |

</BookTable>
```

### `<Todo>`

Draft annotations visible in `pnpm dev` but absent from production builds:

```vue
<Todo>Fill in ablation numbers before the talk.</Todo>
```

Set `SLIDEV_DRAFT=1 pnpm build` to keep `<Todo>` blocks in a production build.

### `v-switch` animations

Use Slidev's built-in `<v-switch>` for step-by-step diagram reveals. Each
`<template #N>` becomes a separate PDF page:

```vue
<v-switch>
  <template #1><img src="/figures/dag-step1.svg" /></template>
  <template #2><img src="/figures/dag-step2.svg" /></template>
  <template #3><img src="/figures/dag-step3.svg" /></template>
</v-switch>
```

### Magic Move

Wrap consecutive fenced code blocks in a ` ```md magic-move ` fence to animate
code transitions:

````markdown
```md magic-move
```python
def steer(h, delta):
    return h + delta
```

```python
def steer(h, delta, alpha: float = 1.0):
    mask = delta.abs() > delta.abs().median()
    return h + alpha * delta * mask
```
```
````

**Constraint:** do not add per-block Slidev attributes (e.g. `{lines: true}`) to
code fences inside a `magic-move` block. The Magic Move parser in Slidev v51 does
not support them and silently degrades to rendering only the first block with no
animation.

### Slide transitions

The deck default is `transition: none` — no animation between slides. This suits
academic talks where unexpected motion distracts the audience.

To opt a single slide back in, add a `transition:` key to that slide's frontmatter:

```yaml
---
transition: slide-left
---
```

---


## License

MIT — see `LICENSE`.
