<script setup lang="ts">
withDefaults(defineProps<{
  cols?: string
}>(), {
  cols: '1fr 1fr',
})
</script>

<template>
  <div class="slidev-layout a2i2-two-col">
    <div class="a2i2-cols" :style="{ gridTemplateColumns: cols }">
      <div class="a2i2-col">
        <slot name="left" />
      </div>
      <div class="a2i2-col">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.slidev-layout.a2i2-two-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem 2.5rem;
  background: var(--a2i2-bg);
  color: var(--a2i2-fg);
}

.a2i2-cols {
  display: grid;
  gap: 2.5rem;
  align-items: start;
}

.a2i2-col {
  min-width: 0;
}
</style>
