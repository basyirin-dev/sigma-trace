import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoherenceGauge } from './CoherenceGauge'
import { GAUGE_WIDTH, GAUGE_HEIGHT } from './renderers'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('CoherenceGauge', () => {
  const getCanvas = () =>
    screen.getByTestId('coherence-gauge').querySelector('canvas') as HTMLCanvasElement

  it('renders a canvas element', () => {
    render(<CoherenceGauge value={50} />)
    expect(getCanvas()).toBeInTheDocument()
  })

  it('sets canvas width and height', () => {
    render(<CoherenceGauge value={50} />)
    const canvas = getCanvas()
    expect(canvas.width).toBe(GAUGE_WIDTH)
    expect(canvas.height).toBe(GAUGE_HEIGHT)
  })

  it('applies pixelated image rendering', () => {
    render(<CoherenceGauge value={50} />)
    expect(getCanvas().style.imageRendering).toBe('pixelated')
  })

  it('renders with value 0', () => {
    render(<CoherenceGauge value={0} />)
    expect(screen.getByTestId('coherence-gauge')).toBeInTheDocument()
  })

  it('renders with value 100', () => {
    render(<CoherenceGauge value={100} />)
    expect(screen.getByTestId('coherence-gauge')).toBeInTheDocument()
  })

  it('renders with custom max', () => {
    render(<CoherenceGauge value={50} max={200} />)
    expect(screen.getByTestId('coherence-gauge')).toBeInTheDocument()
  })
})
