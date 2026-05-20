<script setup lang="ts">
import { computed } from 'vue'
import { useSection } from '../composables/useSection'
import TheoremLike from '../src/TheoremLike'

const section = useSection()
const sectionN = computed(() => section.value?.number ?? 0)
defineProps<{ name?: string; n?: number }>()
</script>

<template>
  <TheoremLike kind="Definition" :section-n="sectionN" :name="name" :n="n"><slot /></TheoremLike>
</template>
