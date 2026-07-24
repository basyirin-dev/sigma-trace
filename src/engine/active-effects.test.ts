import { describe, it, expect } from 'vitest'
import { createActiveEffect, tickActiveEffects } from './active-effects'
import type { Intervention } from './interventions'

const factCheck: Intervention = {
  id: 'fact-check',
  name: 'Fact-Check Bureau',
  cost: 50,
  cooldown: 30,
  effect: { r0Delta: -0.2, sigmaDelta: 0, durationTicks: 15 },
  description: 'Professional verification teams',
  category: 'r0-control',
}

describe('createActiveEffect', () => {
  it('creates an ActiveEffect from an Intervention', () => {
    const effect = createActiveEffect(factCheck)
    expect(effect).toEqual({
      interventionId: 'fact-check',
      remainingTicks: 15,
      r0Delta: -0.2,
      sigmaDelta: 0,
    })
  })
})

describe('tickActiveEffects', () => {
  it('decrements remainingTicks by 1', () => {
    const effects = [
      { interventionId: 'test', remainingTicks: 5, r0Delta: -0.2, sigmaDelta: 0 },
    ]
    const result = tickActiveEffects(effects)
    expect(result).toHaveLength(1)
    expect(result[0]!.remainingTicks).toBe(4)
  })

  it('removes effects whose remainingTicks reaches zero after decrement', () => {
    const effects = [
      { interventionId: 'test', remainingTicks: 1, r0Delta: -0.2, sigmaDelta: 0 },
    ]
    const result = tickActiveEffects(effects)
    expect(result).toHaveLength(0)
  })

  it('keeps effects with remainingTicks > 0 after decrement', () => {
    const effects = [
      { interventionId: 'fact-check', remainingTicks: 2, r0Delta: -0.2, sigmaDelta: 0 },
      { interventionId: 'mil-school', remainingTicks: 1, r0Delta: 0, sigmaDelta: 2 },
    ]
    const result = tickActiveEffects(effects)
    expect(result).toHaveLength(1)
    expect(result[0]!.interventionId).toBe('fact-check')
    expect(result[0]!.remainingTicks).toBe(1)
  })

  it('returns empty array for empty input', () => {
    const result = tickActiveEffects([])
    expect(result).toEqual([])
  })

  it('preserves other fields when ticking', () => {
    const effects = [
      { interventionId: 'fact-check', remainingTicks: 3, r0Delta: -0.2, sigmaDelta: 0 },
    ]
    const result = tickActiveEffects(effects)
    expect(result[0]!.r0Delta).toBe(-0.2)
    expect(result[0]!.sigmaDelta).toBe(0)
    expect(result[0]!.interventionId).toBe('fact-check')
  })
})
