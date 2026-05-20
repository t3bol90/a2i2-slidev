// Per-section numbering primitive for S5's theorem engine.
//
// Counts `layout: section` dividers rather than reading the author-
// supplied `number` so a missing or out-of-sequence value in a
// divider's frontmatter can't desync the theorem counter from the
// audience's mental model of "we're in section 3 now."
//
// Exposes two surfaces:
//   • `computeSection(frontmatters, currentSlideNo)` — pure helper,
//     unit-testable in plain node with fixture arrays. The component
//     test for `<TheoremLike>` drives this through the reactive
//     wrapper below by mocking `@slidev/client`.
//   • `useSection()` — Slidev-runtime reactive wrapper. Reads the
//     live `useNav()` slides + currentSlideNo and re-derives section
//     info as the audience advances. The TheoremLike component
//     (S5 part 2) is the first consumer; the section-toc layout
//     (S9) is the next.

import { computed, type ComputedRef } from 'vue'
import { useNav } from '@slidev/client'

export interface SectionInfo {
  /** 1-based count of `layout: section` dividers at or before the current slide. */
  number: number
  /** `title` field from the most recent section divider's frontmatter. */
  title: string
}

type FrontmatterLike = Record<string, unknown> | undefined

/**
 * Pure: given an ordered list of slide frontmatters and a 1-based
 * current-slide index, return the section the current slide is in,
 * or null if no section divider has appeared yet.
 *
 * Exported separately from the composable so the unit tests can drive
 * it with plain fixtures — no Vue reactivity, no Slidev runtime mock.
 */
export function computeSection(
  frontmatters: ReadonlyArray<FrontmatterLike>,
  currentSlideNo: number,
): SectionInfo | null {
  let number = 0
  let title = ''
  const upper = Math.min(Math.max(0, currentSlideNo), frontmatters.length)
  for (let i = 0; i < upper; i++) {
    const fm = frontmatters[i]
    if (fm && fm.layout === 'section') {
      number += 1
      title = typeof fm.title === 'string' ? fm.title : ''
    }
  }
  return number === 0 ? null : { number, title }
}

/**
 * Reactive: bind `computeSection` to Slidev's live nav state. Returns
 * a ComputedRef that updates whenever the audience advances slides or
 * the deck is HMR'd.
 *
 * The frontmatter accessor `meta?.slide?.frontmatter` matches the path
 * used by `layouts/default.vue` (the top-strip section label uses the
 * same shape). `SlideRoute.meta` is typed as
 * `RouteMeta & Required<Pick<RouteMeta, 'slide'>>` in @slidev/types,
 * so the `?.` chain guards against transient HMR states only.
 */
export function useSection(): ComputedRef<SectionInfo | null> {
  const { slides, currentSlideNo } = useNav()
  return computed(() => {
    const frontmatters = slides.value.map((s) => {
      const fm = s.meta?.slide?.frontmatter
      return fm as Record<string, unknown> | undefined
    })
    return computeSection(frontmatters, currentSlideNo.value)
  })
}
