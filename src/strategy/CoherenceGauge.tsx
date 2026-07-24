import { useEffect, useRef } from 'react'
import { renderGauge, GAUGE_WIDTH, GAUGE_HEIGHT } from './renderers'
import styles from './CoherenceGauge.module.css'

export interface CoherenceGaugeProps {
  value: number
  max?: number
}

export function CoherenceGauge({ value, max = 100 }: CoherenceGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const displayRef = useRef(value)
  const rafRef = useRef(0)

  const scaled = max > 0 ? (value / max) * 100 : 0

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx2d = canvas.getContext('2d')
    if (!ctx2d) return
    const ctx: CanvasRenderingContext2D = ctx2d

    const target = Math.max(0, Math.min(100, scaled))

    if (Math.abs(displayRef.current - target) < 0.05) {
      displayRef.current = target
      renderGauge(ctx, target)
      return
    }

    function tick() {
      const current = displayRef.current
      if (Math.abs(current - target) < 0.05) {
        displayRef.current = target
        renderGauge(ctx, target)
        return
      }
      displayRef.current += (target - current) * 0.15
      renderGauge(ctx, displayRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
  }, [scaled])

  return (
    <div className={styles.gauge} data-testid="coherence-gauge">
      <canvas
        ref={canvasRef}
        width={GAUGE_WIDTH}
        height={GAUGE_HEIGHT}
        className={styles.canvas}
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
