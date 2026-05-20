import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import TheoremLike from '../src/TheoremLike'
import Theorem from '../components/Theorem.vue'
import Definition from '../components/Definition.vue'
import Proof from '../components/Proof.vue'
import { __setMockNav } from './__mocks__/slidev-client'
import { __resetTheoremCounters } from '../composables/theoremCounter'

// Auto-unmount every wrapper produced by `mount()` at the end of each
// test. Without this, mounted components survive into the next test
// and their `watch(sectionN, …)` callbacks fire when state changes —
// re-registering UIDs after `__resetTheoremCounters()`.
enableAutoUnmount(afterEach)

describe('TheoremLike', () => {
  beforeEach(() => {
    __resetTheoremCounters()
  })

  it('renders kind + section number + index + name in label', () => {
    const wrapper = mount(TheoremLike, {
      props: { kind: 'Theorem', sectionN: 3, name: 'Front-Door Identification', n: 2 },
      slots: { default: 'Given the mediation DAG, the interventional distribution satisfies the identity.' },
    })
    expect(wrapper.find('.label').text()).toBe('Theorem 3.2 (Front-Door Identification):')
    expect(wrapper.find('.body').text()).toContain('Given the mediation DAG')
  })

  it('omits the parenthesised name when no name is given', () => {
    const wrapper = mount(TheoremLike, {
      props: { kind: 'Lemma', sectionN: 1, n: 1 },
      slots: { default: 'Body.' },
    })
    expect(wrapper.find('.label').text()).toBe('Lemma 1.1:')
  })

  it('falls back to bare index before the first section divider (sectionN=0)', () => {
    const wrapper = mount(TheoremLike, {
      props: { kind: 'Definition', sectionN: 0, n: 1 },
      slots: { default: 'A.' },
    })
    expect(wrapper.find('.label').text()).toBe('Definition 1:')
  })

  it('auto-derives n=1 for a lone instance in a section when n is omitted', () => {
    const wrapper = mount(TheoremLike, {
      props: { kind: 'Proposition', sectionN: 1 },
      slots: { default: 'B.' },
    })
    expect(wrapper.find('.label').text()).toBe('Proposition 1.1:')
  })

  it('exposes data-kind attribute on the root for downstream styling', () => {
    const wrapper = mount(TheoremLike, {
      props: { kind: 'Corollary' },
      slots: { default: 'Body.' },
    })
    expect(wrapper.attributes('data-kind')).toBe('Corollary')
  })
})

describe('TheoremLike — shared per-section counter (S5 part 3)', () => {
  beforeEach(() => {
    __resetTheoremCounters()
  })

  it('mixed kinds in the same section share a counter (Theorem→Definition→Proof become .1/.2/.3)', () => {
    // A wrapper component lets us mount three theorem-likes as siblings
    // with deterministic source order (mount order = Vue UID order = registry order).
    const Stage = defineComponent({
      render() {
        return h('div', [
          h(TheoremLike, { kind: 'Theorem', sectionN: 1 }, { default: () => 'T body' }),
          h(TheoremLike, { kind: 'Definition', sectionN: 1 }, { default: () => 'D body' }),
          h(TheoremLike, { kind: 'Proof', sectionN: 1 }, { default: () => 'P body' }),
        ])
      },
    })
    const wrapper = mount(Stage)
    const labels = wrapper.findAll('.label').map((n) => n.text())
    expect(labels).toEqual([
      'Theorem 1.1:',
      'Definition 1.2:',
      'Proof 1.3:',
    ])
  })

  it('explicit n overrides auto-numbering and opts out of the registry', () => {
    // Author pins the middle theorem to 7; surrounding auto-numbered theorems
    // take consecutive registry slots (1 and 2), unaffected by the override.
    const Stage = defineComponent({
      render() {
        return h('div', [
          h(TheoremLike, { kind: 'Theorem', sectionN: 1 }, { default: () => 'A' }),
          h(TheoremLike, { kind: 'Theorem', sectionN: 1, n: 7 }, { default: () => 'B' }),
          h(TheoremLike, { kind: 'Definition', sectionN: 1 }, { default: () => 'C' }),
        ])
      },
    })
    const wrapper = mount(Stage)
    const labels = wrapper.findAll('.label').map((n) => n.text())
    expect(labels).toEqual([
      'Theorem 1.1:',
      'Theorem 1.7:',
      'Definition 1.2:',
    ])
  })

  it('unmounting an auto-numbered instance frees its registry slot', async () => {
    const a = mount(TheoremLike, { props: { kind: 'Theorem', sectionN: 1 }, slots: { default: 'A' } })
    const b = mount(TheoremLike, { props: { kind: 'Definition', sectionN: 1 }, slots: { default: 'B' } })
    expect(a.find('.label').text()).toBe('Theorem 1.1:')
    expect(b.find('.label').text()).toBe('Definition 1.2:')
    a.unmount()
    // After A unmounts, B should shift down to position 1 in section 1.
    await b.vm.$nextTick()
    expect(b.find('.label').text()).toBe('Definition 1.1:')
  })
})

describe('Theorem (wrapper)', () => {
  beforeEach(() => {
    __setMockNav({ slides: [], currentSlideNo: 1 })
    __resetTheoremCounters()
  })

  it('forwards name + n to TheoremLike with kind="Theorem"', () => {
    __setMockNav({
      slides: [{ layout: 'section', title: 'Front-Door' }],
      currentSlideNo: 1,
    })
    const wrapper = mount(Theorem, {
      props: { name: 'Identification', n: 3 },
      slots: { default: 'Body.' },
    })
    expect(wrapper.attributes('data-kind')).toBe('Theorem')
    expect(wrapper.find('.label').text()).toBe('Theorem 1.3 (Identification):')
  })
})

describe('Definition (wrapper)', () => {
  beforeEach(() => {
    __setMockNav({ slides: [], currentSlideNo: 1 })
    __resetTheoremCounters()
  })

  it('forwards name + n to TheoremLike with kind="Definition"', () => {
    __setMockNav({
      slides: [{ layout: 'section', title: 'Causal Graph' }],
      currentSlideNo: 1,
    })
    const wrapper = mount(Definition, {
      props: { name: 'DAG', n: 1 },
      slots: { default: 'A directed acyclic graph.' },
    })
    expect(wrapper.attributes('data-kind')).toBe('Definition')
    expect(wrapper.find('.label').text()).toBe('Definition 1.1 (DAG):')
  })

  it('participates in the shared per-section counter alongside other kinds', () => {
    __setMockNav({
      slides: [{ layout: 'section', title: 'Causal Graph' }],
      currentSlideNo: 1,
    })
    const Stage = defineComponent({
      render() {
        return h('div', [
          h(Theorem, {}, { default: () => 'T' }),
          h(Definition, {}, { default: () => 'D' }),
        ])
      },
    })
    const wrapper = mount(Stage)
    const labels = wrapper.findAll('.label').map((n) => n.text())
    expect(labels).toEqual(['Theorem 1.1:', 'Definition 1.2:'])
  })
})

describe('Proof (wrapper)', () => {
  beforeEach(() => {
    __setMockNav({ slides: [], currentSlideNo: 1 })
    __resetTheoremCounters()
  })

  it('with `of` renders "Proof of Theorem X.Y." label and opts out of counter', () => {
    __setMockNav({
      slides: [{ layout: 'section', title: 'Mediation' }],
      currentSlideNo: 1,
    })
    // The Theorem registers as .1; Proof with `of` does NOT register
    // so the Definition gets .2, not .3.
    const Stage = defineComponent({
      render() {
        return h('div', [
          h(Theorem, {}, { default: () => 'T body' }),
          h(Proof, { of: '1.1' }, { default: () => 'P body' }),
          h(Definition, {}, { default: () => 'D body' }),
        ])
      },
    })
    const wrapper = mount(Stage)
    const labels = wrapper.findAll('.label').map((n) => n.text())
    expect(labels).toEqual([
      'Theorem 1.1:',
      'Proof of Theorem 1.1.',
      'Definition 1.2:',
    ])
  })

  it('without `of` participates in the counter as kind="Proof"', () => {
    __setMockNav({
      slides: [{ layout: 'section', title: 'A' }],
      currentSlideNo: 1,
    })
    const wrapper = mount(Proof, { slots: { default: 'Body.' } })
    expect(wrapper.attributes('data-kind')).toBe('Proof')
    expect(wrapper.find('.label').text()).toBe('Proof 1.1:')
  })

  it('shows QED square by default', () => {
    const wrapper = mount(Proof, { slots: { default: 'Body.' } })
    expect(wrapper.find('.qed').exists()).toBe(true)
    expect(wrapper.find('.qed').text()).toBe('□')
  })

  it('hides QED square when qed=false', () => {
    const wrapper = mount(Proof, {
      props: { qed: false },
      slots: { default: 'Body.' },
    })
    expect(wrapper.find('.qed').exists()).toBe(false)
  })
})
