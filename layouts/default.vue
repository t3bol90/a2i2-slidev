<script setup lang="ts">
// S2 default layout — the chrome shown around every content slide.
//
// Three deck-wide cues land here (PRD §"Chrome", S2 #2 acceptance):
//   1. Top strip: the current section name, right-aligned. Sourced from the
//      most recent preceding `layout: section` slide's `title` frontmatter,
//      so authors get the strip "for free" by using section dividers.
//   2. Footer trio: author · deck title · `N / total`. Author + deck title
//      are read from headmatter (`configs.author`, `configs.title`) — a
//      rebrand or re-attribution is a one-file edit, not a per-slide sweep.
//   3. A 2px progress bar pinned to the bottom edge, width = currentSlideNo
//      / total, painted in primary color. Doubles as a presenter timer
//      proxy in the absence of a real one (which lands later, if at all).
//
// The title (#1) and section (#2) layouts have their own chrome, so the
// default layout's chrome appears only on content slides — by construction.
import { computed } from 'vue'
import { configs, useNav } from '@slidev/client'
import Footnotes from '../components/Footnotes.vue'

const { slides, currentSlideNo, total } = useNav()

// Walk back from the current slide to find the nearest preceding
// `layout: section` divider; that slide's `title` is the section label.
// Returns '' before the first section divider — the strip appears blank
// rather than guessing or showing the deck title (which would duplicate
// the footer center).
const currentSection = computed(() => {
  for (let i = currentSlideNo.value - 1; i >= 1; i--) {
    const fm = slides.value[i - 1]?.meta?.slide?.frontmatter
    if (fm?.layout === 'section') {
      return (fm.title as string | undefined) ?? ''
    }
  }
  return ''
})

const footerLeft = computed(() => (configs.author as string | undefined) ?? '')
const footerCenter = computed(() => (configs.title as string | undefined) ?? '')

// Progress bar width as a percentage. Clamped at 100% on the last slide
// and floored at 0 — Math.min/max guard against off-by-one if total
// changes between renders during HMR.
const progressPct = computed(() => {
  if (total.value <= 0) return 0
  const raw = (currentSlideNo.value / total.value) * 100
  return Math.max(0, Math.min(100, raw))
})
</script>

<template>
  <div class="slidev-layout a2i2-default">
    <div class="a2i2-top-strip">
      <span v-if="currentSection" class="section-label">{{ currentSection }}</span>
    </div>

    <main class="a2i2-content">
      <slot />
    </main>

    <Footnotes />

    <footer class="a2i2-footer">
      <span class="left">{{ footerLeft }}</span>
      <span class="center">{{ footerCenter }}</span>
      <span class="right">{{ currentSlideNo }} / {{ total }}</span>
    </footer>

    <div
      class="a2i2-progress"
      :style="{ width: `${progressPct}%` }"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.slidev-layout.a2i2-default {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  padding: 0;
  background: var(--a2i2-bg);
  color: var(--a2i2-fg);
}

.a2i2-top-strip {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 1.6rem;
  padding: 0.6rem 2.5rem 0.2rem;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--a2i2-secondary);
}

.a2i2-top-strip .section-label {
  opacity: 0.85;
}

.a2i2-top-strip .section-label::before {
  content: "";
  display: inline-block;
  width: 1.25rem;
  height: 2px;
  background: var(--a2i2-primary);
  vertical-align: middle;
  margin-right: 0.5rem;
  transform: translateY(-1px);
}

.a2i2-content {
  padding: 0.75rem 2.5rem 1rem;
  min-height: 0;
  overflow: hidden;
}

.a2i2-footer {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
  padding: 0.4rem 2.5rem 0.6rem;
  font-size: 0.75rem;
  color: var(--a2i2-secondary);
  opacity: 0.75;
}

.a2i2-footer .left {
  text-align: left;
}

.a2i2-footer .center {
  text-align: center;
  font-weight: 500;
}

.a2i2-footer .right {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.a2i2-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--a2i2-primary);
  transition: width 0.25s ease-out;
}
</style>
