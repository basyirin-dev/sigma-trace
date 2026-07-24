import { useEffect } from 'react'
import { useGameStore, useWarningStore } from './stores'
import { useAudioStore } from './stores/useAudioStore'

const MUSIC_BASE = '/audio/music'
const SFX_BASE = '/audio/sfx'

const MODE_TRACKS: Record<string, string> = {
  strategy: 'strategy-bg.mp3',
  detective: 'detective-bg.mp3',
}

let musicEl: HTMLAudioElement | null = null
let nextMusicEl: HTMLAudioElement | null = null
let sfxPool: HTMLAudioElement[] = []
let sfxIndex = 0
let preloaded = false

function clamp(v: number): number {
  return Math.min(1, Math.max(0, v))
}

function effectiveVolume(base: number, dimmed: boolean): number {
  const store = useAudioStore.getState()
  if (store.muted) return 0
  const vol = dimmed ? base * 0.3 : base
  return clamp(vol)
}

function getOrCreateMusic(src: string): HTMLAudioElement {
  const el = new Audio(src)
  el.loop = true
  el.preload = 'auto'
  return el
}

function crossfade(from: HTMLAudioElement, to: HTMLAudioElement, baseVol: number, dimmed: boolean): void {
  const steps = 10
  const interval = 100
  const targetVol = effectiveVolume(baseVol, dimmed)
  let step = 0

  to.volume = 0
  void to.play()

  const id = setInterval(() => {
    step++
    from.volume = clamp(targetVol * (1 - step / steps))
    to.volume = clamp(targetVol * (step / steps))
    if (step >= steps || !from.src) {
      from.pause()
      from.currentTime = 0
      clearInterval(id)
    }
  }, interval)
}

export function useAudioManager() {
  useEffect(() => {
    const gameStore = useGameStore.subscribe((state, prevState) => {
      const store = useAudioStore.getState()
      if (store.muted) return
      if (state.mode === prevState.mode) return

      const track = MODE_TRACKS[state.mode]
      if (!track) {
        if (musicEl) {
          musicEl.pause()
          musicEl.currentTime = 0
        }
        useAudioStore.getState().setCurrentTrack(null)
        return
      }

      const src = `${MUSIC_BASE}/${track}`
      const newEl = getOrCreateMusic(src)

      if (musicEl && musicEl.src) {
        crossfade(musicEl, newEl, store.musicVolume, false)
      } else {
      newEl.volume = effectiveVolume(store.musicVolume, false)
      try { void newEl.play() } catch (e) { console.error('[GIHA Audio] play:', e) }
    }

    musicEl = newEl
      useAudioStore.getState().setCurrentTrack(track)
    })

    return () => {
      gameStore()
      stopMusic()
    }
  }, [])

  useEffect(() => {
    const warningStore = useWarningStore.subscribe((state) => {
      if (!musicEl) return
      const store = useAudioStore.getState()
      const dimmed = state.warnings.length > 0
      musicEl.volume = effectiveVolume(store.musicVolume, dimmed)
      if (nextMusicEl) {
        nextMusicEl.volume = effectiveVolume(store.musicVolume, dimmed)
      }
    })

    return () => warningStore()
  }, [])
}

export function preloadAll(): void {
  if (preloaded) return
  preloaded = true

  const tracks = ['title-bg.mp3', 'strategy-bg.mp3', 'detective-bg.mp3']
  for (const track of tracks) {
    const audio = new Audio(`${MUSIC_BASE}/${track}`)
    audio.preload = 'auto'
    audio.load()
  }

  const sfxIds = ['button-click', 'intervention-deploy', 'evidence-found', 'tool-result', 'victory', 'game-over']
  sfxPool = sfxIds.map((id) => {
    const audio = new Audio(`${SFX_BASE}/${id}.wav`)
    audio.preload = 'auto'
    return audio
  })
}

export function playMusic(trackId: string): void {
  if (!trackId) return
  const src = `${MUSIC_BASE}/${trackId}`
  const store = useAudioStore.getState()
  if (store.muted) return
  if (musicEl && musicEl.src.includes(trackId) && !musicEl.paused) return

  const newEl = getOrCreateMusic(src)

  if (musicEl && musicEl.src && !musicEl.paused) {
    crossfade(musicEl, newEl, store.musicVolume, false)
  } else {
    if (musicEl) {
      musicEl.pause()
      musicEl.currentTime = 0
    }
    newEl.volume = effectiveVolume(store.musicVolume, false)
    void newEl.play()
  }

  musicEl = newEl
  useAudioStore.getState().setCurrentTrack(trackId)
}

export function stopAllSfx(): void {
  for (const audio of sfxPool) {
    if (audio && audio.src) {
      audio.pause()
      audio.currentTime = 0
    }
  }
}

export function stopMusic(): void {
  if (musicEl) {
    musicEl.pause()
    musicEl.currentTime = 0
    musicEl = null
  }
  if (nextMusicEl) {
    nextMusicEl.pause()
    nextMusicEl.currentTime = 0
    nextMusicEl = null
  }
  useAudioStore.getState().setCurrentTrack(null)
}

export function playSfx(sfxId: string): void {
  const store = useAudioStore.getState()
  if (store.muted) return

  const isMp3 = sfxId === 'intervention-deploy'
  const ext = isMp3 ? 'mp3' : 'wav'
  const pool = sfxPool
  const idx = sfxIndex % pool.length
  let audio = pool[idx]

  if (!audio || !audio.src.includes(sfxId)) {
    audio = new Audio(`${SFX_BASE}/${sfxId}.${ext}`)
    audio.preload = 'auto'
    pool[idx] = audio
  }

  audio.volume = clamp(store.sfxVolume)
  audio.currentTime = 0
  try { void audio.play() } catch (e) { console.error('[GIHA Audio] sfx:', e) }
  sfxIndex++
}
