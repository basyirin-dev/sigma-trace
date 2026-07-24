import { create } from 'zustand'
import { LS_MUSIC, LS_SFX, LS_MUTED, LS_FPS } from '../localStorageKeys'

export interface AudioState {
  musicVolume: number
  sfxVolume: number
  muted: boolean
  currentTrack: string | null
  showFps: boolean
}

export interface AudioActions {
  setMusicVolume: (v: number) => void
  setSfxVolume: (v: number) => void
  toggleMute: () => void
  setCurrentTrack: (track: string | null) => void
  toggleFps: () => void
}

export type AudioStore = AudioState & AudioActions

function load(key: string, fallback: number | boolean): number | boolean {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed = JSON.parse(raw)
    if (typeof parsed === typeof fallback) return parsed
    return fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: number | boolean): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* noop */
  }
}

export const useAudioStore = create<AudioStore>((set) => ({
  musicVolume: load(LS_MUSIC, 0.6) as number,
  sfxVolume: load(LS_SFX, 0.8) as number,
  muted: load(LS_MUTED, false) as boolean,
  currentTrack: null,
  showFps: load(LS_FPS, false) as boolean,

  setMusicVolume: (v) => {
    const clamped = Math.min(1, Math.max(0, v))
    save(LS_MUSIC, clamped)
    set({ musicVolume: clamped })
  },

  setSfxVolume: (v) => {
    const clamped = Math.min(1, Math.max(0, v))
    save(LS_SFX, clamped)
    set({ sfxVolume: clamped })
  },

  toggleMute: () =>
    set((s) => {
      const next = !s.muted
      save(LS_MUTED, next)
      return { muted: next }
    }),

  setCurrentTrack: (track) => set({ currentTrack: track }),

  toggleFps: () =>
    set((s) => {
      const next = !s.showFps
      save(LS_FPS, next)
      return { showFps: next }
    }),
}))
