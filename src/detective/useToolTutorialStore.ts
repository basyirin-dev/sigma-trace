import { create } from 'zustand'

export interface ToolTutorialState {
  dismissed: string[]
}

export interface ToolTutorialActions {
  dismiss: (toolId: string) => void
  reset: () => void
  resetForTool: (toolId: string) => void
}

export type ToolTutorialStore = ToolTutorialState & ToolTutorialActions

const INITIAL: ToolTutorialState = {
  dismissed: [],
}

export const useToolTutorialStore = create<ToolTutorialStore>((set) => ({
  ...INITIAL,

  dismiss: (toolId) =>
    set((s) => ({
      dismissed: s.dismissed.includes(toolId)
        ? s.dismissed
        : [...s.dismissed, toolId],
    })),

  reset: () => set({ ...INITIAL }),

  resetForTool: (toolId) =>
    set((s) => ({
      dismissed: s.dismissed.filter((id) => id !== toolId),
    })),
}))
