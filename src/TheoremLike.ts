// Internal engine for the 8-wrapper theorem family (Theorem, Definition,
// Proposition, Lemma, Corollary, Proof, Remark, Example).
//
// Implemented as a plain .ts file (not .vue SFC) so that Slidev's build plugin
// does not inject `_useSlideContext` into it. Slidev's vite-plugin-vue injection
// targets .vue SFCs; a .ts file with defineComponent uses the normal Vite
// pipeline and is exempt. The CSS lives in styles/theorem.css (global, class-
// namespaced with `.a2i2-theorem-like`).
//
// Authors don't use this directly — they reach for the thin wrappers (Theorem,
// Definition, etc.) that call `useSection()` and pass `sectionN` as a prop here.
import { computed, defineComponent, getCurrentInstance, h, onBeforeUnmount, watch } from 'vue'
import {
  getTheoremIndex,
  registerTheoremLike,
  unregisterTheoremLike,
} from '../composables/theoremCounter'

export default defineComponent({
  name: 'TheoremLike',
  props: {
    /** "Theorem" | "Definition" | "Proposition" | "Lemma" | "Corollary" | "Proof" | "Remark" | "Example" */
    kind: { type: String, required: true as const },
    name: { type: String, default: '' },
    /**
     * Explicit 1-based index override. When omitted, auto-derived from the
     * per-section shared counter. When provided, opts out of the registry.
     */
    n: { type: Number },
    /**
     * Pre-formatted label override. When set, used verbatim as the label
     * and opts out of the counter. Used by `<Proof of="X.Y">` to produce
     * "Proof of Theorem X.Y." without occupying a counter slot.
     */
    labelText: { type: String },
    /** When true, appends a QED square (□) right-aligned after the body. */
    qed: { type: Boolean, default: false },
    /**
     * Current section number from the wrapper's `useSection()` call.
     * 0 (default) = before the first section divider — bare index shown.
     */
    sectionN: { type: Number, default: 0 },
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance()
    const uid = instance?.uid ?? 0

    let registeredSection: number | null = null

    watch(
      () => [props.sectionN, props.n, props.labelText] as const,
      ([newSection, explicitN, labelTextVal]) => {
        // labelText overrides opt the instance out of the counter.
        const wantsAuto = explicitN === undefined && labelTextVal === undefined
        const sn = newSection ?? 0
        if (registeredSection !== null && (!wantsAuto || registeredSection !== sn)) {
          unregisterTheoremLike(uid, registeredSection)
          registeredSection = null
        }
        if (wantsAuto && registeredSection !== sn) {
          registerTheoremLike(uid, sn)
          registeredSection = sn
        }
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      if (registeredSection !== null) {
        unregisterTheoremLike(uid, registeredSection)
        registeredSection = null
      }
    })

    const effectiveN = computed(() => {
      if (props.n !== undefined) return props.n
      return getTheoremIndex(uid, props.sectionN ?? 0)
    })

    const label = computed(() => {
      if (props.labelText !== undefined) return props.labelText
      const s = props.sectionN ?? 0
      // Before any section divider: bare index ("Theorem 1:"). After one
      // appears: section-prefixed ("Theorem 3.2:"). Matches amsthm convention.
      const ref = s > 0 ? `${s}.${effectiveN.value}` : `${effectiveN.value}`
      const namePart = props.name ? ` (${props.name})` : ''
      return `${props.kind} ${ref}${namePart}:`
    })

    return () =>
      h('div', { class: 'a2i2-theorem-like', 'data-kind': props.kind }, [
        h('div', { class: 'label' }, label.value),
        h('div', { class: 'body' }, slots.default?.()),
        props.qed ? h('div', { class: 'qed' }, '□') : null,
      ])
  },
})
