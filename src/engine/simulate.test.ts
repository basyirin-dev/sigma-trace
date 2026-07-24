import { describe, it, expect } from 'vitest'
import { simulateTick, buildDefaultConfig } from './simulate'
import type { SimulationParams } from './simulate'

const config = buildDefaultConfig()

describe('simulateTick', () => {
  const baseParams: SimulationParams = {
    population: { susceptible: 494500, exposed: 2000, infected: 500, recovered: 3000, total: 500000 },
    sigma: 78,
    r0: 2.0,
    activeEffects: [],
    time: 0,
  }

  it('applies r0Delta reduction from active effects', () => {
    const params: SimulationParams = {
      ...baseParams,
      activeEffects: [
        { interventionId: 'fact-check', remainingTicks: 5, r0Delta: -0.2, sigmaDelta: 0 },
      ],
    }

    const result = simulateTick(params, config)
    expect(result.r0).toBeLessThan(2.3)
  })

  it('applies sigmaDelta boost from active effects', () => {
    const params: SimulationParams = {
      ...baseParams,
      activeEffects: [
        { interventionId: 'mil-school', remainingTicks: 5, r0Delta: 0, sigmaDelta: 2 },
      ],
    }

    const result = simulateTick(params, config)
    expect(result.sigma).toBeGreaterThan(baseParams.sigma)
  })

  it('returns ticked effects with decremented remainingTicks', () => {
    const params: SimulationParams = {
      ...baseParams,
      activeEffects: [
        { interventionId: 'fact-check', remainingTicks: 5, r0Delta: -0.2, sigmaDelta: 0 },
      ],
    }

    const result = simulateTick(params, config)
    expect(result.interventions).toHaveLength(1)
    expect(result.interventions[0]!.remainingTicks).toBe(4)
  })

  it('removes expired effects from snapshot interventions', () => {
    const params: SimulationParams = {
      ...baseParams,
      activeEffects: [
        { interventionId: 'fact-check', remainingTicks: 1, r0Delta: -0.2, sigmaDelta: 0 },
      ],
    }

    const result = simulateTick(params, config)
    expect(result.interventions).toHaveLength(0)
  })

  it('applies effect before ticking it', () => {
    const params: SimulationParams = {
      ...baseParams,
      activeEffects: [
        { interventionId: 'fact-check', remainingTicks: 1, r0Delta: -0.2, sigmaDelta: 0 },
      ],
    }

    const result = simulateTick(params, config)
    expect(result.r0).toBeLessThan(2.3)
    expect(result.interventions).toHaveLength(0)
  })
})
