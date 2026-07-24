import { useEffect, useRef } from 'react'
import { renderR0Trend, GRAPH_WIDTH, GRAPH_HEIGHT } from './renderers'
import { useSimulationStore } from '@shared/stores'
import styles from './R0TrendGraph.module.css'

export function R0TrendGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const history = useSimulationStore((s) => s.r0History)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    renderR0Trend(ctx, history)
  }, [history])

  return (
    <div className={styles.container} data-testid="r0-trend-graph">
      <canvas
        ref={canvasRef}
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
        className={styles.canvas}
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
