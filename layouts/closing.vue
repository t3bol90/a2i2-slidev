<script setup lang="ts">
defineProps<{
  contact?: string
}>()
</script>

<template>
  <div class="slidev-layout a2i2-closing">
    <section class="a2i2-acks">
      <h2 class="acks-heading">Acknowledgments</h2>
      <div class="acks-body">
        <slot name="acks" />
      </div>
    </section>

    <div class="a2i2-rule" aria-hidden="true" />

    <section class="a2i2-questions">
      <h2 class="questions-heading">Questions?</h2>
      <div class="questions-body">
        <span v-if="contact" class="contact-text">{{ contact }}</span>
        <div v-if="$slots.qr" class="qr-slot">
          <slot name="qr" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.slidev-layout.a2i2-closing {
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  padding: 2.5rem 4rem;
  background: var(--a2i2-bg);
  color: var(--a2i2-fg);
}

.a2i2-acks {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}

.acks-heading {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--a2i2-primary);
  margin: 0 0 0.5rem;
}

.acks-body {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--a2i2-secondary);
  opacity: 0.85;
}

.a2i2-rule {
  height: 1px;
  background: var(--a2i2-primary);
  opacity: 0.2;
  margin: 0 -4rem;
}

.a2i2-questions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}

.questions-heading {
  font-size: 2.75rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--a2i2-fg);
  margin: 0 0 0.5rem;
}

.questions-body {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.contact-text {
  font-size: 0.9rem;
  color: var(--a2i2-secondary);
  opacity: 0.75;
}

.qr-slot {
  flex-shrink: 0;
  width: 6rem;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-slot :deep(img) {
  max-width: 6rem;
  max-height: 6rem;
  object-fit: contain;
}
</style>
