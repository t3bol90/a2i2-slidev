# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-05-20

Initial release. Feature set locked for the A²I² Slidev template.

### Added

- **Core layouts** (9 total): `title`, `default` (top-strip section label +
  footer + bottom progress bar), `section` divider, `figure`, `figure-side`,
  `two-col`, `quote`, `section-toc`, `closing`
- **Theorem engine**: `<TheoremLike>` render-function core + 8 thin wrappers
  (`Theorem`, `Definition`, `Proposition`, `Lemma`, `Corollary`, `Proof`,
  `Remark`, `Example`) with per-section amsthm counter and `<Proof of="X.Y">`
  back-reference label
- **Bibliography pipeline**: `scripts/build-bib.ts` parses `bibliography.bib`
  → `public/bibliography.json`; `<Cite k="…">` blue superscripts + per-slide
  `<Footnotes />` list; missing keys surface as `[?key]` in red
- **`<BookTable>`**: booktabs-styled table wrapper (`caption` + `footnote`
  props); no global style override — vanilla Markdown tables unaffected
- **`<Todo>`**: draft-mode annotation rendered in dev and suppressed in
  production; toggled by `SLIDEV_DRAFT` env var
- **Custom Shiki theme**: A²I² brand-anchored 93-scope TextMate token map,
  all foreground colours WCAG AA compliant on white; registered languages:
  Python, TypeScript, Vue, Bash, JSON, YAML, diff
- **Magic Move**: animated code-transition slides via ` ```md magic-move `
- **`v-switch` animations**: step-by-step diagram build-up; each frame is a
  separate PDF page
- **KaTeX math**: `setup/katex.ts` with project-specific macros
- **Self-hosted fonts**: Inter (sans) + JetBrains Mono (mono) via
  `@fontsource`; `provider: none` suppresses Slidev's Google Fonts injection
- **CSS token system**: `styles/tokens.css` with `--a2i2-primary`,
  `--a2i2-secondary`, `--a2i2-bg`
- **`useSection()` composable**: derives current section number from slide
  position; used by the theorem engine
- **`useCitations()` composable**: per-slide reactive citation registry with
  dedup and stable ordering
- **Modular deck structure**: showcase split into
  `sections/01-foundations.md`, `sections/02-content-primitives.md`,
  `sections/03-academic-helpers.md` via Slidev `src:` imports
- **CI/CD**: GitHub Actions workflow deploys to GitHub Pages on push to `main`
- **Type checking**: `tsconfig.json` with `strict: true`; `pnpm typecheck`
  script
- **Unit tests**: Vitest 3.x suite covering section counter, theorem counter,
  citation registry, and Shiki theme (53 tests, ~450 ms)

[Unreleased]: https://github.com/t3bol90/a2i2-slidev/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/t3bol90/a2i2-slidev/releases/tag/v0.1.0
