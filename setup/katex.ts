import { defineKatexSetup } from '@slidev/types'

// Slidev auto-imports `katex/dist/katex.min.css` when it detects `$...$` or
// `$$...$$` in the deck source (see @slidev/parser detectFeatures). This
// file extends KaTeX's render options with the A²I² math macros translated
// from the lab's Typst conventions, plus two safety toggles documented below.
//
// Loaded by @slidev/cli `setupKatex(roots)` — the default export must be a
// function; its return is merged with `{ strict: false }` and forwarded to
// `katex.renderToString(latex, options)`.
export default defineKatexSetup(() => ({
  // Authors write `\psidnn`, `\NIE`, etc., and KaTeX expands them at render
  // time. Macros are deck-global (apply on every slide) so the showcase deck
  // and the steering port (S13) share the same vocabulary.
  macros: {
    '\\psidnn': '\\Psi_{\\text{DNN}(\\theta)}',
    '\\mfc': '\\hat{C}_F',
    '\\mfd': '\\hat{D}_F',
    '\\mfae': '\\hat{\\theta}_F',
    '\\meanCumReward': '\\bar{R}',
    '\\nep': 'n_{\\text{ep}}',
    '\\do': '\\text{do}',
    '\\NIE': '\\text{NIE}',
    '\\NDE': '\\text{NDE}',
  },
  // `trust: true` lets macros emit constructs like `\href` and `\htmlClass`.
  // Safe here because slide source is authored by lab members, not untrusted
  // input — the same trust model as the rest of the markdown pipeline.
  trust: true,
  // `strict: false` surfaces author typos (unknown command, mismatched
  // delimiter) as visible warnings in the rendered slide instead of halting
  // the build. KaTeX still emits the underlying error; the slide just keeps
  // rendering so a single typo doesn't blank the whole deck during dev.
  strict: false,
}))
