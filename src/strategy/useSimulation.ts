import { useCallback } from 'react'
import { useSimulationStore, useGameStore } from '@shared/stores'
import { simulateTick, buildDefaultConfig } from '@engine/simulate'
import type { SimulationParams } from '@engine/simulate'
import { detectSigmaTrap } from '@engine/sigma-trap'

function advanceTick(): void {
  const currentState = useSimulationStore.getState()
  const nextTick = currentState.tick + 1
  const simConfig = buildDefaultConfig(nextTick)
  const params: SimulationParams = {
    population: currentState.population,
    sigma: currentState.sigma,
    r0: currentState.r0,
    activeEffects: currentState.activeEffects,
    time: currentState.tick,
  }

  const snapshot = simulateTick(params, simConfig)
  useSimulationStore.getState().applySnapshot(snapshot, nextTick)
  useSimulationStore.getState().applySnapshot(snapshot, currentState.tick + 1)
  useGameStore.getState().tickCooldowns()

  const updatedState = useSimulationStore.getState()
  if (detectSigmaTrap(updatedState.sigmaHistory)) {
    useGameStore.getState().setGameStatus('lost')
    useSimulationStore.getState().pauseSimulation()
  }
}

export function useSimulation() {
  const population = useSimulationStore((s) => s.population)
  const sigma = useSimulationStore((s) => s.sigma)
  const r0 = useSimulationStore((s) => s.r0)
  const tick = useSimulationStore((s) => s.tick)
  const phase = useSimulationStore((s) => s.phase)
  const activeEffects = useSimulationStore((s) => s.activeEffects)
  const isRunning = useSimulationStore((s) => s.isRunning)
  const speed = useSimulationStore((s) => s.speed)

  const simulationTick = useCallback(() => {
    const currentState = useSimulationStore.getState()
    if (!currentState.isRunning) return
    advanceTick()
  }, [])

  const stepTick = useCallback(() => {
    advanceTick()
  }, [])

  return {
    population,
    sigma,
    r0,
    tick,
    phase,
    activeEffects,
    isRunning,
    speed,
    simulationTick,
    stepTick,
  }
}
