import { TILE_SIZE, DISTRICT_QUADRANTS } from './renderGrid'
import type { ActiveEffect } from '@engine/types'
import { INTERVENTION_COLORS, getIntervention } from '@engine/interventions'

const MAX_RING_TILES = 4
const DEPLOY_ANIM_MS = 400

const deployAnims = new Map<string, number>()

export function computeRingThickness(remainingTicks: number, maxDuration: number): number {
  if (remainingTicks <= 0) return 0
  if (maxDuration <= 0) return 1
  return Math.min(MAX_RING_TILES, Math.max(1, Math.ceil((remainingTicks / maxDuration) * MAX_RING_TILES)))
}

export function renderInterventionRings(
  ctx: CanvasRenderingContext2D,
  activeEffects: ActiveEffect[],
  timeMs?: number,
): void {
  const now = timeMs ?? performance.now()

  const activeIds = new Set(activeEffects.map((e) => `${e.interventionId}-${e.districtId ?? 'all'}`))
  for (const key of deployAnims.keys()) {
    if (!activeIds.has(key)) deployAnims.delete(key)
  }

  for (const effect of activeEffects) {
    const key = `${effect.interventionId}-${effect.districtId ?? 'all'}`
    if (!deployAnims.has(key)) {
      deployAnims.set(key, now)
    }
    const deployStart = deployAnims.get(key)!

    const color = INTERVENTION_COLORS[effect.interventionId]
    if (!color) continue

    const intervention = getIntervention(effect.interventionId)
    const maxDuration = intervention?.effect.durationTicks ?? effect.remainingTicks + 10
    const thickness = computeRingThickness(effect.remainingTicks, maxDuration)
    if (thickness <= 0) continue

    const lineWidth = thickness * TILE_SIZE
    let alpha = 0.4
    const elapsed = now - deployStart
    if (elapsed < DEPLOY_ANIM_MS) {
      const t = elapsed / DEPLOY_ANIM_MS
      const pulse = 0.3 + 0.7 * Math.sin(t * Math.PI)
      alpha = 0.6 * pulse
    }

    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.globalAlpha = Math.min(1, alpha)

    const halfLine = lineWidth / 2

    const selectedQuad = effect.districtId !== undefined && effect.districtId >= 0 && effect.districtId < DISTRICT_QUADRANTS.length
      ? DISTRICT_QUADRANTS[effect.districtId]
      : null

    const targetQuads = selectedQuad ? [selectedQuad] : DISTRICT_QUADRANTS

    for (const quad of targetQuads) {
      const x = quad.colStart * TILE_SIZE + halfLine
      const y = quad.rowStart * TILE_SIZE + halfLine
      const w = (quad.colEnd - quad.colStart) * TILE_SIZE - lineWidth
      const h = (quad.rowEnd - quad.rowStart) * TILE_SIZE - lineWidth

      if (w > 0 && h > 0) {
        ctx.strokeRect(x, y, w, h)
      }
    }

    ctx.restore()
  }
}
