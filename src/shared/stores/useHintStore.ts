import { create } from 'zustand'

const MAX_VISIBLE = 3
const COOLDOWN_TICKS = 20

export interface Hint {
  id: string
  message: string
}

export interface HintState {
  hints: Hint[]
}

export interface HintActions {
  addHint: (message: string) => void
  dismissHint: (id: string) => void
  clearAll: () => void
}

export type HintStore = HintState & HintActions

let nextId = 0
const shownCooldowns = new Map<string, number>()

export function canShowHint(key: string, tick: number): boolean {
  const last = shownCooldowns.get(key)
  if (last !== undefined && tick - last < COOLDOWN_TICKS) return false
  shownCooldowns.set(key, tick)
  return true
}

export function resetHintCooldowns(): void {
  shownCooldowns.clear()
}

export const useHintStore = create<HintStore>((set) => ({
  hints: [],
  addHint: (message) => {
    const id = `hint-${nextId++}`
    set((s) => {
      const next = [...s.hints, { id, message }]
      if (next.length > MAX_VISIBLE) next.shift()
      return { hints: next }
    })
  },
  dismissHint: (id) =>
    set((s) => ({
      hints: s.hints.filter((h) => h.id !== id),
    })),
  clearAll: () => {
    nextId = 0
    shownCooldowns.clear()
    set({ hints: [] })
  },
}))
