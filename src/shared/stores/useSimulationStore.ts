import { create } from 'zustand'
import type { PopulationState, Phase, ActiveEffect } from '@engine/types'
import { POPULATION_INITIAL, STARTING_STATE } from '@engine/tuning'

export interface SimulationState {
  population: PopulationState
  sigma: number
  r0: number
  tick: number
  phase: Phase
  activeEffects: ActiveEffect[]
  isRunning: boolean
  speed: number
  r0History: number[]
  sigmaHistory: number[]
}

export interface SimulationActions {
  applyEffect: (effect: ActiveEffect) => void
  applySnapshot: (
    snapshot: {
      state: PopulationState
      r0: number
      sigma: number
      phase: Phase
      time: number
      interventions: ActiveEffect[]
    },
    nextTick: number,
  ) => void
  startSimulation: () => void
  pauseSimulation: () => void
  setSpeed: (speed: number) => void
  resetSimulation: () => void
}

export type SimulationStore = SimulationState & SimulationActions

const INITIAL_SIMULATION: SimulationState = {
  population: { ...POPULATION_INITIAL },
  sigma: STARTING_STATE.sigma,
  r0: STARTING_STATE.r0,
  tick: 0,
  phase: 'calm',
  activeEffects: [],
  isRunning: true,
  speed: 1,
  r0History: [],
  sigmaHistory: [],
}

export const useSimulationStore = create<SimulationStore>((set) => ({
  ...INITIAL_SIMULATION,
  applyEffect: (effect) =>
    set((s) => ({ activeEffects: [...s.activeEffects, effect] })),
  applySnapshot: (snapshot, nextTick) =>
    set((prev) => ({
      population: snapshot.state,
      r0: snapshot.r0,
      sigma: snapshot.sigma,
      phase: snapshot.phase,
      tick: nextTick,
      activeEffects: snapshot.interventions,
      r0History: [...prev.r0History.slice(-59), snapshot.r0],
      sigmaHistory: [...prev.sigmaHistory.slice(-59), snapshot.sigma],
    })),
  startSimulation: () => set({ isRunning: true }),
  pauseSimulation: () => set({ isRunning: false }),
  setSpeed: (speed) => set({ speed }),
  resetSimulation: () => set({ ...INITIAL_SIMULATION }),
}))
