// Per-section shared counter for the theorem-like family (Theorem,
// Definition, Proposition, Lemma, Corollary, Proof, Remark, Example).
//
// The amsthm convention: a single counter runs across all 8 kinds
// within a section and resets at each new section divider — so a
// Theorem 3.1 followed by a Definition gets labelled 3.2, not 3.1.
//
// Implementation: a module-level Map<sectionNumber, Ref<uid[]>>. Each
// TheoremLike on setup registers its Vue instance UID against the
// current section's list; on unmount (or section change) it
// deregisters. Auto-derived `n` is then `list.indexOf(uid) + 1`.
//
// Reactivity: each section's list is a Vue `ref`, so a sibling
// TheoremLike's autoN `computed` re-runs when a new instance
// registers in the same section. The list is held inside refs (not
// a top-level `reactive` Map) so changes in section 3 don't
// invalidate computeds in section 4.
//
// Order: Vue assigns instance UIDs monotonically in component-
// creation order, which matches source order for static templates
// (no v-if / v-for gating). For interactive scenarios (HMR, slide
// re-mount), UIDs of fresh mounts are higher than all prior ones —
// appended-then-sorted preserves the right order without needing
// to look at DOM position.
//
// Cross-slide caveat: Slidev only mounts the current slide's
// components in interactive mode (print/export mounts all). The
// registry therefore reflects "everyone currently rendered in this
// section," not "everyone in this section across the deck." Within
// one slide and within one export run, numbering is correct; for
// authoritative cross-slide references, authors pass explicit `n`.

import { ref, type Ref } from 'vue'

const sections = new Map<number, Ref<number[]>>()

function listFor(sectionNumber: number): Ref<number[]> {
  let list = sections.get(sectionNumber)
  if (!list) {
    list = ref<number[]>([])
    sections.set(sectionNumber, list)
  }
  return list
}

export function registerTheoremLike(uid: number, sectionNumber: number): void {
  const list = listFor(sectionNumber)
  if (!list.value.includes(uid)) {
    list.value = [...list.value, uid].sort((a, b) => a - b)
  }
}

export function unregisterTheoremLike(uid: number, sectionNumber: number): void {
  const list = sections.get(sectionNumber)
  if (!list) return
  if (list.value.includes(uid)) {
    list.value = list.value.filter((id) => id !== uid)
  }
}

/**
 * 1-based position of `uid` within its section's registered list, or
 * 1 if the UID hasn't registered yet (a transient state during setup
 * before the watch callback fires).
 *
 * Reactive — reads `list.value`, so a Vue `computed` that calls this
 * will re-run when peers register/unregister in the same section.
 */
export function getTheoremIndex(uid: number, sectionNumber: number): number {
  const list = listFor(sectionNumber)
  const idx = list.value.indexOf(uid)
  return idx === -1 ? 1 : idx + 1
}

/**
 * Test helper — clears all sections. Call in `beforeEach` so registry
 * state doesn't leak across tests (monotonic UIDs from prior mounts
 * would otherwise shift positions in subsequent tests).
 */
export function __resetTheoremCounters(): void {
  sections.clear()
}
