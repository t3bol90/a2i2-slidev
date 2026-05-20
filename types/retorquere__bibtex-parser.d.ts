// Minimal ambient declarations for @retorquere/bibtex-parser@10.x
// The package ships "types": "./dist/types/index.d.ts" but that directory
// is absent in the published tarball. These stubs cover the surface used
// by scripts/build-bib.ts.

declare module '@retorquere/bibtex-parser' {
  interface ParseOptions {
    errorHandler?: (err: unknown) => void
    [key: string]: unknown
  }

  interface CreatorEntry {
    lastName?: string
    firstName?: string
    [key: string]: unknown
  }

  type FieldValue = string | string[] | CreatorEntry[] | unknown

  interface BibEntry {
    type: string
    key: string
    fields: Record<string, FieldValue>
    input: string
    [key: string]: unknown
  }

  interface ParseResult {
    entries: BibEntry[]
    errors?: unknown[]
  }

  export function parse(text: string, options?: ParseOptions): ParseResult
}
