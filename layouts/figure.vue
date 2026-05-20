<script setup lang="ts">
defineProps<{
  caption?: string
  attr?: string
}>()
</script>

<template>
  <div class="slidev-layout a2i2-figure">
    <figure class="a2i2-fig-wrap">
      <div class="a2i2-fig-media">
        <slot />
      </div>
      <figcaption v-if="caption || attr" class="a2i2-fig-caption">
        <span v-if="caption" class="caption-text">{{ caption }}</span>
        <span v-if="attr" class="attr-text">{{ attr }}</span>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.slidev-layout.a2i2-figure {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 3rem 2rem;
  background: var(--a2i2-bg);
  color: var(--a2i2-fg);
}

.a2i2-fig-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 100%;
  margin: 0;
}

.a2i2-fig-media {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 65vh;
  overflow: hidden;
}

.a2i2-fig-media :deep(img) {
  max-width: 100%;
  max-height: 65vh;
  object-fit: contain;
}

.a2i2-fig-caption {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-align: center;
}

.caption-text {
  font-size: 0.85rem;
  font-style: italic;
  color: var(--a2i2-secondary);
  opacity: 0.85;
}

.attr-text {
  font-size: 0.75rem;
  color: var(--a2i2-secondary);
  opacity: 0.55;
}
</style>
