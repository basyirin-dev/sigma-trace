import { create } from 'zustand'
import type { CaseProgress } from './store'
import { useWarningStore } from '@shared/stores'

const VALID_TRANSITIONS: Record<CaseProgress, readonly CaseProgress[]> = {
  intro: ['investigation'],
  investigation: ['evidence'],
  evidence: ['verdict'],
  verdict: ['debrief'],
  debrief: [],
}

export interface CaseStateData {
  phase: CaseProgress
  introFrameIndex: number
}

export interface CaseStateActions {
  advanceTo: (phase: CaseProgress) => void
  autoAdvance: () => void
  nextIntroFrame: () => void
  reset: () => void
}

export type CaseStateStore = CaseStateData & CaseStateActions

const INITIAL: CaseStateData = {
  phase: 'intro',
  introFrameIndex: 0,
}

export const useCaseStateStore = create<CaseStateStore>((set, get) => ({
  ...INITIAL,

  advanceTo: (phase) => {
    const current = get().phase
    const valid = VALID_TRANSITIONS[current]
    if (!valid.includes(phase)) {
      useWarningStore.getState().addWarning(`Cannot advance to ${phase} from ${current}`)
      return
    }
    set({ phase, introFrameIndex: 0 })
  },

  autoAdvance: () => {
    const current = get().phase
    const next = VALID_TRANSITIONS[current][0]
    if (next === undefined) return
    set({ phase: next, introFrameIndex: 0 })
  },

  nextIntroFrame: () => {
    set((prev) => ({ introFrameIndex: prev.introFrameIndex + 1 }))
  },

  reset: () => set({ ...INITIAL }),
}))
