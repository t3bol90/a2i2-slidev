import { describe, it, expect, beforeEach } from 'vitest'
import {
  __resetTheoremCounters,
  getTheoremIndex,
  registerTheoremLike,
  unregisterTheoremLike,
} from '../composables/theoremCounter'

describe('theoremCounter', () => {
  beforeEach(() => {
    __resetTheoremCounters()
  })

  it('returns 1 for the first UID registered in a section', () => {
    registerTheoremLike(100, 1)
    expect(getTheoremIndex(100, 1)).toBe(1)
  })

  it('assigns sequential indices to UIDs registered in source order', () => {
    registerTheoremLike(100, 3)
    registerTheoremLike(101, 3)
    registerTheoremLike(102, 3)
    expect(getTheoremIndex(100, 3)).toBe(1)
    expect(getTheoremIndex(101, 3)).toBe(2)
    expect(getTheoremIndex(102, 3)).toBe(3)
  })

  it('keeps counters separate per section (section 4 restarts at 1)', () => {
    registerTheoremLike(100, 3)
    registerTheoremLike(101, 3)
    registerTheoremLike(200, 4)
    expect(getTheoremIndex(101, 3)).toBe(2)
    expect(getTheoremIndex(200, 4)).toBe(1)
  })

  it('returns 1 for an unregistered UID (transient setup state)', () => {
    expect(getTheoremIndex(999, 1)).toBe(1)
  })

  it('frees the slot on unregister so subsequent peers shift down', () => {
    registerTheoremLike(100, 1)
    registerTheoremLike(101, 1)
    registerTheoremLike(102, 1)
    unregisterTheoremLike(101, 1)
    expect(getTheoremIndex(100, 1)).toBe(1)
    expect(getTheoremIndex(102, 1)).toBe(2)
  })

  it('is idempotent — re-registering the same UID does not double-count', () => {
    registerTheoremLike(100, 1)
    registerTheoremLike(100, 1)
    registerTheoremLike(101, 1)
    expect(getTheoremIndex(100, 1)).toBe(1)
    expect(getTheoremIndex(101, 1)).toBe(2)
  })

  it('sorts UIDs so out-of-order registration still yields source-order indices', () => {
    // Vue UIDs are monotonic in creation order, but a re-mount after
    // HMR can produce a higher UID for a component that *appeared
    // earlier* in source — we sort defensively so the index reflects
    // numeric UID order (a stand-in for creation order).
    registerTheoremLike(105, 2)
    registerTheoremLike(101, 2)
    registerTheoremLike(110, 2)
    expect(getTheoremIndex(101, 2)).toBe(1)
    expect(getTheoremIndex(105, 2)).toBe(2)
    expect(getTheoremIndex(110, 2)).toBe(3)
  })

  it('tolerates unregister of a UID that was never registered', () => {
    expect(() => unregisterTheoremLike(404, 5)).not.toThrow()
  })

  it('handles section 0 (pre-divider) as its own counter bucket', () => {
    registerTheoremLike(100, 0)
    registerTheoremLike(101, 0)
    registerTheoremLike(200, 1)
    expect(getTheoremIndex(100, 0)).toBe(1)
    expect(getTheoremIndex(101, 0)).toBe(2)
    expect(getTheoremIndex(200, 1)).toBe(1)
  })
})
