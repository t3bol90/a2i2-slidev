// Vitest config for S5+ component tests.
//
// Two non-default knobs:
//
// 1. `environment: 'happy-dom'` — needed for @vue/test-utils' `mount()`,
//    which renders into a DOM. happy-dom over jsdom because it's ~3×
//    faster on small fixtures and brings fewer transitive deps.
//    Per-file overrides (e.g. `// @vitest-environment node`) are
//    available if a pure-function suite proves to be the bottleneck,
//    but the pure-helper suites (tests/useSection.test.ts) run fine
//    under happy-dom — only ~30ms overhead per file.
//
// 2. `alias: { '@slidev/client': <mock> }` — Slidev's client is
//    published as TS source and depends on `#slidev/*` virtual modules
//    that only Vite resolves at dev/build time. vitest can't run that
//    closure in node, so we redirect imports to a hand-written mock
//    that exposes the surface our composables actually use (`useNav`,
//    `configs`). Tests drive the mock state via the `__setMockNav`
//    helper exposed from the same file.
//
// 3. `plugins: [vue()]` — vitest's underlying Vite needs the official
//    Vue plugin to parse `<script setup>` / `<template>` / scoped CSS
//    inside `.vue` files. Without it, vite:import-analysis sees the
//    raw SFC as invalid JS and the test run fails before any test
//    body runs.

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    alias: {
      '@slidev/client': fileURLToPath(
        new URL('./tests/__mocks__/slidev-client.ts', import.meta.url),
      ),
    },
  },
})
