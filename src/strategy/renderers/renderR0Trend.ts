import { CALM_R0_THRESHOLD, CRISIS_R0_THRESHOLD } from '@engine/constants'

export const GRAPH_WIDTH = 1200
export const GRAPH_HEIGHT = 100
export const MAX_POINTS = 60
export const MAX_R0 = 5.0

const PLOT_LEFT = 12
const PLOT_RIGHT = 1188
const PLOT_TOP = 6
const PLOT_BOTTOM = 94
const PLOT_HEIGHT = PLOT_BOTTOM - PLOT_TOP
const PLOT_WIDTH = PLOT_RIGHT - PLOT_LEFT

const ZONE_GREEN = 'rgba(46, 204, 113, 0.12)'
const ZONE_RED = 'rgba(231, 76, 60, 0.12)'

export function yForR0(r0: number): number {
  const clamped = Math.max(0, Math.min(r0, MAX_R0))
  return PLOT_BOTTOM - (clamped / MAX_R0) * PLOT_HEIGHT
}

export function xForIndex(i: number, total: number): number {
  const spacing = PLOT_WIDTH / (MAX_POINTS - 1)
  const offsetFromRight = total - 1 - i
  return PLOT_RIGHT - offsetFromRight * spacing
}

export function renderR0Trend(ctx: CanvasRenderingContext2D, history: number[]): void {
  const lastR0 = history.length > 0 ? history[history.length - 1]! : 0

  ctx.save()
  ctx.clearRect(0, 0, GRAPH_WIDTH, GRAPH_HEIGHT)

  // background
  ctx.fillStyle = '#16213E'
  ctx.fillRect(0, 0, GRAPH_WIDTH, GRAPH_HEIGHT)

  // green zone (R0 < calm threshold)
  const greenTop = yForR0(CALM_R0_THRESHOLD)
  ctx.fillStyle = ZONE_GREEN
  ctx.fillRect(PLOT_LEFT, greenTop, PLOT_WIDTH, PLOT_BOTTOM - greenTop)

  // red zone (R0 > crisis threshold)
  const redBottom = yForR0(CRISIS_R0_THRESHOLD)
  ctx.fillStyle = ZONE_RED
  ctx.fillRect(PLOT_LEFT, PLOT_TOP, PLOT_WIDTH, redBottom - PLOT_TOP)

  // threshold line at R0 = 1.0
  const thresholdY = yForR0(1.0)
  ctx.strokeStyle = '#E74C3C'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PLOT_LEFT, thresholdY)
  ctx.lineTo(PLOT_RIGHT, thresholdY)
  ctx.stroke()

  // data line
  if (history.length > 1) {
    ctx.strokeStyle = '#4ECDC4'
      ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(xForIndex(0, history.length), yForR0(history[0]!))
    for (let i = 1; i < history.length; i++) {
      ctx.lineTo(xForIndex(i, history.length), yForR0(history[i]!))
    }
    ctx.stroke()

    // data point markers
    for (let i = 0; i < history.length; i++) {
      const px = xForIndex(i, history.length)
      const py = yForR0(history[i]!)
      ctx.fillStyle = '#4ECDC4'
      ctx.beginPath()
      ctx.arc(px, py, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // zone labels
  ctx.fillStyle = '#888'
  ctx.font = '13px monospace'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(`Calm (R₀<${CALM_R0_THRESHOLD.toFixed(1)})`, PLOT_LEFT + 6, PLOT_TOP)
  ctx.fillStyle = '#E74C3C'
  ctx.font = '13px monospace'
  ctx.fillText(`Crisis (R₀>${CRISIS_R0_THRESHOLD.toFixed(1)})`, PLOT_LEFT + 6, redBottom + 6)

  // labels
  ctx.fillStyle = '#E0E0E0'
  ctx.font = '15px monospace'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('R₀', PLOT_LEFT, PLOT_TOP)

  ctx.textAlign = 'right'
  ctx.fillText(lastR0.toFixed(2), PLOT_RIGHT, PLOT_TOP)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'bottom'
  ctx.font = '13px monospace'
  ctx.fillText('1.0', PLOT_LEFT + 6, thresholdY - 2)

  ctx.restore()
}
