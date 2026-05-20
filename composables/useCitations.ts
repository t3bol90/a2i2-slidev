// Client-side citation registry for the Cite/Footnotes component pair.
//
// Numbers are pre-assigned in bibliography.json (bib-file order) so every
// occurrence of the same key shows the same superscript — deck-global, stable.
//
// Per-slide tracking: Cite registers its (page, key) pair on mount and
// removes it on unmount. Footnotes reads the reactive map for its own page.
//
// Bibliography data is imported directly from composables/bibliography.json.
// Vite bundles it at startup; `predev`/`prebuild` ensure the file exists.
// Tests inject fixture data via __setBibData.

import { computed, ref, type ComputedRef } from 'vue'
import type { BibData, BibEntry } from '../types/bib'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — generated file; always present after predev/prebuild
import bibRaw from './bibliography.json'

let _bibData: BibData = bibRaw as BibData

// Per-slide citations: page (1-based) → insertion-ordered list of keys.
// Stored in a ref so Footnotes' computed re-runs when Cite mounts/unmounts.
const slideCitations = ref(new Map<number, string[]>())

export function registerCitation(page: number, key: string): void {
  const m = new Map(slideCitations.value)
  const list = m.get(page) ?? []
  if (!list.includes(key)) {
    m.set(page, [...list, key])
    slideCitations.value = m
  }
}

export function unregisterCitation(page: number, key: string): void {
  const m = new Map(slideCitations.value)
  const list = m.get(page)
  if (!list) return
  const next = list.filter((k) => k !== key)
  if (next.length === 0) m.delete(page)
  else m.set(page, next)
  slideCitations.value = m
}

export function lookupEntry(key: string): BibEntry | undefined {
  return _bibData.byKey[key]
}

/**
 * Returns a computed that lists all footnotes for the given slide page,
 * sorted by their pre-assigned number (bib-file order).
 */
export function useSlideFootnotes(page: ComputedRef<number>): ComputedRef<BibEntry[]> {
  return computed(() => {
    const keys = slideCitations.value.get(page.value) ?? []
    return keys
      .map((k) => _bibData.byKey[k])
      .filter((e): e is BibEntry => e !== undefined)
      .sort((a, b) => a.num - b.num)
  })
}

/** Test helper — clear all per-slide registrations. Call in beforeEach. */
export function __resetCitations(): void {
  slideCitations.value = new Map()
}

/** Test helper — inject fixture BibData without touching the filesystem. */
export function __setBibData(data: BibData): void {
  _bibData = data
}
