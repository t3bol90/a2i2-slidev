// Lets tsc treat `*.vue` imports from .test.ts files as opaque
// components. Volar/vue-tsc handles full type-checking of the .vue
// internals during dev/build via Vite; tsc only needs the imports
// to resolve so the test suites typecheck.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
