<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useSlideContext } from '@slidev/client'
import { lookupEntry, registerCitation, unregisterCitation } from '../composables/useCitations'

const props = defineProps<{ k: string }>()

const { $page } = useSlideContext()
const page = computed(() => $page.value)

const entry = computed(() => lookupEntry(props.k))

onMounted(() => registerCitation(page.value, props.k))
onBeforeUnmount(() => unregisterCitation(page.value, props.k))
</script>

<template>
  <sup class="a2i2-cite">
    <span v-if="entry">[{{ entry.num }}]</span>
    <span v-else class="a2i2-cite-missing">[?{{ k }}]</span>
  </sup>
</template>
