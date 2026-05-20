// Pre-build script: parse bibliography.bib → composables/bibliography.json
//
// Numbers entries in bib-file order (1-based). Numbering is baked into
// the JSON so the client never needs a runtime counter — same key always
// renders the same superscript across all slides.
//
// Run via `tsx scripts/build-bib.ts` (wired as predev + prebuild in
// package.json so it fires automatically before every dev/build).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from '@retorquere/bibtex-parser'
import type { BibData, BibEntry } from '../types/bib'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Pure: parse raw BibTeX text into a BibData object.
 * Exported for unit tests — no filesystem side-effects.
 */
export function parseBibText(bibText: string): BibData {
  const result = parse(bibText, { errorHandler: () => {} })
  const byKey: Record<string, BibEntry> = {}
  let num = 1

  for (const entry of result.entries) {
    const f = entry.fields

    // author: array of { lastName, firstName? } objects → "Last et al."
    const authorRaw = f.author
    const author = Array.isArray(authorRaw)
      ? authorRaw.map((a: Record<string, string>) => a.lastName ?? '').join(', ')
      : typeof authorRaw === 'string'
        ? authorRaw
        : ''

    const title = typeof f.title === 'string' ? f.title : ''

    const rawPublisher = f.publisher
    const publisher = Array.isArray(rawPublisher)
      ? (rawPublisher as string[]).join(', ')
      : typeof rawPublisher === 'string'
        ? rawPublisher
        : undefined

    const venue =
      typeof f.journal === 'string'
        ? f.journal
        : typeof f.booktitle === 'string'
          ? f.booktitle
          : publisher

    const year =
      typeof f.year === 'string'
        ? f.year
        : typeof f.date === 'string'
          ? f.date.slice(0, 4)
          : undefined

    byKey[entry.key] = { key: entry.key, title, author, year, venue, type: entry.type, num: num++ }
  }

  return { byKey }
}

// CLI entry-point (not called during tests)
const bibText = readFileSync(join(root, 'bibliography.bib'), 'utf8')
const data = parseBibText(bibText)

mkdirSync(join(root, 'composables'), { recursive: true })
writeFileSync(join(root, 'composables', 'bibliography.json'), JSON.stringify(data, null, 2))
console.log(`[build-bib] wrote ${Object.keys(data.byKey).length} entries → composables/bibliography.json`)
