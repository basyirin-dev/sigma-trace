import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useActiveEffects } from './useActiveEffects'
import { useGameStore, useSimulationStore } from '@shared/stores'

beforeEach(() => {
  useGameStore.getState().reset()
  useSimulationStore.getState().resetSimulation()
})

describe('useActiveEffects', () => {
  it('deploy deducts budget, creates active effect, and sets cooldown', () => {
    const { result } = renderHook(() => useActiveEffects())

    act(() => {
      result.current.deploy('fact-check')
    })

    const gameStore = useGameStore.getState()
    expect(gameStore.appliedInterventions).toEqual(['fact-check'])
    expect(gameStore.budget).toBe(250)
    expect(gameStore.cooldowns).toEqual({ 'fact-check': 30 })

    const simStore = useSimulationStore.getState()
    expect(simStore.activeEffects).toHaveLength(1)
    expect(simStore.activeEffects[0]!.interventionId).toBe('fact-check')
    expect(simStore.activeEffects[0]!.remainingTicks).toBe(15)
    expect(simStore.activeEffects[0]!.r0Delta).toBe(-0.2)
  })

  it('deploy does nothing for unknown intervention', () => {
    const { result } = renderHook(() => useActiveEffects())

    act(() => {
      result.current.deploy('unknown-id')
    })

    expect(useGameStore.getState().appliedInterventions).toEqual([])
    expect(useGameStore.getState().budget).toBe(300)
    expect(useSimulationStore.getState().activeEffects).toEqual([])
  })

  it('deploy does nothing when budget is insufficient', () => {
    const { result } = renderHook(() => useActiveEffects())

    // Set budget to 0
    useGameStore.setState({ budget: 0 })

    act(() => {
      result.current.deploy('fact-check')
    })

    expect(useGameStore.getState().appliedInterventions).toEqual([])
    expect(useSimulationStore.getState().activeEffects).toEqual([])
  })
})
