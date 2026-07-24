import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { R0TrendGraph } from './R0TrendGraph'
import { useSimulationStore } from '@shared/stores'
import { GRAPH_WIDTH, GRAPH_HEIGHT } from './renderers'

beforeEach(() => {
  useSimulationStore.getState().resetSimulation()
})

describe('R0TrendGraph', () => {
  const getCanvas = () =>
    screen.getByTestId('r0-trend-graph').querySelector('canvas') as HTMLCanvasElement

  it('renders a canvas element', () => {
    render(<R0TrendGraph />)
    expect(getCanvas()).toBeInTheDocument()
  })

  it('sets canvas dimensions to 200x80', () => {
    render(<R0TrendGraph />)
    const canvas = getCanvas()
    expect(canvas.width).toBe(GRAPH_WIDTH)
    expect(canvas.height).toBe(GRAPH_HEIGHT)
  })

  it('renders with empty history without crashing', () => {
    render(<R0TrendGraph />)
    expect(getCanvas()).toBeInTheDocument()
  })

  it('re-renders when store history grows', () => {
    render(<R0TrendGraph />)

    act(() => {
      useSimulationStore.getState().applySnapshot(
        {
          state: { susceptible: 494500, exposed: 2000, infected: 500, recovered: 3000, total: 100000 },
          r0: 0.8,
          sigma: 78,
          phase: 'calm',
          time: 1,
          interventions: [],
        },
        1,
      )
    })

    expect(getCanvas()).toBeInTheDocument()
  })
})
