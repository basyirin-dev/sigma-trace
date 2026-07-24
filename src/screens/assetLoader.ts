import { preloadMapAssets } from '@strategy/renderers/renderMap'
import { preloadAll } from '@shared/useAudioManager'

const ASSETS = [
  '/assets/logo/GIHA-Logo.svg',
]

export async function preloadAssets(): Promise<boolean> {
  preloadAll()
  const results = await Promise.allSettled([
    ...ASSETS.map((src) => fetch(src, { cache: 'force-cache' }).catch(() => undefined)),
    preloadMapAssets(),
  ])
  return results.some((r) => r.status === 'fulfilled')
}
