import { create } from 'zustand'

const MAX_VISIBLE = 5

export interface Warning {
  id: string
  message: string
}

export interface WarningState {
  warnings: Warning[]
}

export interface WarningActions {
  addWarning: (message: string) => void
  dismissWarning: (id: string) => void
  clearAll: () => void
}

export type WarningStore = WarningState & WarningActions

let nextId = 0

export const useWarningStore = create<WarningStore>((set) => ({
  warnings: [],
  addWarning: (message) => {
    const id = `warn-${nextId++}`
    set((s) => {
      const next = [...s.warnings, { id, message }]
      if (next.length > MAX_VISIBLE) next.shift()
      return { warnings: next }
    })
  },
  dismissWarning: (id) =>
    set((s) => ({
      warnings: s.warnings.filter((w) => w.id !== id),
    })),
  clearAll: () => {
    nextId = 0
    set({ warnings: [] })
  },
}))
