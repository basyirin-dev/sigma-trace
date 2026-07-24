import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WarningToastContainer } from './WarningToast'
import { useWarningStore } from '@shared/stores'

beforeEach(() => {
  useWarningStore.getState().clearAll()
})

describe('WarningToastContainer', () => {
  it('renders nothing when no warnings', () => {
    const { container } = render(<WarningToastContainer />)
    expect(container.innerHTML).toBe('')
  })

  it('renders outbreak warning', () => {
    act(() => {
      useWarningStore.getState().addWarning('Outbreak detected')
    })
    render(<WarningToastContainer />)
    expect(screen.getByText('Outbreak detected')).toBeInTheDocument()
  })

  it('renders critical coherence warning', () => {
    act(() => {
      useWarningStore.getState().addWarning('Critical coherence loss')
    })
    render(<WarningToastContainer />)
    expect(screen.getByText('Critical coherence loss')).toBeInTheDocument()
  })

  it('renders district spread warning', () => {
    act(() => {
      useWarningStore.getState().addWarning('District Foundry: uncontained spread')
    })
    render(<WarningToastContainer />)
    expect(screen.getByText('District Foundry: uncontained spread')).toBeInTheDocument()
  })

  it('dismisses warning on close button click', async () => {
    act(() => {
      useWarningStore.getState().addWarning('Outbreak detected')
    })
    render(<WarningToastContainer />)
    const user = userEvent.setup()

    const warningId = useWarningStore.getState().warnings[0]!.id
    const toast = screen.getByTestId(`toast-${warningId}`)
    const dismissBtn = screen.getByTestId(`dismiss-${warningId}`)
    expect(toast.getAttribute('data-exiting')).toBe('false')
    await user.click(dismissBtn)
    expect(toast.getAttribute('data-exiting')).toBe('true')
  })

  it('auto-dismisses warning after 5 seconds', () => {
    vi.useFakeTimers()
    act(() => {
      useWarningStore.getState().addWarning('Outbreak detected')
    })
    render(<WarningToastContainer />)
    expect(screen.getByText('Outbreak detected')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000 + 300)
    })
    expect(screen.queryByText('Outbreak detected')).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it('renders multiple warnings stacked', () => {
    act(() => {
      useWarningStore.getState().addWarning('Outbreak detected')
      useWarningStore.getState().addWarning('Critical coherence loss')
    })
    render(<WarningToastContainer />)
    expect(screen.getByText('Outbreak detected')).toBeInTheDocument()
    expect(screen.getByText('Critical coherence loss')).toBeInTheDocument()
  })
})
