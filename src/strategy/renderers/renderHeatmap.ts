import { TILE_SIZE, DISTRICT_QUADRANTS } from './renderGrid'

const HEATMAP_COLORS: Array<[number, string, number]> = [
  [60, '#2ECC71', 0.08],
  [40, '#A8E063', 0.15],
  [20, '#F1C40F', 0.30],
  [0, '#E74C3C', 0.45],
]

export interface DistrictHealth {
  id: string
  sigma: number
  r0: number
  colStart: number
  colEnd: number
  rowStart: number
  rowEnd: number
}

function getHeatmapColor(sigma: number): [string, number] {
  for (const [threshold, color, alpha] of HEATMAP_COLORS) {
    if (sigma >= threshold) return [color, alpha]
  }
  return ['#E74C3C', 0.80]
}

export function renderHeatmap(
  ctx: CanvasRenderingContext2D,
  districts: DistrictHealth[],
): void {
  for (const district of districts) {
    const [color, alpha] = getHeatmapColor(district.sigma)
    ctx.fillStyle = color
    ctx.globalAlpha = alpha

    const x = district.colStart * TILE_SIZE
    const y = district.rowStart * TILE_SIZE
    const w = (district.colEnd - district.colStart) * TILE_SIZE
    const h = (district.rowEnd - district.rowStart) * TILE_SIZE

    ctx.fillRect(x, y, w, h)
  }

  ctx.globalAlpha = 1
}

export function renderDistrictPulse(
  ctx: CanvasRenderingContext2D,
  districts: DistrictHealth[],
  timeMs: number,
): void {
  for (let i = 0; i < districts.length; i++) {
    const district = districts[i]!
    if (district.r0 <= 1.0) continue
    const phase = (i * Math.PI) / 2
    const pulse = (Math.sin(timeMs / 1000 * Math.PI + phase) + 1) / 2
    const alpha = pulse * 0.12

    ctx.fillStyle = `rgba(255, 100, 0, ${alpha.toFixed(3)})`
    ctx.fillRect(
      district.colStart * TILE_SIZE,
      district.rowStart * TILE_SIZE,
      (district.colEnd - district.colStart) * TILE_SIZE,
      (district.rowEnd - district.rowStart) * TILE_SIZE,
    )
  }
}

export function computeDistrictQuadrants(
  districtState: Record<string, { sigma: number; r0: number }>,
): DistrictHealth[] {
  return DISTRICT_QUADRANTS.map((q) => {
    const ds = districtState[q.id]
    return {
      id: q.id,
      sigma: ds?.sigma ?? 50,
      r0: ds?.r0 ?? 1,
      colStart: q.colStart,
      colEnd: q.colEnd,
      rowStart: q.rowStart,
      rowEnd: q.rowEnd,
    }
  })
}
