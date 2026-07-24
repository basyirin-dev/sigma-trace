import { describe, it, expect } from 'vitest'
import { renderGrid, createDistrictTiles, GRID_COLS, GRID_ROWS } from './renderGrid'
import { createMockCanvasContext } from '../test-utils'

function uniformMap(districtId: number): number[][] {
  return Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(districtId))
}

describe('renderGrid', () => {
  it('draws a fillRect for every tile', () => {
    const tiles = createDistrictTiles(uniformMap(0))
    const { ctx, calls } = createMockCanvasContext()

    renderGrid(ctx, tiles)

    const fillRects = calls.filter((c) => c.method === 'fillRect')
    expect(fillRects.length).toBe(GRID_COLS * GRID_ROWS)
  })

  it('sets fillStyle to district 0 color for first tile', () => {
    const tiles = createDistrictTiles(uniformMap(0))
    const { ctx, calls } = createMockCanvasContext()

    renderGrid(ctx, tiles)

    const firstFillStyle = calls.find((c) => c.method === 'fillStyle')
    expect(firstFillStyle).toBeDefined()
    expect(firstFillStyle!.args[0]).toBe('#8B4513')
  })

  it('sets district 3 color when map has district 3 tiles', () => {
    const tiles = createDistrictTiles(uniformMap(3))
    const { ctx, calls } = createMockCanvasContext()

    renderGrid(ctx, tiles)

    const firstFillStyle = calls.find((c) => c.method === 'fillStyle')
    expect(firstFillStyle!.args[0]).toBe('#4A7C59')
  })

  it('draws border rects between adjacent districts', () => {
    // Build a 50x50 grid with a vertical split at col 25
    const map: number[][] = []
    for (let row = 0; row < GRID_ROWS; row++) {
      const mapRow: number[] = []
      for (let col = 0; col < GRID_COLS; col++) {
        mapRow.push(col < 25 ? 0 : 1)
      }
      map.push(mapRow)
    }
    const tiles = createDistrictTiles(map)
    const { ctx, calls } = createMockCanvasContext()

    renderGrid(ctx, tiles)

    const borderRects = calls.filter(
      (c) => c.method === 'fillRect' && (c.args[2] as number) < 20,
    )
    expect(borderRects.length).toBeGreaterThan(0)
  })

  it('does not draw interior borders within a single district', () => {
    const tiles = createDistrictTiles(uniformMap(0))
    const { ctx, calls } = createMockCanvasContext()

    renderGrid(ctx, tiles)

    const borderRects = calls.filter(
      (c) => c.method === 'fillRect' && (c.args[2] as number) < 20,
    )
    expect(borderRects.length).toBe(0)
  })
})
