import { describe, it, expect, beforeEach } from 'vitest'
import { useAudioStore } from './useAudioStore'

beforeEach(() => {
  localStorage.clear()
})

describe('useAudioStore', () => {
  it('initializes with defaults', () => {
    const state = useAudioStore.getState()
    expect(state.musicVolume).toBe(0.6)
    expect(state.sfxVolume).toBe(0.8)
    expect(state.muted).toBe(false)
    expect(state.currentTrack).toBeNull()
  })

  it('setMusicVolume clamps to [0, 1]', () => {
    useAudioStore.getState().setMusicVolume(1.5)
    expect(useAudioStore.getState().musicVolume).toBe(1)

    useAudioStore.getState().setMusicVolume(-0.5)
    expect(useAudioStore.getState().musicVolume).toBe(0)

    useAudioStore.getState().setMusicVolume(0.75)
    expect(useAudioStore.getState().musicVolume).toBe(0.75)
  })

  it('setSfxVolume clamps to [0, 1]', () => {
    useAudioStore.getState().setSfxVolume(2)
    expect(useAudioStore.getState().sfxVolume).toBe(1)

    useAudioStore.getState().setSfxVolume(-1)
    expect(useAudioStore.getState().sfxVolume).toBe(0)
  })

  it('toggleMute flips mute state', () => {
    useAudioStore.getState().toggleMute()
    expect(useAudioStore.getState().muted).toBe(true)

    useAudioStore.getState().toggleMute()
    expect(useAudioStore.getState().muted).toBe(false)
  })

  it('setCurrentTrack stores track id', () => {
    useAudioStore.getState().setCurrentTrack('strategy-bg.mp3')
    expect(useAudioStore.getState().currentTrack).toBe('strategy-bg.mp3')

    useAudioStore.getState().setCurrentTrack(null)
    expect(useAudioStore.getState().currentTrack).toBeNull()
  })
})
