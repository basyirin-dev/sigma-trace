import { describe, it, expect } from 'vitest'
import { computeR0 } from './r0'
import type { PopulationState, SimulationConfig } from './types'

function makeState(susceptible: number, total: number): PopulationState {
  return { susceptible, exposed: 0, infected: 0, recovered: total - susceptible, total }
}

function makeConfig(overrides?: Partial<SimulationConfig>): SimulationConfig {
  return {
    baseR0: 2.5,
    literacyRate: 0,
    factCheckCoverage: 0,
    algorithmAuditActive: false,
    recoveryRate: 0.1,
    incubationRate: 0.2,
    ...overrides,
  }
}

describe('computeR0', () => {
  it('returns baseR0 with no mitigation and full susceptible', () => {
    const state = makeState(1000, 1000)
    const result = computeR0(state, makeConfig())
    expect(result).toBeGreaterThan(2.45)
    expect(result).toBeLessThan(2.55)
  })

  it('decreases R0 when interventions are active', () => {
    const state = makeState(1000, 1000)
    const without = computeR0(state, makeConfig())
    const withEffect = computeR0(state, makeConfig(), [
      { interventionId: 'test', remainingTicks: 10, r0Delta: -0.5, sigmaDelta: 0 },
    ])
    expect(withEffect).toBeLessThan(without)
  })

  it('reduces R0 with higher literacy rate', () => {
    const state = makeState(1000, 1000)
    const low = computeR0(state, makeConfig({ literacyRate: 0 }))
    const high = computeR0(state, makeConfig({ literacyRate: 80 }))
    expect(high).toBeLessThan(low)
  })

  it('reduces R0 with higher factCheckCoverage', () => {
    const state = makeState(1000, 1000)
    const low = computeR0(state, makeConfig({ factCheckCoverage: 0 }))
    const high = computeR0(state, makeConfig({ factCheckCoverage: 75 }))
    expect(high).toBeLessThan(low)
  })

  it('reduces R0 when algorithm audit is active', () => {
    const state = makeState(1000, 1000)
    const off = computeR0(state, makeConfig({ algorithmAuditActive: false }))
    const on = computeR0(state, makeConfig({ algorithmAuditActive: true }))
    expect(on).toBeLessThan(off)
  })

  it('applies herd immunity from low susceptible fraction', () => {
    const state = makeState(300, 1000)
    const result = computeR0(state, makeConfig())
    expect(result).toBeGreaterThan(0.55)
    expect(result).toBeLessThan(0.95)
  })

  it('never returns negative values', () => {
    const state = makeState(1000, 1000)
    const result = computeR0(state, makeConfig({ baseR0: 0.1 }), [
      { interventionId: 'test', remainingTicks: 10, r0Delta: -5, sigmaDelta: 0 },
    ])
    expect(result).toBeGreaterThanOrEqual(0)
  })
})
