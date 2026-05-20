import { describe, it, expect } from 'vitest'
import { computeSection } from '../composables/useSection'

describe('computeSection', () => {
  it('returns null when no slides have been authored', () => {
    expect(computeSection([], 0)).toBeNull()
    expect(computeSection([], 1)).toBeNull()
  })

  it('returns null before the first section divider appears', () => {
    const fms = [
      { layout: 'title' },
      { layout: 'default' },
      { layout: 'section', title: 'Foundations' },
    ]
    expect(computeSection(fms, 1)).toBeNull()
    expect(computeSection(fms, 2)).toBeNull()
  })

  it('counts the section divider slide itself as inside its own section', () => {
    const fms = [{ layout: 'title' }, { layout: 'section', title: 'Foundations' }]
    expect(computeSection(fms, 2)).toEqual({ number: 1, title: 'Foundations' })
  })

  it('numbers sections sequentially as new dividers appear', () => {
    const fms = [
      { layout: 'title' },
      { layout: 'section', title: 'Foundations' },
      { layout: 'default' },
      { layout: 'section', title: 'Method' },
      { layout: 'default' },
      { layout: 'section', title: 'Results' },
    ]
    expect(computeSection(fms, 3)).toEqual({ number: 1, title: 'Foundations' })
    expect(computeSection(fms, 5)).toEqual({ number: 2, title: 'Method' })
    expect(computeSection(fms, 6)).toEqual({ number: 3, title: 'Results' })
  })

  it('keeps the same section number for every slide inside it', () => {
    const fms = [
      { layout: 'section', title: 'A' },
      { layout: 'default' },
      { layout: 'default' },
      { layout: 'default' },
    ]
    for (let i = 1; i <= 4; i++) {
      expect(computeSection(fms, i)).toEqual({ number: 1, title: 'A' })
    }
  })

  it('treats a divider with no title as an unnamed section (number still increments)', () => {
    const fms = [{ layout: 'section' }, { layout: 'default' }]
    expect(computeSection(fms, 2)).toEqual({ number: 1, title: '' })
  })

  it('ignores frontmatters past the current slide index', () => {
    const fms = [
      { layout: 'section', title: 'A' },
      { layout: 'section', title: 'B' },
    ]
    expect(computeSection(fms, 1)).toEqual({ number: 1, title: 'A' })
  })

  it('clamps currentSlideNo above the list length without crashing', () => {
    const fms = [{ layout: 'section', title: 'Only' }]
    expect(computeSection(fms, 999)).toEqual({ number: 1, title: 'Only' })
  })

  it('tolerates undefined / sparse frontmatter entries', () => {
    const fms = [undefined, { layout: 'section', title: 'Real' }, undefined]
    expect(computeSection(fms, 3)).toEqual({ number: 1, title: 'Real' })
  })
})
