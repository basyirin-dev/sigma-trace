import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { routes } from './shared/routes'

function createTestRouter(initialEntries: string[]) {
  return createMemoryRouter(routes, { initialEntries })
}

describe('Router', () => {
  it('renders title screen at /', async () => {
    const router = createTestRouter(['/'])
    render(<RouterProvider router={router} />)
    expect(await screen.findByAltText('GIHA Logo', undefined, { timeout: 3000 })).toBeInTheDocument()
    expect(await screen.findByText('New Game', undefined, { timeout: 3000 })).toBeInTheDocument()
  })

  it('navigates to /strategy on New Game click', async () => {
    const user = userEvent.setup()
    const router = createTestRouter(['/'])
    render(<RouterProvider router={router} />)
    const btn = await screen.findByText('New Game', undefined, { timeout: 3000 })
    await user.click(btn)
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/strategy')
    }, { timeout: 5000 })
  })

  it('renders strategy mode after lazy load', async () => {
    const router = createTestRouter(['/strategy'])
    render(<RouterProvider router={router} />)
    const canvas = await screen.findByTestId('city-canvas', undefined, { timeout: 8000 })
    expect(canvas).toBeInTheDocument()
  })

  it('parses caseId from /detective/:caseId', async () => {
    const router = createTestRouter(['/detective/case-1'])
    render(<RouterProvider router={router} />)
    await waitFor(() => {
      expect(router.state.matches[0]?.params.caseId).toBe('case-1')
    })
  })

  it('renders transition screen at /transition', async () => {
    const router = createTestRouter(['/transition'])
    render(<RouterProvider router={router} />)
    expect(await screen.findByText('CASE RESOLVED', undefined, { timeout: 3000 })).toBeInTheDocument()
  })
})
