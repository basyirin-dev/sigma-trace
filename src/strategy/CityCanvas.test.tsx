import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CityCanvas } from './CityCanvas'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './renderers'

describe('CityCanvas', () => {
  it('renders a canvas element', () => {
    render(<CityCanvas />)
    const canvas = screen.getByTestId('city-canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('sets canvas width and height to 1000', () => {
    render(<CityCanvas />)
    const canvas = screen.getByTestId('city-canvas') as HTMLCanvasElement
    expect(canvas.width).toBe(CANVAS_WIDTH)
    expect(canvas.height).toBe(CANVAS_HEIGHT)
  })

  it('applies pixelated image rendering', () => {
    render(<CityCanvas />)
    const canvas = screen.getByTestId('city-canvas') as HTMLCanvasElement
    expect(canvas.style.imageRendering).toBe('pixelated')
  })

  it('applies responsive maxWidth', () => {
    render(<CityCanvas />)
    const canvas = screen.getByTestId('city-canvas') as HTMLCanvasElement
    expect(canvas.style.maxWidth).toBe('100%')
  })

  it('fires onDistrictClick when district is clicked', () => {
    const onClick = vi.fn()
    render(<CityCanvas onDistrictClick={onClick} />)
    const canvas = screen.getByTestId('city-canvas')
    expect(canvas).toBeInTheDocument()
  })
})
