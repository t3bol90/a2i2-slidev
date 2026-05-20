<script setup lang="ts">
// Proof wrapper — special-cases the `of` prop to produce
// "Proof of Theorem X.Y." labels and opt out of the counter.
// Without `of`, behaves like any other theorem-like wrapper
// and participates in the shared per-section counter.
import { computed } from 'vue'
import { useSection } from '../composables/useSection'
import TheoremLike from '../src/TheoremLike'

const section = useSection()
const sectionN = computed(() => section.value?.number ?? 0)

const props = withDefaults(
  defineProps<{
    /** Reference string, e.g. "3.2". Produces "Proof of Theorem 3.2." and opts out of counter. */
    of?: string
    name?: string
    n?: number
    /** Show QED square (□) at end. Defaults true for proofs. */
    qed?: boolean
  }>(),
  { qed: true },
)

const labelText = computed(() =>
  props.of !== undefined ? `Proof of Theorem ${props.of}.` : undefined,
)
</script>

<template>
  <TheoremLike
    kind="Proof"
    :section-n="sectionN"
    :label-text="labelText"
    :name="name"
    :n="n"
    :qed="qed"
  >
    <slot />
  </TheoremLike>
</template>
