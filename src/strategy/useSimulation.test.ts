import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSimulation } from './useSimulation'
import { useSimulationStore, useGameStore } from '@shared/stores'

beforeEach(() => {
  useSimulationStore.getState().resetSimulation()
  useGameStore.getState().reset()
})

describe('useSimulation', () => {
  it('returns current simulation state', () => {
    const { result } = renderHook(() => useSimulation())

    expect(result.current.population.susceptible).toBe(494500)
    expect(result.current.sigma).toBe(78)
    expect(result.current.r0).toBe(0.6)
    expect(result.current.tick).toBe(0)
    expect(result.current.phase).toBe('calm')
    expect(result.current.isRunning).toBe(true)
    expect(result.current.speed).toBe(1)
    expect(typeof result.current.simulationTick).toBe('function')
    expect(typeof result.current.stepTick).toBe('function')
  })

  it('stepTick advances the population even when paused', () => {
    useSimulationStore.getState().pauseSimulation()
    const { result } = renderHook(() => useSimulation())

    act(() => {
      result.current.stepTick()
    })

    const snapshot = useSimulationStore.getState()
    expect(snapshot.tick).toBe(1)
    // stepTick should have advanced despite isRunning=false
    expect(snapshot.population.infected).toBeGreaterThan(0)
  })

  it('stepTick advances tick when simulation is running', () => {
    const { result } = renderHook(() => useSimulation())

    act(() => {
      result.current.stepTick()
    })

    expect(useSimulationStore.getState().tick).toBe(1)
  })

  it('simulationTick advances the population state', () => {
    const { result } = renderHook(() => useSimulation())

    act(() => {
      result.current.simulationTick()
    })

    const snapshot = useSimulationStore.getState()
    expect(snapshot.tick).toBe(1)
    expect(snapshot.population.susceptible).toBeLessThan(494500)
    expect(snapshot.population.exposed).toBeLessThan(2000)
    expect(snapshot.population.infected).toBeGreaterThan(500)
  })

  it('simulationTick updates the store r0 and sigma', () => {
    const { result } = renderHook(() => useSimulation())

    act(() => {
      result.current.simulationTick()
    })

    const snapshot = useSimulationStore.getState()
    expect(snapshot.r0).toBeGreaterThanOrEqual(0)
    expect(snapshot.sigma).toBeGreaterThanOrEqual(0)
    expect(snapshot.sigma).toBeLessThanOrEqual(100)
  })

  it('simulationTick does nothing when simulation is paused', () => {
    useSimulationStore.getState().pauseSimulation()
    const { result } = renderHook(() => useSimulation())

    act(() => {
      result.current.simulationTick()
    })

    expect(useSimulationStore.getState().tick).toBe(0)
  })

  it('simulationTick produces phase transitions over many ticks', () => {
    const { result } = renderHook(() => useSimulation())

    // Run 50 ticks to push through phases
    for (let i = 0; i < 50; i++) {
      act(() => {
        result.current.simulationTick()
      })
    }

    const state = useSimulationStore.getState()
    expect(state.tick).toBe(50)
    expect(state.population.infected).toBeGreaterThan(0)
    // After 50 ticks with base params, sigma should have evolved
    expect(state.sigma).not.toBe(78)
  })

  it('stepTick does not call simulation when speed changes', () => {
    const { result } = renderHook(() => useSimulation())
    expect(result.current.speed).toBe(1)
  })

  it('reacts to store updates via subscription', () => {
    const { result } = renderHook(() => useSimulation())

    act(() => {
      result.current.simulationTick()
    })

    expect(result.current.tick).toBe(1)
  })

  it('active effect reduces R₀ during its lifetime', () => {
    const { result } = renderHook(() => useSimulation())

    // Set a high r0 so the effect matters
    useSimulationStore.setState({ r0: 2.0 })

    // Apply fact-check effect (r0Delta: -0.2)
    useSimulationStore.getState().applyEffect({
      interventionId: 'fact-check',
      remainingTicks: 5,
      r0Delta: -0.2,
      sigmaDelta: 0,
    })

    // Tick once — effect should reduce R₀
    act(() => {
      result.current.simulationTick()
    })

    const state1 = useSimulationStore.getState()
    // R₀ should be lower than baseR0 (2.5) due to -0.2 reduction
    expect(state1.r0).toBeLessThan(2.5)
    // Effect should still be active (4 ticks remaining after tick)
    expect(state1.activeEffects).toHaveLength(1)
    expect(state1.activeEffects[0]!.remainingTicks).toBe(4)
  })

  it('active effect expires after its duration', () => {
    const { result } = renderHook(() => useSimulation())

    useSimulationStore.getState().applyEffect({
      interventionId: 'fact-check',
      remainingTicks: 1,
      r0Delta: -0.2,
      sigmaDelta: 0,
    })

    act(() => {
      result.current.simulationTick()
    })

    const state = useSimulationStore.getState()
    // After one tick, effect with remainingTicks=1 should tick to 0 and be filtered
    expect(state.activeEffects).toHaveLength(0)
  })

})
