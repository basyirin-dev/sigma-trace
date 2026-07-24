import { TRAP_SIGMA_THRESHOLD, CALM_SIGMA_THRESHOLD } from '@engine/constants'

export const GAUGE_WIDTH = 340
export const GAUGE_HEIGHT = 220

const CX = GAUGE_WIDTH / 2
const CY = 130
const RADIUS = 88
const ARC_WIDTH = 14
const NEEDLE_LENGTH = RADIUS * 0.85

interface ColorBand {
  start: number
  end: number
  color: string
}

const BANDS: ColorBand[] = [
  { start: 0, end: TRAP_SIGMA_THRESHOLD, color: '#E74C3C' },
  { start: TRAP_SIGMA_THRESHOLD, end: 50, color: '#E67E22' },
  { start: 50, end: CALM_SIGMA_THRESHOLD, color: '#F1C40F' },
  { start: CALM_SIGMA_THRESHOLD, end: 100, color: '#2ECC71' },
]

export function valueToAngle(value: number): number {
  return Math.PI + (value / 100) * Math.PI
}

function bandAngle(percent: number): number {
  return Math.PI + (percent / 100) * Math.PI
}

export function renderGauge(ctx: CanvasRenderingContext2D, value: number): void {
  const clamped = Math.max(0, Math.min(100, value))

  ctx.save()
  ctx.clearRect(0, 0, GAUGE_WIDTH, GAUGE_HEIGHT)

  // background
  ctx.fillStyle = '#0F3460'
  ctx.fillRect(0, 0, GAUGE_WIDTH, GAUGE_HEIGHT)

  // arc color bands
  ctx.lineCap = 'butt'
  ctx.lineWidth = ARC_WIDTH
  for (const band of BANDS) {
    const a0 = bandAngle(band.start)
    const a1 = bandAngle(band.end)
    ctx.beginPath()
    ctx.arc(CX, CY, RADIUS, a0, a1, false)
    ctx.strokeStyle = band.color
    ctx.stroke()
  }

  // threshold ticks
  drawTick(ctx, TRAP_SIGMA_THRESHOLD, '#E74C3C')
  drawTick(ctx, CALM_SIGMA_THRESHOLD, '#2ECC71')

  // needle
  const angle = valueToAngle(clamped)
  const nx = CX + Math.cos(angle) * NEEDLE_LENGTH
  const ny = CY + Math.sin(angle) * NEEDLE_LENGTH

  ctx.strokeStyle = '#E0E0E0'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(CX, CY)
  ctx.lineTo(nx, ny)
  ctx.stroke()

  // needle center dot
  ctx.fillStyle = '#E0E0E0'
  ctx.beginPath()
  ctx.arc(CX, CY, 4, 0, Math.PI * 2)
  ctx.fill()

  // value text
  ctx.fillStyle = '#E0E0E0'
  ctx.font = 'bold 36px BoldPixels, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(Math.round(clamped)), CX, CY - 36)

  // σ label
  ctx.font = '16px monospace'
  ctx.fillText('σ', CX, CY + 32)

  // end labels
  ctx.font = '14px monospace'
  ctx.textBaseline = 'top'
  ctx.fillText('0', 14, CY + 6)
  ctx.fillText('100', GAUGE_WIDTH - 20, CY + 6)

  ctx.restore()
}

function drawTick(ctx: CanvasRenderingContext2D, value: number, color: string): void {
  const a = valueToAngle(value)
  const innerR = RADIUS - 4
  const outerR = RADIUS + 6

  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(CX + Math.cos(a) * innerR, CY + Math.sin(a) * innerR)
  ctx.lineTo(CX + Math.cos(a) * outerR, CY + Math.sin(a) * outerR)
  ctx.stroke()
}
