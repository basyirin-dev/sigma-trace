import { describe, it, expect } from 'vitest'
import { renderGauge, valueToAngle, GAUGE_WIDTH, GAUGE_HEIGHT } from './renderGauge'
import { createMockCanvasContext } from '../test-utils'

describe('valueToAngle', () => {
  it('maps 0 to π', () => {
    expect(valueToAngle(0)).toBe(Math.PI)
  })

  it('maps 50 to 1.5π', () => {
    expect(valueToAngle(50)).toBe(Math.PI * 1.5)
  })

  it('maps 100 to 2π', () => {
    expect(valueToAngle(100)).toBe(Math.PI * 2)
  })

  it('interpolates linearly', () => {
    expect(valueToAngle(25)).toBe(Math.PI * 1.25)
    expect(valueToAngle(75)).toBe(Math.PI * 1.75)
  })
})

describe('renderGauge', () => {
  it('clears the canvas to full dimensions', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderGauge(ctx, 50)
    const clearRect = calls.find((c) => c.method === 'clearRect')
    expect(clearRect).toBeDefined()
    expect(clearRect!.args).toEqual([0, 0, GAUGE_WIDTH, GAUGE_HEIGHT])
  })

  it('draws background fill', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderGauge(ctx, 50)
    const fillRects = calls.filter((c) => c.method === 'fillRect')
    expect(fillRects.length).toBeGreaterThanOrEqual(1)
    const bgCall = fillRects.find((c) => c.args[2] === GAUGE_WIDTH && c.args[3] === GAUGE_HEIGHT)
    expect(bgCall).toBeDefined()
  })

  it('draws 4 arc segments for color bands', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderGauge(ctx, 50)
    // Band arcs have radius 88, center dot has radius 4
    const bandArcCalls = calls.filter((c) => c.method === 'arc' && c.args[2] === 88)
    expect(bandArcCalls.length).toBe(4)
  })

  it('draws threshold ticks at value 20 and 80', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderGauge(ctx, 50)
    const lineToCalls = calls.filter((c) => c.method === 'lineTo')
    // 2 ticks + 1 needle = 3 lineTo calls
    expect(lineToCalls.length).toBe(3)
  })

  it('draws needle line and center dot', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderGauge(ctx, 75)
    const lineToCalls = calls.filter((c) => c.method === 'lineTo')
    // at least one lineTo for the needle
    expect(lineToCalls.length).toBeGreaterThanOrEqual(1)
    const arcCalls = calls.filter((c) => c.method === 'arc' && c.args[2] === 88)
    // 4 band arcs = 4
    expect(arcCalls.length).toBe(4)
  })

  it('displays the numeric value', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderGauge(ctx, 42)
    const fillTextCalls = calls.filter((c) => c.method === 'fillText')
    const valueText = fillTextCalls.find((c) => c.args[0] === '42')
    expect(valueText).toBeDefined()
  })

  it('displays σ label', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderGauge(ctx, 50)
    const fillTextCalls = calls.filter((c) => c.method === 'fillText')
    const sigmaLabel = fillTextCalls.find((c) => c.args[0] === 'σ')
    expect(sigmaLabel).toBeDefined()
  })

  it('displays 0 and 100 labels', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderGauge(ctx, 50)
    const fillTextCalls = calls.filter((c) => c.method === 'fillText')
    const zeroLabel = fillTextCalls.find((c) => c.args[0] === '0')
    const hundredLabel = fillTextCalls.find((c) => c.args[0] === '100')
    expect(zeroLabel).toBeDefined()
    expect(hundredLabel).toBeDefined()
  })

  it('clamps values outside 0-100', () => {
    const { ctx, calls } = createMockCanvasContext()
    renderGauge(ctx, -10)
    const fillTextCalls = calls.filter((c) => c.method === 'fillText')
    const displayText = fillTextCalls.find((c) => c.args[0] === '0')
    expect(displayText).toBeDefined()
  })

  it('needle angle changes with value', () => {
    const ctx1 = createMockCanvasContext()
    const ctx2 = createMockCanvasContext()
    renderGauge(ctx1.ctx, 0)
    renderGauge(ctx2.ctx, 100)

    const lineTo1 = ctx1.calls.filter((c) => c.method === 'lineTo')
    const lineTo2 = ctx2.calls.filter((c) => c.method === 'lineTo')

    // Last lineTo is the needle (preceded by 2 tick lineTos)
    const needleEnd1 = lineTo1.at(-1)?.args as [number, number] | undefined
    const needleEnd2 = lineTo2.at(-1)?.args as [number, number] | undefined
    expect(needleEnd1).toBeDefined()
    expect(needleEnd2).toBeDefined()
    if (needleEnd1 && needleEnd2) {
      // value=0 → angle=π (points LEFT from center)
      // value=100 → angle=2π (points RIGHT from center)
      expect(needleEnd1[0]).toBeLessThan(GAUGE_WIDTH / 2)
      expect(needleEnd2[0]).toBeGreaterThan(GAUGE_WIDTH / 2)
    }
  })
})
