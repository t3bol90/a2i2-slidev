<script setup lang="ts">
// S2 section-divider layout — full-bleed primary-color slide with the
// section number and title (PRD US #17). Frontmatter keys map 1:1 to
// defineProps per Slidev's layout convention.
//
//   ---
//   layout: section
//   number: 1
//   title: Foundations
//   ---
//
// `number` is a string so authors can use roman numerals or letters
// later without an API break; the layout pads numeric values visually
// via CSS, not by coercing to int here.
const props = defineProps<{
  number?: string | number
  subtitle?: string
  frontmatter?: Record<string, any>
}>()
</script>

<template>
  <div class="slidev-layout a2i2-section">
    <div class="section-wrap">
      <header v-if="frontmatter?.title" class="section-head">
        <span v-if="number !== undefined && number !== ''" class="section-number">{{ number }}</span>
        <span v-if="number !== undefined && number !== ''" class="section-dash" aria-hidden="true">—</span>
        <div role="heading" aria-level="1" class="section-title">{{ frontmatter?.title }}</div>
      </header>
      <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
      <div class="extra">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.slidev-layout.a2i2-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 3rem 4rem;
  background: var(--a2i2-primary);
  color: #ffffff;
}

.section-wrap {
  max-width: 70ch;
}

.section-head {
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.section-number {
  font-size: 1rem;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  opacity: 0.65;
  letter-spacing: 0.05em;
  flex: 0 0 auto;
}

.section-dash {
  font-size: 1rem;
  opacity: 0.5;
  flex: 0 0 auto;
}

.section-title {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1.05;
  color: #ffffff;
  margin: 0;
  flex: 1 1 auto;
  min-width: 0;
}

.section-subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.3;
  color: var(--a2i2-primary-light);
  margin: 1rem 0 0;
}

.extra {
  margin-top: 2rem;
  font-size: 0.95rem;
  opacity: 0.9;
}
</style>
