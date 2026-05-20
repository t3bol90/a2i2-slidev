<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  // S2 legacy single-author API (still supported for compat)
  author?: string
  date?: string
  // S3 multi-author API
  authors?: Array<{ name: string; affiliation?: number; presenter?: boolean }>
  affiliations?: string[]
  venue?: string
  logos?: Array<{ src: string; alt?: string }>
}>()
</script>

<template>
  <div class="slidev-layout a2i2-title">
    <div class="title-wrap">
      <h1 v-if="title" class="title-text">{{ title }}</h1>
      <div class="brand-rule" />
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>

      <template v-if="authors?.length">
        <div class="authors">
          <span v-for="(a, i) in authors" :key="i" class="author-entry"
            ><span :class="['author-name', { presenter: a.presenter }]">{{ a.name }}</span
            ><sup v-if="a.affiliation" class="aff-sup">{{ a.affiliation }}</sup
            ><span v-if="i < authors.length - 1" class="author-sep">, </span></span>
        </div>
        <div v-if="affiliations?.length" class="affiliations">
          <span v-for="(aff, i) in affiliations" :key="i" class="aff-item">
            <sup class="aff-num">{{ i + 1 }}</sup>{{ aff }}
          </span>
        </div>
        <div v-if="venue || date" class="date-venue">
          <span v-if="venue">{{ venue }}</span>
          <span v-if="venue && date" class="dot" aria-hidden="true">·</span>
          <span v-if="date">{{ date }}</span>
        </div>
      </template>

      <div v-else-if="author || date" class="meta">
        <span v-if="author" class="author">{{ author }}</span>
        <span v-if="author && date" class="dot" aria-hidden="true">·</span>
        <span v-if="date" class="date">{{ date }}</span>
      </div>

      <div class="extra">
        <slot />
      </div>
    </div>

    <div v-if="logos?.length" class="logo-strip">
      <img
        v-for="(logo, i) in logos"
        :key="i"
        :src="logo.src"
        :alt="logo.alt ?? ''"
        class="logo-img"
      />
    </div>
  </div>
</template>

<style scoped>
.slidev-layout.a2i2-title {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 4rem 4.5rem;
  background: var(--a2i2-bg);
  color: var(--a2i2-fg);
  position: relative;
}

.title-wrap {
  max-width: 70ch;
}

.title-text {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.15;
  color: var(--a2i2-primary);
  margin: 0;
}

.brand-rule {
  width: 6rem;
  height: 3px;
  margin: 0.75rem auto 1.25rem;
  background: var(--a2i2-primary);
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.3;
  color: var(--a2i2-secondary);
  margin: 0 0 1.5rem;
}

/* Multi-author */
.authors {
  font-size: 1rem;
  color: var(--a2i2-secondary);
  margin: 0 0 0.35rem;
}

.author-name.presenter {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.aff-sup {
  font-size: 0.6em;
  vertical-align: super;
  line-height: 0;
  color: var(--a2i2-primary);
}

.affiliations {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.85rem;
  color: var(--a2i2-secondary);
  opacity: 0.75;
  margin: 0 0 0.5rem;
}

.aff-num {
  font-size: 0.6em;
  vertical-align: super;
  line-height: 0;
  color: var(--a2i2-primary);
  margin-right: 0.15em;
}

.date-venue {
  font-size: 0.9rem;
  color: var(--a2i2-secondary);
  opacity: 0.8;
  margin-top: 0.5rem;
}

/* Legacy single-author */
.meta {
  font-size: 1rem;
  color: var(--a2i2-secondary);
  opacity: 0.85;
}

.dot {
  margin: 0 0.4rem;
  opacity: 0.5;
}

.extra {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: var(--a2i2-secondary);
  opacity: 0.85;
}

/* Logo strip */
.logo-strip {
  position: absolute;
  bottom: 1.5rem;
  left: 4rem;
  right: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
}

.logo-img {
  height: 2.5rem;
  width: auto;
  object-fit: contain;
}
</style>
