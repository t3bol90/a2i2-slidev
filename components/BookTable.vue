<script setup lang="ts">
defineProps<{ caption?: string; footnote?: string }>()
</script>

<template>
  <div class="a2i2-book-table">
    <p v-if="caption" class="a2i2-book-table-caption">{{ caption }}</p>
    <div class="a2i2-book-table-body">
      <slot />
    </div>
    <p v-if="footnote" class="a2i2-book-table-footnote">{{ footnote }}</p>
  </div>
</template>
