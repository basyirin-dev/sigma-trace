import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VerdictPanel } from './VerdictPanel'

function renderPanel(overrides?: Partial<Parameters<typeof VerdictPanel>[0]>) {
  return render(
    <VerdictPanel
      onSubmit={vi.fn()}
      disabled={false}
      {...overrides}
    />,
  )
}

describe('VerdictPanel', () => {
  it('renders 3 classification buttons', () => {
    renderPanel()
    expect(screen.getByTestId('verdict-btn-real')).toBeInTheDocument()
    expect(screen.getByTestId('verdict-btn-manipulated')).toBeInTheDocument()
    expect(screen.getByTestId('verdict-btn-uncertain')).toBeInTheDocument()
  })

  it('renders justification textarea with placeholder', () => {
    renderPanel()
    const ta = screen.getByTestId('verdict-textarea')
    expect(ta).toBeInTheDocument()
    expect(ta).toHaveAttribute(
      'placeholder',
      expect.stringContaining('minimum 20 characters'),
    )
  })

  it('shows character counter at 0 / 20', () => {
    renderPanel()
    expect(screen.getByTestId('char-counter')).toHaveTextContent('0 / 20')
  })

  it('submit disabled when no classification + empty text', () => {
    renderPanel()
    expect(screen.getByTestId('verdict-submit')).toBeDisabled()
  })

  it('submit disabled when classification selected but text too short', () => {
    renderPanel()
    fireEvent.click(screen.getByTestId('verdict-btn-real'))
    fireEvent.change(screen.getByTestId('verdict-textarea'), {
      target: { value: 'short' },
    })
    expect(screen.getByTestId('verdict-submit')).toBeDisabled()
  })

  it('submit disabled when text >= 20 chars but no classification', () => {
    renderPanel()
    fireEvent.change(screen.getByTestId('verdict-textarea'), {
      target: { value: 'a'.repeat(20) },
    })
    expect(screen.getByTestId('verdict-submit')).toBeDisabled()
  })

  it('submit enabled when classification + text >= 20', () => {
    renderPanel()
    fireEvent.click(screen.getByTestId('verdict-btn-manipulated'))
    fireEvent.change(screen.getByTestId('verdict-textarea'), {
      target: { value: 'a'.repeat(20) },
    })
    expect(screen.getByTestId('verdict-submit')).toBeEnabled()
  })

  it('clicking a button selects it (data-selected), clicking another switches', () => {
    renderPanel()

    fireEvent.click(screen.getByTestId('verdict-btn-real'))
    expect(screen.getByTestId('verdict-btn-real').getAttribute('data-selected')).toBe('true')
    expect(screen.getByTestId('verdict-btn-manipulated').getAttribute('data-selected')).toBe('false')

    fireEvent.click(screen.getByTestId('verdict-btn-manipulated'))
    expect(screen.getByTestId('verdict-btn-real').getAttribute('data-selected')).toBe('false')
    expect(screen.getByTestId('verdict-btn-manipulated').getAttribute('data-selected')).toBe('true')
  })

  it('clicking same button again does NOT deselect (radio behavior)', () => {
    renderPanel()

    fireEvent.click(screen.getByTestId('verdict-btn-uncertain'))
    expect(screen.getByTestId('verdict-btn-uncertain').getAttribute('data-selected')).toBe('true')

    fireEvent.click(screen.getByTestId('verdict-btn-uncertain'))
    expect(screen.getByTestId('verdict-btn-uncertain').getAttribute('data-selected')).toBe('true')
  })

  it('typing updates character counter in real time', () => {
    renderPanel()
    const ta = screen.getByTestId('verdict-textarea')
    fireEvent.change(ta, { target: { value: 'hello world' } })
    expect(screen.getByTestId('char-counter')).toHaveTextContent('11 / 20')
  })

  it('submit calls onSubmit with correct verdict and justification', () => {
    const onSubmit = vi.fn()
    renderPanel({ onSubmit })
    fireEvent.click(screen.getByTestId('verdict-btn-manipulated'))
    fireEvent.change(screen.getByTestId('verdict-textarea'), {
      target: { value: 'This is clearly manipulated because of the audio artifacts and lip-sync mismatch. The spectrogram shows anomalies.' },
    })
    fireEvent.click(screen.getByTestId('verdict-submit'))
    expect(onSubmit).toHaveBeenCalledWith(
      'manipulated',
      'This is clearly manipulated because of the audio artifacts and lip-sync mismatch. The spectrogram shows anomalies.',
    )
  })

  it('disabled prop disables buttons, textarea, and submit', () => {
    renderPanel({ disabled: true })
    expect(screen.getByTestId('verdict-btn-real')).toBeDisabled()
    expect(screen.getByTestId('verdict-btn-manipulated')).toBeDisabled()
    expect(screen.getByTestId('verdict-btn-uncertain')).toBeDisabled()
    expect(screen.getByTestId('verdict-textarea')).toBeDisabled()
    expect(screen.getByTestId('verdict-submit')).toBeDisabled()
  })

  it('loading prop shows spinner on submit button', () => {
    renderPanel({ loading: true })
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
    expect(screen.getByTestId('verdict-submit')).toBeDisabled()
  })
})
