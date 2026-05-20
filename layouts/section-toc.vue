<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { slides, currentSlideNo } = useNav()

interface SectionItem {
  no: number
  number: string | number | undefined
  title: string | undefined
}

const sections = computed<SectionItem[]>(() => {
  return slides.value
    .filter(s => s.meta?.slide?.frontmatter?.layout === 'section')
    .map(s => ({
      no: s.no as number,
      number: s.meta?.slide?.frontmatter?.number as string | number | undefined,
      title: s.meta?.slide?.frontmatter?.title as string | undefined,
    }))
})

// Walk back from the current slide to find the nearest preceding section divider.
// The section-toc slide itself is "between" sections, so the active section
// is the one most recently passed — i.e. the section the audience just left
// or is now entering.
const activeSectionNo = computed(() => {
  let last = 0
  for (const s of slides.value) {
    if ((s.no as number) > currentSlideNo.value) break
    if (s.meta?.slide?.frontmatter?.layout === 'section') {
      last = s.no as number
    }
  }
  return last
})
</script>

<template>
  <div class="slidev-layout a2i2-section-toc">
    <div class="toc-wrap">
      <p class="toc-eyebrow">Outline</p>
      <ol class="toc-list">
        <li
          v-for="sec in sections"
          :key="sec.no"
          class="toc-item"
          :class="{ 'is-active': sec.no === activeSectionNo }"
        >
          <span v-if="sec.number !== undefined" class="toc-num">{{ sec.number }}</span>
          <span class="toc-title">{{ sec.title }}</span>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.slidev-layout.a2i2-section-toc {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 5rem;
  background: var(--a2i2-bg);
  color: var(--a2i2-fg);
}

.toc-wrap {
  width: 100%;
  max-width: 60ch;
}

.toc-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--a2i2-secondary);
  opacity: 0.4;
  margin: 0 0 1.5rem;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.toc-item {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--a2i2-secondary);
  opacity: 0.35;
  transition: opacity 0.2s;
}

.toc-item.is-active {
  opacity: 1;
  color: var(--a2i2-fg);
}

.toc-num {
  font-size: 0.85em;
  font-weight: 700;
  color: var(--a2i2-secondary);
  min-width: 1.5rem;
}

.toc-item.is-active .toc-num {
  color: var(--a2i2-primary);
}
</style>
