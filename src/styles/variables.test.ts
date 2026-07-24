import { describe, it, expect } from 'vitest'
import css from './variables.css?raw'
import main from '../main.tsx?raw'

function extractVar(name: string): string | undefined {
  const re = new RegExp(`--${name}\\s*:\\s*([^;]+)`)
  const match = css.match(re)
  return match?.[1]?.trim()
}

describe('variables.css design tokens', () => {
  describe('brand colors', () => {
    it('defines --color-primary: #1A237E', () => {
      expect(extractVar('color-primary')).toBe('#1A237E')
    })

    it('defines --color-secondary: #00897B', () => {
      expect(extractVar('color-secondary')).toBe('#00897B')
    })

    it('defines --color-accent: #FFB300', () => {
      expect(extractVar('color-accent')).toBe('#FFB300')
    })

    it('defines --color-danger: #E53935', () => {
      expect(extractVar('color-danger')).toBe('#E53935')
    })

    it('defines --color-success: #43A047', () => {
      expect(extractVar('color-success')).toBe('#43A047')
    })

    it('defines --color-warning: #FB8C00', () => {
      expect(extractVar('color-warning')).toBe('#FB8C00')
    })

    it('defines --color-white: #ffffff', () => {
      expect(extractVar('color-white')).toBe('#ffffff')
    })
  })

  describe('new palette', () => {
    it('defines --color-primary: #1A237E', () => {
      expect(extractVar('color-primary')).toBe('#1A237E')
    })

    it('defines --color-secondary: #00897B', () => {
      expect(extractVar('color-secondary')).toBe('#00897B')
    })

    it('defines --color-accent: #FFB300', () => {
      expect(extractVar('color-accent')).toBe('#FFB300')
    })

    it('defines --color-danger: #E53935', () => {
      expect(extractVar('color-danger')).toBe('#E53935')
    })

    it('defines --color-success: #43A047', () => {
      expect(extractVar('color-success')).toBe('#43A047')
    })
  })

  describe('typography fonts', () => {
    it('defines --font-pixel with BoldPixels', () => {
      const v = extractVar('font-pixel')
      expect(v).toContain('BoldPixels')
    })

    it('defines --font-pixel-mono with BoldPixels', () => {
      const v = extractVar('font-pixel-mono')
      expect(v).toContain('BoldPixels')
    })

    it('defines --font-narrative with BoldPixels', () => {
      const v = extractVar('font-narrative')
      expect(v).toContain('BoldPixels')
    })

    it('--pixel-font redirects to --font-pixel', () => {
      expect(extractVar('pixel-font')).toBe('var(--font-pixel)')
    })

    it('--pixel-font-mono redirects to --font-pixel-mono', () => {
      expect(extractVar('pixel-font-mono')).toBe('var(--font-pixel-mono)')
    })
  })

  describe('spacing scale', () => {
    const spaces: Record<string, string> = {
      'space-xs': '4px',
      'space-sm': '8px',
      'space-md': '16px',
      'space-lg': '24px',
      'space-xl': '32px',
      'space-2xl': '48px',
    }

    for (const [name, expected] of Object.entries(spaces)) {
      it(`defines --${name}: ${expected}`, () => {
        expect(extractVar(name)).toBe(expected)
      })
    }

    it('values are in ascending order', () => {
      const values = ['space-xs', 'space-sm', 'space-md', 'space-lg', 'space-xl', 'space-2xl']
        .map((n) => parseInt(extractVar(n) ?? '0'))
      for (let i = 1; i < values.length; i++) {
        expect(values[i]!).toBeGreaterThan(values[i - 1]!)
      }
    })
  })

  describe('z-index scale', () => {
    const layers: Record<string, string> = {
      'z-canvas': '0',
      'z-content': '10',
      'z-overlay': '100',
      'z-hud': '200',
      'z-modal': '9000',
      'z-tooltip': '9999',
    }

    for (const [name, expected] of Object.entries(layers)) {
      it(`defines --${name}: ${expected}`, () => {
        expect(extractVar(name)).toBe(expected)
      })
    }

    it('values are in ascending order', () => {
      const values = ['z-canvas', 'z-content', 'z-overlay', 'z-hud', 'z-modal', 'z-tooltip']
        .map((n) => parseInt(extractVar(n) ?? '0'))
      for (let i = 1; i < values.length; i++) {
        expect(values[i]!).toBeGreaterThan(values[i - 1]!)
      }
    })
  })

  describe('transitions', () => {
    it('defines --transition-fast with ease-out', () => {
      expect(extractVar('transition-fast')).toContain('ease-out')
    })

    it('defines --transition-normal with ease-in-out', () => {
      expect(extractVar('transition-normal')).toContain('ease-in-out')
    })

    it('defines --transition-slow with ease-in-out or ease-out', () => {
      const v = extractVar('transition-slow')
      expect(v).toBeTruthy()
      expect(v).toMatch(/ease-(in-out|out)/)
    })

    it('durations increase: fast < normal < slow', () => {
      const fastMs = parseInt(extractVar('transition-fast') ?? '0')
      const normalMs = parseInt(extractVar('transition-normal') ?? '0')
      const slowMs = parseInt(extractVar('transition-slow') ?? '0')
      expect(fastMs).toBeLessThan(normalMs)
      expect(normalMs).toBeLessThan(slowMs)
    })
  })

  describe('shadows', () => {
    it('defines --shadow-sm', () => {
      expect(extractVar('shadow-sm')).toBeTruthy()
    })

    it('defines --shadow-md', () => {
      expect(extractVar('shadow-md')).toBeTruthy()
    })

    it('defines --focus-ring', () => {
      expect(extractVar('focus-ring')).toBe('0 0 0 2px #FFB300')
    })
  })

  describe('line-height', () => {
    it('defines --leading-tight: 1.25', () => {
      expect(extractVar('leading-tight')).toBe('1.25')
    })

    it('defines --leading-normal: 1.5', () => {
      expect(extractVar('leading-normal')).toBe('1.5')
    })

    it('defines --leading-relaxed: 1.75', () => {
      expect(extractVar('leading-relaxed')).toBe('1.75')
    })
  })

  describe('no duplicates', () => {
    it('each variable name appears exactly once', () => {
      const varNames = css.match(/--[a-z-]+\s*:/g) ?? []
      const counts = new Map<string, number>()
      for (const vn of varNames) {
        const key = vn.trim()
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
      for (const [key, count] of counts) {
        expect(count, `${key} appears ${count} times`).toBe(1)
      }
    })
  })

  describe('file structure', () => {
    it('css files are imported in main.tsx', () => {
      expect(main).toContain("'./styles/global.css'")
      expect(main).toContain("'./styles/variables.css'")
      expect(main).toContain("'./styles/animations.css'")
      expect(main).toContain("'./styles/pixel-theme.css'")
    })
  })
})
