import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockUseRouteError = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useRouteError: () => mockUseRouteError(),
}))

import { ErrorFallback } from './ErrorFallback'

beforeEach(() => {
  mockUseRouteError.mockReturnValue(new Error('Test failure'))
})

describe('ErrorFallback', () => {
  it('renders error heading', () => {
    render(<ErrorFallback />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('displays the error message', () => {
    render(<ErrorFallback />)
    expect(screen.getByText('Test failure')).toBeInTheDocument()
  })

  it('renders Reload button', () => {
    render(<ErrorFallback />)
    expect(screen.getByText('Reload')).toBeInTheDocument()
  })

  it('logs error on Report click', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()

    render(<ErrorFallback />)
    await user.click(screen.getByText('Report'))

    expect(spy).toHaveBeenCalled()
    const firstCall = spy.mock.calls[0]
    expect(firstCall).toBeDefined()
    expect(firstCall![0]).toContain('[GIHA Error Report]')
    expect(firstCall![1]).toBeInstanceOf(Error)

    spy.mockRestore()
  })
})
