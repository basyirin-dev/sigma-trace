import { create } from 'zustand'

interface GameStore {
  mode: 'strategy' | 'detective' | 'transition'
  sigma: number
  r0: number
  budget: number
  setMode: (mode: 'strategy' | 'detective' | 'transition') => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  mode: 'strategy',
  sigma: 78,
  r0: 0.6,
  budget: 500,
  setMode: (mode) => set({ mode }),
  reset: () => set({ mode: 'strategy', sigma: 78, r0: 0.6, budget: 500 }),
}))
