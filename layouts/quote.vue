<script setup lang="ts">
defineProps<{
  attribution?: string
}>()
</script>

<template>
  <div class="slidev-layout a2i2-quote">
    <figure class="a2i2-quote-wrap">
      <blockquote class="a2i2-quote-text">
        <slot />
      </blockquote>
      <figcaption v-if="attribution" class="a2i2-quote-attr">
        {{ attribution }}
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.slidev-layout.a2i2-quote {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 6rem;
  background: var(--a2i2-bg);
  color: var(--a2i2-fg);
}

.a2i2-quote-wrap {
  max-width: 65ch;
  margin: 0;
}

.a2i2-quote-text {
  font-size: 1.45rem;
  font-style: italic;
  font-weight: 400;
  line-height: 1.65;
  color: var(--a2i2-secondary);
  border-left: 4px solid var(--a2i2-primary);
  padding-left: 1.5rem;
  margin: 0;
}

.a2i2-quote-attr {
  font-size: 0.95rem;
  font-weight: 500;
  font-style: normal;
  color: var(--a2i2-secondary);
  opacity: 0.65;
  margin-top: 1.5rem;
  padding-left: 1.5rem;
  text-align: right;
}
</style>
