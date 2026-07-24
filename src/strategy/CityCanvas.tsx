import { useRef, useCallback } from 'react'
import { useCityLoop } from './useCityLoop'
import type { CityState } from './useCityLoop'
import { useTileInteraction } from './useTileInteraction'
import { renderMap, renderAgents, renderHeatmap, renderTileGlow, renderDistrictPulse, computeDistrictQuadrants, renderInterventionRings, renderParticles, CANVAS_WIDTH, CANVAS_HEIGHT } from './renderers'
import type { Phase } from '@engine/types'
import { useAudioStore } from '@shared/stores/useAudioStore'

export interface CityCanvasProps {
  onDistrictClick?: (districtId: number) => void
  onPhaseChange?: (phase: Phase) => void
  onTick?: (state: CityState) => CityState
  cityPaused?: boolean
  className?: string
}

function renderFrame(ctx: CanvasRenderingContext2D, state: CityState) {
  const dpr = window.devicePixelRatio || 1
  ctx.save()
  ctx.scale(dpr, dpr)
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  renderMap(ctx, state.tiles)

  const districts = computeDistrictQuadrants(state.districtState)
  // Use smoothSigma for heatmap coloring for gradual transitions, keep raw for pulse
  for (const d of districts) d.sigma = state.smoothSigma
  renderHeatmap(ctx, districts)
  const r0Map: Record<string, number> = {}
  for (const d of districts) {
    r0Map[d.id] = d.r0
  }
  renderTileGlow(ctx, state.tiles, r0Map)
  renderDistrictPulse(ctx, districts, performance.now())
  renderInterventionRings(ctx, state.activeEffects)
  renderAgents(ctx, state.agents)
  renderParticles(ctx, state.particles)

  ctx.restore()
}

export function CityCanvas({ onDistrictClick, onPhaseChange, onTick, cityPaused, className }: CityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const showFps = useAudioStore((s) => s.showFps)
  const fpsRef = useRef(0)
  const frameCountRef = useRef(0)
  const fpsTimeRef = useRef(0)

  const onRender = useCallback((ctx: CanvasRenderingContext2D, state: CityState) => {
    renderFrame(ctx, state)

    frameCountRef.current++
    if (!fpsTimeRef.current) fpsTimeRef.current = Date.now()
    const now = Date.now()
    if (now - fpsTimeRef.current >= 1000) {
      fpsRef.current = frameCountRef.current
      frameCountRef.current = 0
      fpsTimeRef.current = now
    }

    if (showFps) {
      ctx.save()
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(4, 4, 56, 18)
      ctx.fillStyle = '#0f0'
      ctx.font = '10px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`${fpsRef.current} FPS`, 8, 16)
      ctx.restore()
    }
  }, [showFps])

  useCityLoop(canvasRef, {
    onRender,
    onTick,
    onPhaseChange,
  })

  useTileInteraction(canvasRef, onDistrictClick)

  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
    <canvas
      ref={canvasRef}
      width={Math.round(CANVAS_WIDTH * dpr)}
      height={Math.round(CANVAS_HEIGHT * dpr)}
      className={className}
      data-testid="city-canvas"
      style={{
        imageRendering: 'pixelated',
        width: CANVAS_WIDTH,
        maxWidth: '100%',
        height: 'auto',
        cursor: 'crosshair',
        border: '2px solid #333',
        borderRadius: '4px',
      }}
    />
    {cityPaused && (
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        zIndex: 20,
      }}>
        <span style={{
          fontFamily: 'monospace',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#f39c12',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        }}>
          PAUSED
        </span>
      </div>
    )}
    </div>
  )
}
