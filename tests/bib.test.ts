// @vitest-environment node
// Parser tests run in plain node (no DOM needed).

import { describe, it, expect, beforeEach } from 'vitest'
import { parseBibText } from '../scripts/build-bib'
import {
  registerCitation,
  unregisterCitation,
  useSlideFootnotes,
  __resetCitations,
  __setBibData,
} from '../composables/useCitations'
import { computed, ref } from 'vue'

// ---------------------------------------------------------------------------
// Parser unit tests
// ---------------------------------------------------------------------------

describe('parseBibText', () => {
  it('parses @article with title / author / journal / year', () => {
    const bib = `@article{smith2020test,
      title={A Great Paper},
      author={Smith et al.,},
      journal={JASA},
      year={2020},
    }`
    const data = parseBibText(bib)
    const e = data.byKey['smith2020test']
    expect(e).toBeDefined()
    expect(e.title).toBe('A great paper')
    expect(e.author).toBe('Smith et al.')
    expect(e.venue).toBe('JASA')
    expect(e.year).toBe('2020')
    expect(e.type).toBe('article')
    expect(e.num).toBe(1)
  })

  it('parses @inproceedings with booktitle', () => {
    const bib = `@inproceedings{jones2019conf,
      title={Conference Contribution},
      author={Jones, Alice},
      booktitle={ICASSP},
      year={2019},
    }`
    const data = parseBibText(bib)
    const e = data.byKey['jones2019conf']
    expect(e.venue).toBe('ICASSP')
    expect(e.type).toBe('inproceedings')
  })

  it('parses @book with publisher as venue fallback', () => {
    const bib = `@book{knuth1984book,
      title={The TeXbook},
      author={Knuth, Donald},
      year={1984},
      publisher={Addison-Wesley},
    }`
    const data = parseBibText(bib)
    const e = data.byKey['knuth1984book']
    expect(e.venue).toBe('Addison-Wesley')
    expect(e.type).toBe('book')
  })

  it('assigns sequential 1-based nums in bib-file order', () => {
    const bib = `@article{a_key, title={First}, author={A}, journal={J}, year={2001}}
    @article{b_key, title={Second}, author={B}, journal={J}, year={2002}}
    @article{c_key, title={Third}, author={C}, journal={J}, year={2003}}`
    const data = parseBibText(bib)
    expect(data.byKey['a_key'].num).toBe(1)
    expect(data.byKey['b_key'].num).toBe(2)
    expect(data.byKey['c_key'].num).toBe(3)
  })

  it('falls back to `date` field for year when `year` is absent', () => {
    const bib = `@article{dated2021,
      title={Dated Entry},
      author={Author, A},
      journal={J},
      date={2021},
    }`
    const data = parseBibText(bib)
    expect(data.byKey['dated2021'].year).toBe('2021')
  })
})

// ---------------------------------------------------------------------------
// Citation registry + useSlideFootnotes
// ---------------------------------------------------------------------------

const FIXTURE: import('../types/bib').BibData = {
  byKey: {
    alpha: { key: 'alpha', title: 'Alpha Paper', author: 'Smith', year: '2020', venue: 'JASA', type: 'article', num: 1 },
    beta:  { key: 'beta',  title: 'Beta Paper',  author: 'Jones', year: '2021', venue: 'ICASSP', type: 'inproceedings', num: 2 },
    gamma: { key: 'gamma', title: 'Gamma Paper', author: 'Lee',   year: '2022', venue: 'NeurIPS', type: 'inproceedings', num: 3 },
  },
}

describe('citation registry', () => {
  beforeEach(() => {
    __resetCitations()
    __setBibData(FIXTURE)
  })

  it('registers a key for a page', () => {
    registerCitation(3, 'alpha')
    const page = computed(() => 3)
    const fn = useSlideFootnotes(page)
    expect(fn.value).toHaveLength(1)
    expect(fn.value[0].key).toBe('alpha')
  })

  it('same key on the same page registers only once', () => {
    registerCitation(3, 'alpha')
    registerCitation(3, 'alpha')
    const fn = useSlideFootnotes(computed(() => 3))
    expect(fn.value).toHaveLength(1)
  })

  it('multiple distinct keys on the same page all appear', () => {
    registerCitation(5, 'alpha')
    registerCitation(5, 'beta')
    const fn = useSlideFootnotes(computed(() => 5))
    expect(fn.value).toHaveLength(2)
  })

  it('footnotes are sorted by pre-assigned num, not registration order', () => {
    registerCitation(5, 'gamma') // num 3
    registerCitation(5, 'alpha') // num 1
    const fn = useSlideFootnotes(computed(() => 5))
    expect(fn.value[0].key).toBe('alpha')
    expect(fn.value[1].key).toBe('gamma')
  })

  it('same key on different pages keeps the same pre-assigned number', () => {
    registerCitation(1, 'beta')
    registerCitation(7, 'beta')
    const fn1 = useSlideFootnotes(computed(() => 1))
    const fn7 = useSlideFootnotes(computed(() => 7))
    expect(fn1.value[0].num).toBe(2)
    expect(fn7.value[0].num).toBe(2)
  })

  it('unregisterCitation removes the key from the page', () => {
    registerCitation(2, 'alpha')
    unregisterCitation(2, 'alpha')
    const fn = useSlideFootnotes(computed(() => 2))
    expect(fn.value).toHaveLength(0)
  })

  it('unknown key produces no footnote entry', () => {
    registerCitation(4, 'nonexistent')
    const fn = useSlideFootnotes(computed(() => 4))
    expect(fn.value).toHaveLength(0)
  })

  it('footnotes for one page do not bleed into another page', () => {
    registerCitation(1, 'alpha')
    registerCitation(2, 'beta')
    const fn1 = useSlideFootnotes(computed(() => 1))
    const fn2 = useSlideFootnotes(computed(() => 2))
    expect(fn1.value.map((e) => e.key)).toEqual(['alpha'])
    expect(fn2.value.map((e) => e.key)).toEqual(['beta'])
  })
})
