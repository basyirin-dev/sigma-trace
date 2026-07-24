import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingScreen } from './LoadingScreen'

afterEach(() => {
  vi.useRealTimers()
})

describe('LoadingScreen', () => {
  it('renders GIHA logo', () => {
    render(<LoadingScreen onComplete={vi.fn()} />)
    expect(screen.getByTestId('loading-logo')).toBeInTheDocument()
  })

  it('renders progress track', () => {
    render(<LoadingScreen onComplete={vi.fn()} />)
    expect(screen.getByTestId('loading-track')).toBeInTheDocument()
  })

  it('renders progress bar', () => {
    render(<LoadingScreen onComplete={vi.fn()} />)
    expect(screen.getByTestId('loading-bar')).toBeInTheDocument()
  })

  it('renders Did you know tip', () => {
    render(<LoadingScreen onComplete={vi.fn()} />)
    expect(screen.getByText('Did you know?')).toBeInTheDocument()
  })

  it('shows loading screen', () => {
    render(<LoadingScreen onComplete={vi.fn()} />)
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument()
  })
})
