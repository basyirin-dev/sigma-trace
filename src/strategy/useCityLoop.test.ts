import { describe, it, expect, beforeEach } from 'vitest'
import { DISTRICTS } from '@engine/districts'
import { useSimulationStore } from '@shared/stores'

// useCityLoop requires a canvas ref and runs requestAnimationFrame.
// We test the engine-district mapping, simulation store wiring,
// and helper invariants here.

beforeEach(() => {
  useSimulationStore.getState().resetSimulation()
})

describe('useCityLoop engine wiring', () => {
  it('engine DISTRICTS has exactly 4 districts', () => {
    expect(DISTRICTS).toHaveLength(4)
  })

  it('districts are ordered foundry, harborview, uptown, campus', () => {
    expect(DISTRICTS[0]!.id).toBe('foundry')
    expect(DISTRICTS[1]!.id).toBe('harborview')
    expect(DISTRICTS[2]!.id).toBe('uptown')
    expect(DISTRICTS[3]!.id).toBe('campus')
  })

  it('each district has a unique literacyFactor for sigma differentiation', () => {
    const factors = DISTRICTS.map((d) => d.literacyFactor)
    const unique = new Set(factors)
    expect(unique.size).toBe(DISTRICTS.length)
  })

  it('useCityLoop initializes from simulation store', () => {
    const state = useSimulationStore.getState()
    expect(state.sigma).toBe(78)
    expect(state.r0).toBe(0.6)
    expect(state.tick).toBe(0)
    expect(state.phase).toBe('calm')
  })

  it('simulation store reset restores defaults after changes', () => {
    // Simulate a snapshot being applied (as if onTick ran)
    useSimulationStore.getState().applySnapshot(
      {
        state: { susceptible: 494500, exposed: 2000, infected: 500, recovered: 3000, total: 500000 },
        r0: 1.8,
        sigma: 45,
        phase: 'outbreak',
        time: 20,
        interventions: [],
      },
      20,
    )

    useSimulationStore.getState().resetSimulation()
    const state = useSimulationStore.getState()
    expect(state.sigma).toBe(78)
    expect(state.r0).toBe(0.6)
    expect(state.tick).toBe(0)
    expect(state.phase).toBe('calm')
  })
})
