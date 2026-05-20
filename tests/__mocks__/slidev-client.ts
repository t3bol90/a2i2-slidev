// Hand-written mock for `@slidev/client`, wired in via vitest.config.ts's
// `alias` map. Exposes the slice of the Slidev runtime our composables
// touch (currently `useNav` for section detection, and `configs` for any
// later consumer like a footer/title composable).
//
// Tests drive the mock state with `__setMockNav(...)` — call it in a
// `beforeEach` to set up the slide list and current position the
// component-under-test should see.
//
// The real `useNav()` returns ~30 fields (see SlidevContextNav in
// @slidev/client/composables/useNav.ts). We only emit the four our
// production code consumes today (`slides`, `currentSlideNo`, `total`,
// and `currentSlideRoute`). Add more here when a new composable lands
// that needs them — keeping the surface narrow makes the mock easy
// to reason about and means a typo in a test surfaces as a real
// TypeScript error, not a silent `undefined`.

import { computed, ref, type ComputedRef, type Ref } from 'vue'

type FrontmatterLike = Record<string, unknown>

interface MockSlideRoute {
  no: number
  meta: {
    slide: {
      frontmatter: FrontmatterLike
    }
  }
}

const _slides = ref<MockSlideRoute[]>([])
const _currentSlideNo = ref(1)

export function useNav(): {
  slides: Ref<MockSlideRoute[]>
  currentSlideNo: ComputedRef<number>
  total: ComputedRef<number>
} {
  return {
    slides: _slides,
    currentSlideNo: computed(() => _currentSlideNo.value),
    total: computed(() => _slides.value.length),
  }
}

export const configs: Record<string, unknown> = {}

/**
 * Test helper: replace the mock nav state. Pass the slide frontmatters
 * the component-under-test should see (in source order) and the 1-based
 * current slide index.
 *
 * Example:
 *   __setMockNav({
 *     slides: [{ layout: 'section', title: 'Causal Inference' }],
 *     currentSlideNo: 1,
 *   })
 */
export function __setMockNav(opts: {
  slides: ReadonlyArray<FrontmatterLike>
  currentSlideNo: number
}): void {
  _slides.value = opts.slides.map((frontmatter, i) => ({
    no: i + 1,
    meta: { slide: { frontmatter } },
  }))
  _currentSlideNo.value = opts.currentSlideNo
}
