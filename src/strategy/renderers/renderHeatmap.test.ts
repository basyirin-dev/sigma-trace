import { describe, it, expect } from 'vitest'
import { renderHeatmap, computeDistrictQuadrants } from './renderHeatmap'
import { createMockCanvasContext } from '../test-utils'

describe('renderHeatmap', () => {
  it('draws a fillRect for each district', () => {
    const districtState = {
      foundry: { sigma: 80, r0: 1.2 },
      harborview: { sigma: 60, r0: 1.0 },
      uptown: { sigma: 40, r0: 0.8 },
      campus: { sigma: 20, r0: 1.1 },
    }
    const districts = computeDistrictQuadrants(districtState)
    const { ctx, calls } = createMockCanvasContext()

    renderHeatmap(ctx, districts)

    const fillRects = calls.filter((c) => c.method === 'fillRect')
    expect(fillRects.length).toBe(4)
  })

  it('uses correct alpha per sigma threshold', () => {
    // Each district at a different threshold boundary
    const districtState = {
      foundry: { sigma: 70, r0: 1.2 },  // >= 60 → 0.08
      harborview: { sigma: 50, r0: 1.0 }, // >= 40 → 0.15
      uptown: { sigma: 30, r0: 0.8 },    // >= 20 → 0.30
      campus: { sigma: 10, r0: 1.1 },     // < 20 → 0.45
    }
    const districts = computeDistrictQuadrants(districtState)
    const { ctx, calls } = createMockCanvasContext()

    renderHeatmap(ctx, districts)

    const alphaCalls = calls.filter((c) => c.method === 'globalAlpha' && c.args[0] !== 1)
    expect(alphaCalls[0]!.args[0]).toBe(0.08)
    expect(alphaCalls[1]!.args[0]).toBe(0.15)
    expect(alphaCalls[2]!.args[0]).toBe(0.30)
    expect(alphaCalls[3]!.args[0]).toBe(0.45)
  })

  it('uses 0.45 alpha for sigma below 20', () => {
    const districtState = {
      foundry: { sigma: 5, r0: 1.2 },
      harborview: { sigma: 5, r0: 1.0 },
      uptown: { sigma: 5, r0: 0.8 },
      campus: { sigma: 5, r0: 1.1 },
    }
    const districts = computeDistrictQuadrants(districtState)
    const { ctx, calls } = createMockCanvasContext()

    renderHeatmap(ctx, districts)

    const alphaCalls = calls.filter((c) => c.method === 'globalAlpha' && c.args[0] !== 1)
    for (const call of alphaCalls) {
      expect(call.args[0]).toBe(0.45)
    }
  })

  it('restores globalAlpha to 1 after rendering', () => {
    const districtState = {
      foundry: { sigma: 80, r0: 1.0 },
      harborview: { sigma: 80, r0: 1.0 },
      uptown: { sigma: 80, r0: 1.0 },
      campus: { sigma: 80, r0: 1.0 },
    }
    const districts = computeDistrictQuadrants(districtState)
    const { ctx, calls } = createMockCanvasContext()

    renderHeatmap(ctx, districts)

    const lastAlpha = calls.filter((c) => c.method === 'globalAlpha').at(-1)
    expect(lastAlpha).toBeDefined()
    expect(lastAlpha!.args[0]).toBe(1)
  })

  it('uses green for sigma >= 80', () => {
    const districtState = {
      foundry: { sigma: 85, r0: 1.0 },
      harborview: { sigma: 85, r0: 1.0 },
      uptown: { sigma: 85, r0: 1.0 },
      campus: { sigma: 85, r0: 1.0 },
    }
    const districts = computeDistrictQuadrants(districtState)
    const { ctx, calls } = createMockCanvasContext()

    renderHeatmap(ctx, districts)

    const firstFillStyle = calls.find((c) => c.method === 'fillStyle')
    expect(firstFillStyle!.args[0]).toBe('#2ECC71')
  })

  it('uses red for sigma < 20', () => {
    const districtState = {
      foundry: { sigma: 5, r0: 1.0 },
      harborview: { sigma: 5, r0: 1.0 },
      uptown: { sigma: 5, r0: 1.0 },
      campus: { sigma: 5, r0: 1.0 },
    }
    const districts = computeDistrictQuadrants(districtState)
    const { ctx, calls } = createMockCanvasContext()

    renderHeatmap(ctx, districts)

    const firstFillStyle = calls.find((c) => c.method === 'fillStyle')
    expect(firstFillStyle!.args[0]).toBe('#E74C3C')
  })
})
