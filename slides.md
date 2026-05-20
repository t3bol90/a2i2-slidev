---
theme: default
layout: title
title: A²I² Slidev Template
subtitle: An unofficial template · feature showcase deck
authors:
  - { name: Presenter Name, affiliation: 1, presenter: true }
  - { name: Collaborator Name, affiliation: 1 }
affiliations:
  - Deakin Applied AI Initiative
date: 2026-05-20
venue: Internal Lab Meeting
logos:
  - { src: /logos/deakin.png, alt: Deakin University }
info: |
  Unofficial Slidev template by Toan Doan. Not affiliated with or
  endorsed by the A²I² Institute or Deakin University.
highlighter: shiki
drawings:
  persist: false
transition: none
mdc: true
colorSchema: light
# Fonts are self-hosted via @fontsource (see styles/fonts.css) per PRD
# §"Platform pins". `provider: none` is the explicit kill-switch for
# Slidev's default Google Fonts <link> injection — preferred over
# enumerating every face in `local`, which is brittle.
fonts:
  sans: Inter
  serif: Inter
  mono: JetBrains Mono
  provider: none
---

---
layout: default
---

# What this deck demonstrates

This deck is a live showcase of the A²I² Slidev template — each section
exercises a different slice of the layout, component, and tooling system.

1. **Foundations** — brand tokens, self-hosted fonts, and the default chrome.
2. **Theorem Engine** — numbered theorems, definitions, and proofs across 8 kinds.
3. **Bibliography** — deck-global `<Cite>` superscripts with auto-rendered footnotes.
4. **Layout Gallery** — figure, figure-side, two-col, quote, section-toc, and closing.
5. **Animations & Tooling** — `v-switch` step diagrams and the draft-mode `<Todo>` helper.
6. **Code & Syntax** — the custom A²I² Shiki theme, line numbers, and Magic Move.

Clone the repo, run `pnpm dev`, then edit `sections/NN-slug.md` to build your own talk.

---
src: ./sections/01-foundations.md
---

---
src: ./sections/02-content-primitives.md
---

---
src: ./sections/03-academic-helpers.md
---

---
layout: closing
contact: "toan.doan@deakin.edu.au · github.com/t3bol90"
---

::acks::

This is an unofficial, personal slide template by **Toan Doan**.
Not affiliated with or endorsed by the A²I² or Deakin University.
