import { describe, it, expect } from 'vitest'
import { renderR0Trend, yForR0, xForIndex, GRAPH_WIDTH, GRAPH_HEIGHT, MAX_POINTS, MAX_R0 } from './renderR0Trend'
import { createMockCanvasContext } from '../test-utils'

describe('yForR0', () => {
  it('maps R0=0 to plot bottom', () => {
    expect(yForR0(0)).toBe(94)
  })

  it('maps R0=3.0 to plot top', () => {
    expect(yForR0(MAX_R0)).toBe(6)
  })

  it('maps R0=1.0 to midpoint', () => {
    const y = yForR0(1.0)
    expect(y).toBeGreaterThan(6)
    expect(y).toBeLessThan(94)
  })

  it('clamps values above MAX_R0', () => {
    expect(yForR0(5.0)).toBe(6)
  })

  it('clamps negative values to 0', () => {
    expect(yForR0(-1)).toBe(94)
  })
})

describe('xForIndex', () => {
  it('places newest point at right edge', () => {
    const x = xForIndex(4, 5)
    expect(x).toBe(1188)
  })

  it('places oldest point to the left of newest', () => {
    const x = xForIndex(0, 5)
    const newest = xForIndex(4, 5)
    expect(x).toBeLessThan(newest)
    expect(x).toBeGreaterThanOrEqual(10)
  })

  it('fills full width with MAX_POINTS', () => {
    const first = xForIndex(0, MAX_POINTS)
    const last = xForIndex(MAX_POINTS - 1, MAX_POINTS)
    expect(last).toBe(1188)
    expect(first).toBe(12)
    expect(last - first).toBe(1176)
  })
})

describe('renderR0Trend', () => {
  it('clears canvas to full dimensions', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderR0Trend(ctx, [0.6, 0.8, 1.2])
    const clear = calls.find((c) => c.method === 'clearRect')
    expect(clear).toBeDefined()
    expect(clear!.args).toEqual([0, 0, GRAPH_WIDTH, GRAPH_HEIGHT])
  })

  it('draws background fill', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderR0Trend(ctx, [0.6])
    const fillRects = calls.filter((c) => c.method === 'fillRect')
    expect(fillRects.length).toBeGreaterThanOrEqual(1)
  })

  it('draws green zone below R0=0.8', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderR0Trend(ctx, [0.6])
    const fillStyleCalls = calls.filter((c) => c.method === 'fillStyle' && (c.args[0] as string).includes('rgba(46, 204, 113'))
    expect(fillStyleCalls.length).toBeGreaterThanOrEqual(1)
  })

  it('draws red zone above R0=1.5', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderR0Trend(ctx, [2.0])
    const fillStyleCalls = calls.filter((c) => c.method === 'fillStyle' && (c.args[0] as string).includes('rgba(231, 76, 60'))
    expect(fillStyleCalls.length).toBeGreaterThanOrEqual(1)
  })

  it('draws threshold line at R0=1.0', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderR0Trend(ctx, [0.6])
    const lineToCalls = calls.filter((c) => c.method === 'lineTo')
    const thresholdLineto = lineToCalls.find((c) => c.args[1] === yForR0(1.0))
    expect(thresholdLineto).toBeDefined()
  })

  it('draws data line segments between consecutive points', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderR0Trend(ctx, [0.6, 1.2, 2.0])
    const lineToCalls = calls.filter((c) => c.method === 'lineTo')
    // 1 threshold line + 2 data segments = 3 lineTo calls
    expect(lineToCalls.length).toBeGreaterThanOrEqual(3)
  })

  it('renders empty history without crashing', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderR0Trend(ctx, [])
    expect(calls.length).toBeGreaterThan(0)
  })

  it('renders single-point history without data line', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderR0Trend(ctx, [0.6])
    const lineToCalls = calls.filter((c) => c.method === 'lineTo')
    // Only threshold line — no data line for 1 point
    expect(lineToCalls.length).toBe(1)
  })

  it('draws line upward when R0 rises', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderR0Trend(ctx, [0.6, 1.5, 2.5])
    const lineToCalls = calls.filter((c) => c.method === 'lineTo')
    // data line has 2 segments (3 points → 2 line segments)
    const dataLineTos = lineToCalls.slice(1) // skip threshold lineTo
    expect(dataLineTos.length).toBe(2)
    // Each lineTo Y should be less than the next (going up on canvas = higher R0)
    // First segment: [0.6] → [1.5], second: [1.5] → [2.5]
    // R0 goes up so Y goes down
    expect((dataLineTos[0]!.args[1] as number)).toBeGreaterThan((dataLineTos[1]!.args[1] as number))
  })
})
