import { describe, it, expect } from 'vitest'
import type { PopulationState, Phase, Verdict, SimulationConfig, SimulationSnapshot } from './types'

describe('engine types', () => {
  it('PopulationState has correct shape', () => {
    const pop: PopulationState = {
      susceptible: 400000,
      exposed: 50000,
      infected: 30000,
      recovered: 20000,
      total: 500000,
    }
    expect(pop.total).toBe(500000)
  })

  it('Verdict accepts valid values', () => {
    const verdicts: Verdict[] = ['real', 'manipulated', 'uncertain']
    expect(verdicts).toHaveLength(3)
  })

  it('Phase accepts valid values', () => {
    const phases: Phase[] = ['calm', 'outbreak', 'crisis', 'trap']
    expect(phases).toHaveLength(4)
  })

  it('SimulationConfig compiles', () => {
    const config: SimulationConfig = {
      baseR0: 1.2,
      literacyRate: 60,
      factCheckCoverage: 30,
      algorithmAuditActive: false,
      recoveryRate: 0.1,
      incubationRate: 0.15,
    }
    expect(config.baseR0).toBe(1.2)
  })

  it('SimulationSnapshot has all fields', () => {
    const state: PopulationState = {
      susceptible: 100,
      exposed: 10,
      infected: 5,
      recovered: 5,
      total: 120,
    }
    const snapshot: SimulationSnapshot = {
      state,
      r0: 0.8,
      sigma: 65,
      phase: 'calm',
      time: 42,
      interventions: [],
    }
    expect(snapshot.time).toBe(42)
    expect(snapshot.interventions).toHaveLength(0)
  })
})
