<script setup lang="ts">
const show = import.meta.env.DEV || !!import.meta.env.SLIDEV_DRAFT
</script>

<template>
  <span v-if="show" class="a2i2-todo"><slot /></span>
</template>

<style scoped>
.a2i2-todo {
  color: maroon;
  font-style: italic;
}
</style>
