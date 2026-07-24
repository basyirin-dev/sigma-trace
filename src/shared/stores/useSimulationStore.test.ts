import { describe, it, expect, beforeEach } from 'vitest'
import { useSimulationStore } from './useSimulationStore'

beforeEach(() => {
  useSimulationStore.getState().resetSimulation()
})

describe('useSimulationStore', () => {
  it('initializes with correct defaults', () => {
    const state = useSimulationStore.getState()
    expect(state.population.susceptible).toBe(494500)
    expect(state.population.exposed).toBe(2000)
    expect(state.population.infected).toBe(500)
    expect(state.population.recovered).toBe(3000)
    expect(state.population.total).toBe(500000)
    expect(state.sigma).toBe(78)
    expect(state.r0).toBe(0.6)
    expect(state.tick).toBe(0)
    expect(state.phase).toBe('calm')
    expect(state.activeEffects).toEqual([])
    expect(state.isRunning).toBe(true)
    expect(state.speed).toBe(1)
    expect(state.r0History).toEqual([])
    expect(state.sigmaHistory).toEqual([])
  })

  it('applySnapshot updates simulation state', () => {
    const snapshot = {
      state: {
        susceptible: 99000,
        exposed: 2000,
        infected: 300,
        recovered: 200,
        total: 500000,
      },
      r0: 1.2,
      sigma: 65,
      phase: 'outbreak' as const,
      time: 10,
      interventions: [],
    }

    useSimulationStore.getState().applySnapshot(snapshot, 5)
    const state = useSimulationStore.getState()
    expect(state.population.susceptible).toBe(99000)
    expect(state.population.infected).toBe(300)
    expect(state.r0).toBe(1.2)
    expect(state.sigma).toBe(65)
    expect(state.phase).toBe('outbreak')
    expect(state.tick).toBe(5)
  })

  it('applySnapshot carries activeEffects forward', () => {
    const effects = [
      { interventionId: 'fact-check', remainingTicks: 10, r0Delta: -0.2, sigmaDelta: 0 },
    ]
    const snapshot = {
      state: { susceptible: 494500, exposed: 2000, infected: 100, recovered: 3000, total: 500000 },
      r0: 0.6,
      sigma: 78,
      phase: 'calm' as const,
      time: 0,
      interventions: effects,
    }

    useSimulationStore.getState().applySnapshot(snapshot, 1)
    expect(useSimulationStore.getState().activeEffects).toEqual(effects)
  })

  it('applySnapshot appends r0 to history', () => {
    const snapshot = {
      state: { susceptible: 494500, exposed: 2000, infected: 100, recovered: 3000, total: 500000 },
      r0: 1.2,
      sigma: 70,
      phase: 'outbreak' as const,
      time: 1,
      interventions: [],
    }
    useSimulationStore.getState().applySnapshot(snapshot, 1)
    expect(useSimulationStore.getState().r0History).toEqual([1.2])
  })

  it('r0History accumulates over multiple snapshots', () => {
    const values = [0.6, 0.8, 1.1, 1.3, 1.5]
    for (let i = 0; i < values.length; i++) {
      useSimulationStore.getState().applySnapshot(
        {
          state: { susceptible: 494500, exposed: 2000, infected: 100, recovered: 3000, total: 500000 },
          r0: values[i]!,
          sigma: 70,
          phase: 'calm',
          time: i,
          interventions: [],
        },
        i + 1,
      )
    }
    expect(useSimulationStore.getState().r0History).toEqual(values)
  })

  it('r0History is capped at 60 entries', () => {
    for (let i = 0; i < 65; i++) {
      useSimulationStore.getState().applySnapshot(
        {
          state: { susceptible: 494500, exposed: 2000, infected: 100, recovered: 3000, total: 500000 },
          r0: Math.random(),
          sigma: 70,
          phase: 'calm',
          time: i,
          interventions: [],
        },
        i + 1,
      )
    }
    expect(useSimulationStore.getState().r0History.length).toBe(60)
  })

  it('startSimulation sets isRunning to true', () => {
    useSimulationStore.getState().pauseSimulation()
    expect(useSimulationStore.getState().isRunning).toBe(false)

    useSimulationStore.getState().startSimulation()
    expect(useSimulationStore.getState().isRunning).toBe(true)
  })

  it('pauseSimulation sets isRunning to false', () => {
    useSimulationStore.getState().pauseSimulation()
    expect(useSimulationStore.getState().isRunning).toBe(false)
  })

  it('setSpeed updates speed value', () => {
    useSimulationStore.getState().setSpeed(5)
    expect(useSimulationStore.getState().speed).toBe(5)

    useSimulationStore.getState().setSpeed(10)
    expect(useSimulationStore.getState().speed).toBe(10)
  })

  it('resetSimulation restores all defaults', () => {
    useSimulationStore.getState().applySnapshot(
      {
        state: { susceptible: 0, exposed: 0, infected: 500000, recovered: 0, total: 500000 },
        r0: 3.0,
        sigma: 10,
        phase: 'crisis',
        time: 50,
        interventions: [],
      },
      50,
    )

    useSimulationStore.getState().resetSimulation()

    const state = useSimulationStore.getState()
    expect(state.population.susceptible).toBe(494500)
    expect(state.population.exposed).toBe(2000)
    expect(state.population.infected).toBe(500)
    expect(state.population.recovered).toBe(3000)
    expect(state.sigma).toBe(78)
    expect(state.r0).toBe(0.6)
    expect(state.tick).toBe(0)
    expect(state.phase).toBe('calm')
    expect(state.speed).toBe(1)
    expect(state.r0History).toEqual([])
  })

  it('applyEffect adds an active effect', () => {
    const effect = {
      interventionId: 'fact-check',
      remainingTicks: 15,
      r0Delta: -0.2,
      sigmaDelta: 0,
    }

    useSimulationStore.getState().applyEffect(effect)
    expect(useSimulationStore.getState().activeEffects).toEqual([effect])
  })

  it('applyEffect accumulates multiple effects', () => {
    useSimulationStore.getState().applyEffect({
      interventionId: 'fact-check',
      remainingTicks: 15,
      r0Delta: -0.2,
      sigmaDelta: 0,
    })
    useSimulationStore.getState().applyEffect({
      interventionId: 'mil-school',
      remainingTicks: 60,
      r0Delta: 0,
      sigmaDelta: 2,
    })

    expect(useSimulationStore.getState().activeEffects).toHaveLength(2)
  })
})
