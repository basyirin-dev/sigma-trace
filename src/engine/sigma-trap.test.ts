import { describe, it, expect } from 'vitest'
import { detectSigmaTrap } from './sigma-trap'

describe('detectSigmaTrap', () => {
  it('returns true after 5 consecutive ticks below 10', () => {
    const history = [25, 22, 18, 16, 15, 14, 13, 12, 9, 8, 7, 6, 5]
    expect(detectSigmaTrap(history)).toBe(true)
  })

  it('returns false with fewer than 5 consecutive low ticks', () => {
    const history = [25, 22, 18, 16, 15, 25, 14, 13, 12]
    expect(detectSigmaTrap(history)).toBe(false)
  })

  it('returns false when all values are above 10', () => {
    const history = [30, 45, 55, 72, 68, 15, 12, 11]
    expect(detectSigmaTrap(history)).toBe(false)
  })

  it('returns false with empty history', () => {
    expect(detectSigmaTrap([])).toBe(false)
  })
})
