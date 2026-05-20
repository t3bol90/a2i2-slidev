import { defineConfig } from 'vite'

// Expose SLIDEV_* env vars (e.g. SLIDEV_DRAFT=1) to import.meta.env without
// the VITE_ prefix. Slidev's own Vite config already handles VITE_* — this
// merges cleanly via Vite's config merge.
export default defineConfig({
  envPrefix: ['VITE_', 'SLIDEV_'],
})
