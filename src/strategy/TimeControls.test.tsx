import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimeControls } from './TimeControls'

describe('TimeControls', () => {
  const defaultProps = {
    isRunning: true,
    tick: 42,
    speed: 1,
    onTogglePlay: vi.fn(),
    onStep: vi.fn(),
    onSpeedChange: vi.fn(),
  }

  it('renders the controls container', () => {
    render(<TimeControls {...defaultProps} />)
    expect(screen.getByTestId('time-controls')).toBeInTheDocument()
  })

  it('shows pause icon when running', () => {
    render(<TimeControls {...defaultProps} isRunning={true} />)
    const playBtn = screen.getByTestId('play-btn')
    expect(playBtn.textContent).toBe('⏸')
  })

  it('shows play icon when paused', () => {
    render(<TimeControls {...defaultProps} isRunning={false} />)
    const playBtn = screen.getByTestId('play-btn')
    expect(playBtn.textContent).toBe('▶')
  })

  it('toggles play state on click', async () => {
    const user = userEvent.setup()
    render(<TimeControls {...defaultProps} />)
    await user.click(screen.getByTestId('play-btn'))
    expect(defaultProps.onTogglePlay).toHaveBeenCalledTimes(1)
  })

  it('fires step callback on step button click', async () => {
    const user = userEvent.setup()
    render(<TimeControls {...defaultProps} />)
    await user.click(screen.getByTestId('step-btn'))
    expect(defaultProps.onStep).toHaveBeenCalledTimes(1)
  })

  it('renders all 4 speed chips', () => {
    render(<TimeControls {...defaultProps} />)
    expect(screen.getByTestId('speed-1x')).toBeInTheDocument()
    expect(screen.getByTestId('speed-2x')).toBeInTheDocument()
    expect(screen.getByTestId('speed-5x')).toBeInTheDocument()
    expect(screen.getByTestId('speed-10x')).toBeInTheDocument()
  })

  it('fires onSpeedChange when a speed chip is clicked', async () => {
    const user = userEvent.setup()
    render(<TimeControls {...defaultProps} />)
    await user.click(screen.getByTestId('speed-5x'))
    expect(defaultProps.onSpeedChange).toHaveBeenCalledWith(5)
  })

  it('renders speed chips with correct labels', () => {
    render(<TimeControls {...defaultProps} />)
    expect(screen.getByTestId('speed-1x').textContent).toBe('1×')
    expect(screen.getByTestId('speed-2x').textContent).toBe('2×')
    expect(screen.getByTestId('speed-5x').textContent).toBe('5×')
    expect(screen.getByTestId('speed-10x').textContent).toBe('10×')
  })

  it('shows day counter with current tick', () => {
    render(<TimeControls {...defaultProps} tick={99} />)
    const dayCounter = screen.getByTestId('day-counter')
    expect(dayCounter.textContent).toBe('Day 99')
  })

  it('shows Day 0 on first tick', () => {
    render(<TimeControls {...defaultProps} tick={0} />)
    expect(screen.getByTestId('day-counter').textContent).toBe('Day 0')
  })
})
