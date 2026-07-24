import { create } from 'zustand'

export interface PlaytestEvent {
  id: string
  type: 'mode_switch' | 'deploy' | 'case_start' | 'case_end' | 'game_status' | 'snapshot'
  timestamp: number
  tick: number
  data: Record<string, unknown>
}

export interface PlaytestState {
  events: PlaytestEvent[]
  sessionStart: number
  isDevMode: boolean
  activeMonologue: string | null
}

export interface PlaytestActions {
  logEvent: (type: PlaytestEvent['type'], tick: number, data: Record<string, unknown>) => void
  clearLog: () => void
  exportLog: () => void
  setDevMode: (on: boolean) => void
  toggleDevMode: () => void
  showMonologue: (text: string) => void
  dismissMonologue: () => void
}

export type PlaytestStore = PlaytestState & PlaytestActions

let nextId = 0

export const usePlaytestStore = create<PlaytestStore>((set, get) => ({
  events: [],
  sessionStart: Date.now(),
  isDevMode: false,
  activeMonologue: null,

  logEvent: (type, tick, data) => {
    const event: PlaytestEvent = {
      id: `evt_${++nextId}`,
      type,
      timestamp: Date.now(),
      tick,
      data,
    }
    set((s) => ({ events: [...s.events, event] }))
  },

  clearLog: () => set({ events: [], sessionStart: Date.now() }),

  exportLog: () => {
    const { events, sessionStart } = get()
    const blob = new Blob([JSON.stringify({ sessionStart, eventCount: events.length, events }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `giha-session-${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.json`
    a.click()
    URL.revokeObjectURL(url)
  },

  setDevMode: (on) => set({ isDevMode: on }),
  toggleDevMode: () => set((s) => ({ isDevMode: !s.isDevMode })),

  showMonologue: (text) => set({ activeMonologue: text }),
  dismissMonologue: () => set({ activeMonologue: null }),
}))
