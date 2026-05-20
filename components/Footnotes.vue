<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import { useSlideFootnotes } from '../composables/useCitations'

const { $page } = useSlideContext()
const page = computed(() => $page.value)

const footnotes = useSlideFootnotes(page)
</script>

<template>
  <div v-if="footnotes.length > 0" class="a2i2-footnotes">
    <div v-for="entry in footnotes" :key="entry.key" class="a2i2-footnote">
      <span class="a2i2-footnote-num">[{{ entry.num }}]</span>
      <span class="a2i2-footnote-body">
        {{ entry.author }}. {{ entry.title }}<span v-if="entry.venue">, <em>{{ entry.venue }}</em></span><span
          v-if="entry.year"
        >, {{ entry.year }}</span>.
      </span>
    </div>
  </div>
</template>
