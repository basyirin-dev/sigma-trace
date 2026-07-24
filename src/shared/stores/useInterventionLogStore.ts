import { create } from 'zustand'

export interface DeploymentEntry {
  interventionId: string
  tick: number
  r0AtDeploy: number
  sigmaAtDeploy: number
}

export interface InterventionLogState {
  entries: DeploymentEntry[]
}

export interface InterventionLogActions {
  addEntry: (entry: DeploymentEntry) => void
  reset: () => void
}

export type InterventionLogStore = InterventionLogState & InterventionLogActions

export const useInterventionLogStore = create<InterventionLogStore>((set) => ({
  entries: [],
  addEntry: (entry) =>
    set((s) => ({ entries: [...s.entries, entry] })),
  reset: () => set({ entries: [] }),
}))
