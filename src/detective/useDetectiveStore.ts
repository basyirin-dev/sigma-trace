import { create } from 'zustand'
import type { Verdict } from '@engine/types'
import type { CaseData } from './CaseLoader'
import { loadCase } from './CaseLoader'

export type MiraOutcome = 'exposed' | 'protected' | 'undiscovered'

export interface DetectiveRuntimeState {
  caseData: CaseData | null
  connections: [string, string][]
  usedTools: string[]
  usedToolEvidencePairs: [string, string][]
  activeTool: string | null
  verdict: Verdict | null
  justification: string
  startTime: number
  loading: boolean
  playerVerdict: Verdict | null
  miraOutcome: MiraOutcome
}

export interface DetectiveRuntimeActions {
  loadCase: (caseId: string) => Promise<void>
  connectEvidence: (a: string, b: string) => void
  disconnectEvidence: (a: string, b: string) => void
  applyTool: (toolId: string, evidenceId: string) => void
  selectTool: (toolId: string | null) => void
  submitVerdict: (verdict: Verdict, justification: string) => void
  reset: () => void
}

export type DetectiveRuntimeStore = DetectiveRuntimeState & DetectiveRuntimeActions

const INITIAL: DetectiveRuntimeState = {
  caseData: null,
  connections: [],
  usedTools: [],
  usedToolEvidencePairs: [],
  activeTool: null,
  verdict: null,
  justification: '',
  startTime: 0,
  loading: false,
  playerVerdict: null,
  miraOutcome: 'undiscovered',
}

export const useDetectiveStore = create<DetectiveRuntimeStore>((set, get) => ({
  ...INITIAL,

  loadCase: async (caseId: string) => {
    set({ loading: true })
    const data = await loadCase(caseId)
    if (data) {
      set({
        caseData: data,
        startTime: Date.now(),
        loading: false,
        connections: [],
        usedTools: [],
        usedToolEvidencePairs: [],
        activeTool: null,
        verdict: null,
        justification: '',
      })
    } else {
      set({ loading: false })
    }
  },

  connectEvidence: (a, b) => {
    const { connections } = get()
    const key = [a, b].sort().join('::')
    const exists = connections.some(([x, y]) => [x, y].sort().join('::') === key)
    if (!exists) {
      set({ connections: [...connections, [a, b]] })
    }
  },

  disconnectEvidence: (a, b) => {
    const { connections } = get()
    set({
      connections: connections.filter(([x, y]) => {
        return [x, y].sort().join('::') !== [a, b].sort().join('::')
      }),
    })
  },

  applyTool: (toolId, evidenceId) => {
    const { usedTools, usedToolEvidencePairs } = get()
    const newTools = usedTools.includes(toolId) ? usedTools : [...usedTools, toolId]
    const pair: [string, string] = [toolId, evidenceId]
    // Use sorted copy for duplicate check only — don't mutate original pair
    const pairKey = [toolId, evidenceId].sort().join('::')
    const exists = usedToolEvidencePairs.some(
      ([t, e]) => [t, e].sort().join('::') === pairKey,
    )
    const newPairs = exists ? usedToolEvidencePairs : [...usedToolEvidencePairs, pair]
    set({ usedTools: newTools, usedToolEvidencePairs: newPairs })
  },

  selectTool: (toolId) => {
    set({ activeTool: get().activeTool === toolId ? null : toolId })
  },

  submitVerdict: (verdict, justification) => {
    const { connections, usedToolEvidencePairs } = get()
    let miraOutcome: MiraOutcome = 'undiscovered'

    const connectionKey = (a: string, b: string) => [a, b].sort().join('::')
    const miraExposed = connections.some(([a, b]) => connectionKey(a, b) === connectionKey('evidence-07', 'mira-node')) &&
                        connections.some(([a, b]) => connectionKey(a, b) === connectionKey('evidence-08', 'mira-node'))
    if (miraExposed) {
      miraOutcome = 'exposed'
    } else {
      const foundEvidence7 = usedToolEvidencePairs.some(([_, e]) => e === 'evidence-07')
      const foundEvidence8 = usedToolEvidencePairs.some(([_, e]) => e === 'evidence-08')
      if (foundEvidence7 || foundEvidence8) {
        miraOutcome = 'protected'
      }
    }

    set({ verdict, justification, playerVerdict: verdict, miraOutcome })
  },

  reset: () => set({ ...INITIAL }),
}))
