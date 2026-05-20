<script setup lang="ts">
defineProps<{
  captionLeft?: string
  captionRight?: string
  caption?: string
}>()
</script>

<template>
  <div class="slidev-layout a2i2-figure-side">
    <div class="a2i2-fig-pair">
      <figure class="a2i2-fig-item">
        <div class="a2i2-fig-media">
          <slot name="left" />
        </div>
        <figcaption class="a2i2-fig-sub">
          <span class="sub-label">(a)</span>
          <span v-if="captionLeft" class="sub-text">{{ captionLeft }}</span>
        </figcaption>
      </figure>
      <figure class="a2i2-fig-item">
        <div class="a2i2-fig-media">
          <slot name="right" />
        </div>
        <figcaption class="a2i2-fig-sub">
          <span class="sub-label">(b)</span>
          <span v-if="captionRight" class="sub-text">{{ captionRight }}</span>
        </figcaption>
      </figure>
    </div>
    <p v-if="caption" class="a2i2-fig-main-caption">{{ caption }}</p>
  </div>
</template>

<style scoped>
.slidev-layout.a2i2-figure-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 3rem 2rem;
  background: var(--a2i2-bg);
  color: var(--a2i2-fg);
  gap: 0.75rem;
}

.a2i2-fig-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  width: 100%;
}

.a2i2-fig-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.a2i2-fig-media {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 55vh;
  overflow: hidden;
  width: 100%;
}

.a2i2-fig-media :deep(img) {
  max-width: 100%;
  max-height: 55vh;
  object-fit: contain;
}

.a2i2-fig-sub {
  display: flex;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-style: italic;
  color: var(--a2i2-secondary);
  opacity: 0.85;
  text-align: center;
}

.sub-label {
  font-weight: 600;
  font-style: normal;
  opacity: 0.7;
}

.a2i2-fig-main-caption {
  font-size: 0.85rem;
  font-style: italic;
  color: var(--a2i2-secondary);
  opacity: 0.85;
  text-align: center;
  margin: 0;
}
</style>
