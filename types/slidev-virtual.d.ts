// Ambient declarations for Slidev's `#slidev/*` virtual modules — needed
// so `tsc --noEmit` can resolve `import { useNav, configs } from '@slidev/client'`
// in our composables. Slidev's own client source imports `#slidev/configs`,
// `#slidev/slides`, etc., and tsc has to follow the import graph to extract
// `useNav`'s return type.
//
// The minimal set lives here rather than wiring `@slidev/types/client.d.ts`
// in directly because:
//   1. that file declares ~12 virtual modules including Monaco/Mermaid/shiki
//      setup hooks we don't need — pulling all of them in widens our ambient
//      surface for no benefit;
//   2. node_modules paths can't be reliably included in tsconfig (`exclude`
//      defaults shadow it), so a local copy of just the modules our code
//      transitively touches is the durable shape.
//
// If a future composable needs another `#slidev/*` module (mermaid setup
// from S?, code-runners from a future slice), add the declaration here.
// Source of truth: node_modules/@slidev/types/client.d.ts.

// Ambient declaration for `@slidev/client` itself. The package is
// published as TS source (`exports: { ".": "./index.ts" }`) and pnpm
// only hoists it transitively through `@slidev/cli` — it's not under
// `node_modules/@slidev/` at the top level, so plain tsc can't resolve
// it via package-name lookup. Slidev's own Vite resolves it fine at
// dev/build time (matching the layouts in `layouts/default.vue`), and
// vitest gets a hand-written mock via `tests/__mocks__/slidev-client.ts`
// aliased in `vitest.config.ts` — so a hand-written ambient surface
// here covers only what tsc needs (the production import shape).
//
// Add an export here whenever a composable starts touching a new field
// of `useNav()` or a new function from the client surface. The full
// `SlidevContextNav` interface lives at
// node_modules/.pnpm/@slidev+client@*/node_modules/@slidev/client/
//   composables/useNav.ts.
declare module '@slidev/client' {
  import type { Ref, ComputedRef } from 'vue'
  import type { SlideRoute } from '@slidev/types'

  export function useNav(): {
    slides: Ref<SlideRoute[]>
    currentSlideNo: ComputedRef<number>
    total: ComputedRef<number>
  }

  export const configs: Record<string, unknown>
}

// Mirror @slidev/client/shim-vue.d.ts's RouteMeta augmentation so
// `SlideRoute.meta.slide.frontmatter` is properly typed at tsc time.
// Slidev's own shim isn't reachable through our typed surface because
// we don't pull in @slidev/client source — we just declare the public
// API above. Without this augmentation, `meta.slide` collapses to `{}`
// and the composable can't read `.frontmatter`.
declare module 'vue-router' {
  import type { SlideInfo } from '@slidev/types'

  interface RouteMeta {
    layout?: string
    name?: string
    class?: string
    clicks?: number
    preload?: boolean

    slide?: Omit<SlideInfo, 'source'> & {
      noteHTML: string
      filepath: string
      start: number
      id: number
      no: number
    }
  }
}

declare module '#slidev/configs' {
  import type { SlidevConfig } from '@slidev/types'

  const configs: SlidevConfig & { slidesTitle: string }
  export default configs
}

declare module '#slidev/slides' {
  import type { SlideRoute } from '@slidev/types'
  import type { ShallowRef } from 'vue'

  const slides: ShallowRef<SlideRoute[]>
  export { slides }
}

// Vite-injected build-mode flag used by @slidev/client/env.ts. Slidev's
// own tsconfig declares this through `vite/client` types; we declare it
// inline so we don't have to pull `vite/client` into our `types` array
// (which would also pull `ImportMeta` augmentations we don't need).
declare const __DEV__: boolean
