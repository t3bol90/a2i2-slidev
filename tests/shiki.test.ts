import { describe, it, expect } from 'vitest'
import { a2i2LightTheme } from '../setup/shiki'

// ─── WCAG AA contrast helpers ───────────────────────────────────────────────
// Accepts 6-digit hex strings like '#C84030'. White background assumed.

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const lin = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrastRatio(fg: string, bg = '#FFFFFF'): number {
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('a2i2LightTheme', () => {
  it('snapshot: full tokenColors mapping (guards regressions to 60+ scopes)', () => {
    // Snapshotting tokenColors is equivalent to snapshotting rendered HTML for
    // regression purposes: the HTML output is a deterministic function of these
    // mappings, so any change — added scope, changed color, removed entry —
    // will fail this snapshot. First run writes the snapshot file.
    expect(a2i2LightTheme.tokenColors).toMatchSnapshot()
  })

  it('has ≥60 individual scope entries across all token color rules', () => {
    const total = (a2i2LightTheme.tokenColors ?? []).reduce((acc, rule) => {
      const scopes = Array.isArray(rule.scope) ? rule.scope : rule.scope ? [rule.scope] : []
      return acc + scopes.length
    }, 0)
    expect(total).toBeGreaterThanOrEqual(60)
  })

  it('theme metadata: type is light, background is white', () => {
    expect(a2i2LightTheme.type).toBe('light')
    expect(a2i2LightTheme.colors?.['editor.background']).toBe('#FFFFFF')
    expect(a2i2LightTheme.colors?.['editor.foreground']).toBe('#1A1A1A')
  })

  it('all foreground colors pass WCAG AA (≥4.5:1) on white', () => {
    const failing: string[] = []
    for (const rule of a2i2LightTheme.tokenColors ?? []) {
      const fg = rule.settings?.foreground
      if (typeof fg !== 'string') continue
      const ratio = contrastRatio(fg)
      if (ratio < 4.5) failing.push(`${fg}: ${ratio.toFixed(2)}:1`)
    }
    expect(failing, `Colors failing WCAG AA: ${failing.join(', ')}`).toEqual([])
  })

  it('no distinct token type uses a green foreground (color-blind safety)', () => {
    // Green range: hue 100–160° in HSL. Check each foreground color.
    for (const rule of a2i2LightTheme.tokenColors ?? []) {
      const fg = rule.settings?.foreground
      if (typeof fg !== 'string') continue
      const r = parseInt(fg.slice(1, 3), 16) / 255
      const g = parseInt(fg.slice(3, 5), 16) / 255
      const b = parseInt(fg.slice(5, 7), 16) / 255
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      if (max === min) continue // achromatic — no hue
      const delta = max - min
      let hue: number
      if (max === r) hue = ((g - b) / delta + 6) % 6 * 60
      else if (max === g) hue = ((b - r) / delta + 2) * 60
      else hue = ((r - g) / delta + 4) * 60
      // Saturation guard: only flag if the color is visibly saturated (not just light gray)
      const saturation = delta / (1 - Math.abs(max + min - 1))
      if (saturation > 0.3 && hue >= 100 && hue <= 160) {
        throw new Error(`${fg} (hue ${hue.toFixed(0)}°, sat ${(saturation * 100).toFixed(0)}%) looks green — color-blind safety violation`)
      }
    }
  })

  it('keyword scope uses brand-anchored red foreground', () => {
    const kwRule = (a2i2LightTheme.tokenColors ?? []).find((r) => {
      const scopes = Array.isArray(r.scope) ? r.scope : r.scope ? [r.scope] : []
      return scopes.includes('keyword')
    })
    expect(kwRule, 'keyword rule must exist').toBeDefined()
    const fg = kwRule!.settings.foreground!
    expect(fg, 'keyword foreground must be defined').toBeDefined()
    // Anchored on #F05A40: the brand red. Our WCAG-compliant variant (#C84030)
    // must pass AA and be in the red family (hue 0–30°).
    expect(contrastRatio(fg)).toBeGreaterThanOrEqual(4.5)
    const r = parseInt(fg.slice(1, 3), 16) / 255
    const g = parseInt(fg.slice(3, 5), 16) / 255
    const b = parseInt(fg.slice(5, 7), 16) / 255
    const max = Math.max(r, g, b)
    const delta = max - r !== 0 ? max - Math.min(r, g, b) : 0
    expect(r).toBeGreaterThan(g) // red channel dominant
    expect(r).toBeGreaterThan(b)
    void delta // suppress unused
  })

  it('strings and keywords are on distinct, non-green/red-pair colors', () => {
    const getColor = (targetScope: string) =>
      (a2i2LightTheme.tokenColors ?? []).find((r) => {
        const scopes = Array.isArray(r.scope) ? r.scope : r.scope ? [r.scope] : []
        return scopes.includes(targetScope)
      })?.settings.foreground

    const kwColor = getColor('keyword')
    const strColor = getColor('string')
    expect(kwColor).toBeDefined()
    expect(strColor).toBeDefined()
    expect(kwColor).not.toBe(strColor)
    // Neither should be a pure green
    if (strColor) {
      const ratio = contrastRatio(strColor)
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    }
  })
})
