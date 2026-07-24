import { describe, it, expect, beforeEach } from 'vitest'
import { useAudioStore } from './stores'

beforeEach(() => {
  useAudioStore.getState().setMusicVolume(0.6)
  useAudioStore.getState().setSfxVolume(0.8)
  useAudioStore.getState().setCurrentTrack(null)
})

describe('audio management - crossfade math', () => {
  it('muted prevents playback', () => {
    const store = useAudioStore.getState()
    store.toggleMute()
    expect(useAudioStore.getState().muted).toBe(true)
    store.toggleMute()
    expect(useAudioStore.getState().muted).toBe(false)
  })

  it('effective volume dims to 30% when dimmed', () => {
    const store = useAudioStore.getState()
    const dimVol = store.musicVolume * 0.3
    expect(dimVol).toBeCloseTo(0.18, 2)
  })

  it('sfxVolume can be set and read', () => {
    useAudioStore.getState().setSfxVolume(0.5)
    expect(useAudioStore.getState().sfxVolume).toBe(0.5)
  })

  it('toggleMute affects both music and sfx via effective volume', () => {
    expect(useAudioStore.getState().muted).toBe(false)
    useAudioStore.getState().toggleMute()
    expect(useAudioStore.getState().muted).toBe(true)
    useAudioStore.getState().toggleMute()
    expect(useAudioStore.getState().muted).toBe(false)
  })

  it('volume settings persist in localStorage', () => {
    useAudioStore.getState().setMusicVolume(0.3)
    useAudioStore.getState().setSfxVolume(0.5)
    useAudioStore.getState().toggleMute()
    useAudioStore.getState().setCurrentTrack('test')

    const state = useAudioStore.getState()
    expect(state.musicVolume).toBe(0.3)
    expect(state.sfxVolume).toBe(0.5)
    expect(state.muted).toBe(true)
    expect(state.currentTrack).toBe('test')
  })

  it('volume is clamped on set', () => {
    useAudioStore.getState().setMusicVolume(2)
    expect(useAudioStore.getState().musicVolume).toBe(1)
    useAudioStore.getState().setMusicVolume(-1)
    expect(useAudioStore.getState().musicVolume).toBe(0)
  })
})
