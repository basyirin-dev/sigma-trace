import { describe, it, expect } from 'vitest'
import { classifyPhase } from './phase-classifier'

describe('classifyPhase', () => {
  it('returns trap when sigma is below 20 regardless of r0', () => {
    expect(classifyPhase(19, 0.3)).toBe('trap')
    expect(classifyPhase(19, 2.5)).toBe('trap')
    expect(classifyPhase(0, 0.0)).toBe('trap')
  })

  it('returns crisis when r0 >= 1.5 and sigma < 40 (and sigma >= 20)', () => {
    expect(classifyPhase(39, 1.5)).toBe('crisis')
    expect(classifyPhase(25, 2.0)).toBe('crisis')
  })

  it('returns outbreak when sigma < 70 (high-r0 path)', () => {
    expect(classifyPhase(55, 2.5)).toBe('outbreak')
    expect(classifyPhase(65, 1.0)).toBe('outbreak')
  })

  it('returns outbreak when r0 >= 0.8 (low-sigma path)', () => {
    expect(classifyPhase(70, 0.8)).toBe('outbreak')
    expect(classifyPhase(80, 1.2)).toBe('outbreak')
  })

  it('returns calm when r0 < 0.8 and sigma > 70', () => {
    expect(classifyPhase(75, 0.5)).toBe('calm')
    expect(classifyPhase(100, 0.0)).toBe('calm')
  })

  it('prefers trap over crisis at sigma below 20 with high r0', () => {
    expect(classifyPhase(19, 2.0)).toBe('trap')
  })

  it('prefers crisis over outbreak when both conditions overlap', () => {
    expect(classifyPhase(30, 2.0)).toBe('crisis')
  })

  it('prefers trap over outbreak at sigma below 20', () => {
    expect(classifyPhase(15, 0.5)).toBe('trap')
  })
})
