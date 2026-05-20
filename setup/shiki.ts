import { defineShikiSetup } from '@slidev/types'

// Minimal local interface — structurally compatible with @shikijs/types ThemeRegistration.
// Defined inline to avoid importing @shikijs/types directly (not a project direct-dep).
interface TokenColor {
  name?: string
  scope?: string | string[]
  settings: {
    foreground?: string
    fontStyle?: string
    background?: string
  }
}

interface ShikiTheme {
  name: string
  type: 'light' | 'dark' | 'css'
  colors?: Record<string, string>
  tokenColors?: TokenColor[]
}

// ─── A²I² light theme ───────────────────────────────────────────────────────
//
// Palette (all foreground colors pass WCAG AA ≥4.5:1 on white):
//   #C84030  brand-red (anchored on #F05A40, darkened for AA)   4.996:1
//   #0550AE  deep-blue (strings)                                 7.58:1
//   #0D5C9B  medium-blue (operators, escapes)                    6.96:1
//   #6F42C1  purple (numbers, constants, decorators)             6.51:1
//   #8B5E00  amber (types, classes, namespaces, attributes)      5.68:1
//   #344DAB  indigo (parameters)                                 7.52:1
//   #6A737D  cool-gray (comments)                                4.82:1
//   #555555  dark-gray (punctuation)                             7.46:1
//   #1A1A1A  near-black (default text, variables)               ~12:1
//
// Color-blind safety: no red-green pairings used for distinct token types.
// Keywords are red-family; strings are blue; no green anywhere.
export const a2i2LightTheme: ShikiTheme = {
  name: 'a2i2-light',
  type: 'light',
  colors: {
    'editor.background': '#FFFFFF',
    'editor.foreground': '#1A1A1A',
    'editor.lineHighlightBackground': '#F5F5F5',
    'editor.selectionBackground': '#F05A4022',
    'editorLineNumber.foreground': '#AAAAAA',
    'editorLineNumber.activeForeground': '#555555',
    'editorCursor.foreground': '#C84030',
    'editorWhitespace.foreground': '#E0E0E0',
    'editorIndentGuide.background1': '#E8E8E8',
    'editorIndentGuide.activeBackground1': '#CCCCCC',
  },
  tokenColors: [
    // Default text
    {
      scope: ['source', 'text'],
      settings: { foreground: '#1A1A1A' },
    },

    // Comments — cool-gray, italic (#6A737D: 4.82:1 ✓)
    {
      scope: [
        'comment',
        'comment.line',
        'comment.block',
        'punctuation.definition.comment',
      ],
      settings: { foreground: '#6A737D', fontStyle: 'italic' },
    },

    // Keywords + control flow — brand-red, bold (#C84030: 4.996:1 ✓)
    {
      scope: [
        'keyword',
        'keyword.control',
        'keyword.control.import',
        'keyword.control.flow',
        'keyword.control.conditional',
        'keyword.control.return',
        'keyword.control.raise',
        'keyword.control.except',
        'keyword.control.finally',
        'keyword.other',
      ],
      settings: { foreground: '#C84030', fontStyle: 'bold' },
    },

    // Storage modifiers (def, class, fn, let, const, var, async, static)
    {
      scope: ['storage.type', 'storage.modifier'],
      settings: { foreground: '#C84030', fontStyle: 'bold' },
    },

    // Python logical operators (and, or, not, in, is)
    {
      scope: ['keyword.operator.logical.python'],
      settings: { foreground: '#C84030' },
    },

    // Language variables (self, this, super) — brand family, italic
    {
      scope: ['variable.language'],
      settings: { foreground: '#C84030', fontStyle: 'italic' },
    },

    // Functions — brand family (#C84030: 4.996:1 ✓)
    {
      scope: [
        'entity.name.function',
        'support.function',
        'support.function.builtin',
        'meta.function-call.generic',
      ],
      settings: { foreground: '#C84030' },
    },

    // Strings — deep-blue (#0550AE: 7.58:1 ✓)
    {
      scope: [
        'string',
        'string.quoted',
        'string.quoted.single',
        'string.quoted.double',
        'string.quoted.triple',
        'string.template',
        'meta.fstring.python',
      ],
      settings: { foreground: '#0550AE' },
    },

    // String delimiters
    {
      scope: ['punctuation.definition.string'],
      settings: { foreground: '#0550AE' },
    },

    // Operators — medium-blue (#0D5C9B: 6.96:1 ✓)
    {
      scope: [
        'keyword.operator',
        'keyword.operator.arithmetic',
        'keyword.operator.comparison',
        'keyword.operator.assignment',
        'keyword.operator.bitwise',
      ],
      settings: { foreground: '#0D5C9B' },
    },

    // Escape sequences + regex patterns
    {
      scope: ['constant.character.escape', 'string.regexp'],
      settings: { foreground: '#0D5C9B' },
    },

    // Numbers — purple (#6F42C1: 6.51:1 ✓)
    {
      scope: [
        'constant.numeric',
        'constant.numeric.integer',
        'constant.numeric.float',
        'constant.numeric.hex',
        'constant.numeric.binary',
      ],
      settings: { foreground: '#6F42C1' },
    },

    // Language constants (True, False, None, null, undefined, true, false)
    {
      scope: [
        'constant.language',
        'constant.language.boolean',
        'constant.language.null',
        'constant.language.undefined',
      ],
      settings: { foreground: '#6F42C1', fontStyle: 'italic' },
    },

    // Decorators — purple family (#6F42C1: 6.51:1 ✓)
    {
      scope: [
        'entity.name.decorator',
        'entity.name.function.decorator',
        'meta.decorator',
        'punctuation.definition.decorator',
      ],
      settings: { foreground: '#6F42C1' },
    },

    // Types + classes — amber (#8B5E00: 5.68:1 ✓)
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'entity.other.inherited-class',
        'support.type',
        'support.class',
      ],
      settings: { foreground: '#8B5E00' },
    },

    // Namespaces + modules
    {
      scope: ['entity.name.namespace', 'storage.type.namespace'],
      settings: { foreground: '#8B5E00' },
    },

    // HTML / Vue / JSX tags
    {
      scope: ['entity.name.tag', 'meta.tag'],
      settings: { foreground: '#8B5E00' },
    },

    // HTML / Vue attributes
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: '#8B5E00' },
    },

    // JSON / YAML / CSS property names
    {
      scope: [
        'support.type.property-name',
        'support.type.property-name.css',
        'entity.name.tag.yaml',
      ],
      settings: { foreground: '#8B5E00' },
    },

    // Type annotations (Python hints, TypeScript annotations)
    {
      scope: [
        'meta.type.annotation',
        'support.type.primitive',
        'support.type.builtin',
      ],
      settings: { foreground: '#8B5E00' },
    },

    // Parameters — indigo (#344DAB: 7.52:1 ✓)
    {
      scope: ['variable.parameter', 'meta.function.parameters'],
      settings: { foreground: '#344DAB' },
    },

    // Variables — near-black (default text)
    {
      scope: ['variable', 'variable.other', 'variable.other.readwrite'],
      settings: { foreground: '#1A1A1A' },
    },

    // Punctuation — dark-gray (#555555: 7.46:1 ✓)
    {
      scope: [
        'punctuation',
        'punctuation.separator',
        'punctuation.terminator',
        'punctuation.accessor',
        'punctuation.brackets',
      ],
      settings: { foreground: '#555555' },
    },

    // Diff insertions — blue family (color-blind safe; avoids green)
    {
      scope: ['markup.inserted', 'punctuation.definition.inserted'],
      settings: { foreground: '#0550AE', background: '#E8F4FD' },
    },

    // Diff deletions — muted gray
    {
      scope: ['markup.deleted', 'punctuation.definition.deleted'],
      settings: { foreground: '#6A737D', background: '#F5F5F5' },
    },

    // Diff meta / header lines
    {
      scope: ['meta.diff.header'],
      settings: { foreground: '#6A737D', fontStyle: 'bold' },
    },

    // Markdown headings — brand family
    {
      scope: ['markup.heading', 'entity.name.section.markdown'],
      settings: { foreground: '#C84030', fontStyle: 'bold' },
    },

    // Markdown inline code
    {
      scope: ['markup.inline.raw', 'markup.raw'],
      settings: { foreground: '#C84030' },
    },

    // Markdown bold / italic (fontStyle only, no foreground override)
    { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
    { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },

    // YAML booleans + null
    {
      scope: [
        'constant.language.boolean.yaml',
        'constant.language.null.yaml',
      ],
      settings: { foreground: '#6F42C1', fontStyle: 'italic' },
    },

    // Bash / shell variables and builtins
    {
      scope: [
        'variable.other.normal.bash',
        'support.function.builtin.bash',
      ],
      settings: { foreground: '#344DAB' },
    },
  ],
}

// ─── Shiki setup ────────────────────────────────────────────────────────────
//
// The ShikiContext arg is unused but required by the ShikiSetup signature.
// `themes.light` receives the hand-tuned theme object above. Registering
// only the languages the template deck actually uses keeps the highlight
// bundle lean; add entries here when new languages appear in slides.
export default defineShikiSetup((_shiki) => ({
  // The ShikiTheme object is structurally compatible with ThemeRegistrationAny.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  themes: { light: a2i2LightTheme as any },
  langs: ['python', 'typescript', 'vue', 'bash', 'json', 'yaml', 'diff'],
}))
