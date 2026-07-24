import { describe, it, expect } from 'vitest'
import { createMockCanvasContext } from '../test-utils'
import { renderInterventionRings, computeRingThickness } from './renderInterventionRings'
import type { ActiveEffect } from '@engine/types'

describe('computeRingThickness', () => {
  it('returns 0 for remainingTicks <= 0', () => {
    expect(computeRingThickness(0, 60)).toBe(0)
    expect(computeRingThickness(-1, 60)).toBe(0)
  })

  it('returns at least 1 for positive remainingTicks', () => {
    expect(computeRingThickness(1, 60)).toBe(1)
  })

  it('scales thickness proportionally to remainingTicks', () => {
    const tFull = computeRingThickness(60, 60)
    const tHalf = computeRingThickness(30, 60)
    expect(tFull).toBeGreaterThan(tHalf)
    expect(tHalf).toBeGreaterThan(0)
  })

  it('caps at MAX_RING_TILES for full duration', () => {
    expect(computeRingThickness(60, 60)).toBe(4)
    expect(computeRingThickness(100, 100)).toBe(4)
  })
})

describe('renderInterventionRings', () => {
  it('does nothing when activeEffects is empty', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderInterventionRings(ctx, [])
    expect(calls.filter((c) => c.method === 'strokeRect')).toHaveLength(0)
  })

  it('draws strokeRect for each district when effect is active', () => {
    const { ctx, calls } = createMockCanvasContext()
    const effects: ActiveEffect[] = [
      { interventionId: 'fact-check', remainingTicks: 30, r0Delta: -0.2, sigmaDelta: 0 },
    ]
    renderInterventionRings(ctx, effects)
    // 4 districts × 1 effect = 4 strokeRect calls
    const strokes = calls.filter((c) => c.method === 'strokeRect')
    expect(strokes).toHaveLength(4)
  })

  it('draws with correct strokeStyle color', () => {
    const { ctx, calls } = createMockCanvasContext()
    const effects: ActiveEffect[] = [
      { interventionId: 'fact-check', remainingTicks: 30, r0Delta: -0.2, sigmaDelta: 0 },
    ]
    renderInterventionRings(ctx, effects)
    const strokeCalls = calls.filter((c) => c.method === 'strokeStyle' || c.method === 'lineWidth')
    expect(strokeCalls.some((c) => c.args[0] === '#3498DB')).toBe(true)
  })

  it('sets lineWidth proportional to ring thickness', () => {
    const { ctx, calls } = createMockCanvasContext()

    const effects: ActiveEffect[] = [
      { interventionId: 'fact-check', remainingTicks: 30, r0Delta: -0.2, sigmaDelta: 0 },
    ]
    renderInterventionRings(ctx, effects)
    const lineWidthCalls = calls.filter((c) => c.method === 'lineWidth')
    expect(lineWidthCalls.length).toBeGreaterThan(0)
    const width = lineWidthCalls[0]!.args[0] as number
    expect(width).toBeGreaterThan(0)
  })

  it('draws multiple strokeRects for overlapping effects', () => {
    const { ctx, calls } = createMockCanvasContext()
    const effects: ActiveEffect[] = [
      { interventionId: 'fact-check', remainingTicks: 30, r0Delta: -0.2, sigmaDelta: 0 },
      { interventionId: 'mil-school', remainingTicks: 30, r0Delta: 0, sigmaDelta: 2 },
    ]
    renderInterventionRings(ctx, effects)
    const strokes = calls.filter((c) => c.method === 'strokeRect')
    // 4 districts × 2 effects = 8 strokeRect calls
    expect(strokes).toHaveLength(8)
  })

  it('does nothing when effect remainingTicks is 0', () => {
    const { ctx, calls } = createMockCanvasContext()
    const effects: ActiveEffect[] = [
      { interventionId: 'fact-check', remainingTicks: 0, r0Delta: -0.2, sigmaDelta: 0 },
    ]
    renderInterventionRings(ctx, effects)
    const strokes = calls.filter((c) => c.method === 'strokeRect')
    expect(strokes).toHaveLength(0)
  })

  it('ignores unknown interventionId', () => {
    const { ctx, calls } = createMockCanvasContext()
    const effects: ActiveEffect[] = [
      { interventionId: 'unknown', remainingTicks: 30, r0Delta: -0.2, sigmaDelta: 0 },
    ]
    renderInterventionRings(ctx, effects)
    const strokes = calls.filter((c) => c.method === 'strokeRect')
    expect(strokes).toHaveLength(0)
  })

  it('calls save and restore for each effect', () => {
    const { ctx, calls } = createMockCanvasContext()
    const effects: ActiveEffect[] = [
      { interventionId: 'fact-check', remainingTicks: 30, r0Delta: -0.2, sigmaDelta: 0 },
      { interventionId: 'mil-school', remainingTicks: 30, r0Delta: 0, sigmaDelta: 2 },
    ]
    renderInterventionRings(ctx, effects)
    const saves = calls.filter((c) => c.method === 'save').length
    const restores = calls.filter((c) => c.method === 'restore').length
    expect(saves).toBe(2)
    expect(restores).toBe(2)
  })
})
