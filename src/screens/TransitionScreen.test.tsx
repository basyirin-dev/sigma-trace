import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { TransitionScreen } from './TransitionScreen'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('TransitionScreen', () => {
  it('renders CASE UNLOCKED badge with title', () => {
    const navigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(navigate)

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/transition', state: { direction: 'to-detective', caseId: 'case-1', caseTitle: 'Deepfake Video' } },
        ]}
      >
        <TransitionScreen />
      </MemoryRouter>,
    )

    expect(screen.getByText('CASE UNLOCKED')).toBeInTheDocument()
    expect(screen.getByText(/Deepfake Video/)).toBeInTheDocument()
  })

  it('renders CASE RESOLVED badge with verdict', () => {
    const navigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(navigate)

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/transition', state: { direction: 'to-strategy', caseTitle: 'Deepfake Video', verdict: 'manipulated' } },
        ]}
      >
        <TransitionScreen />
      </MemoryRouter>,
    )

    expect(screen.getByText('CASE RESOLVED')).toBeInTheDocument()
    expect(screen.getByText(/MANIPULATED/)).toBeInTheDocument()
  })

  it('shows brief text for to-detective direction', () => {
    const navigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(navigate)

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/transition', state: { direction: 'to-detective', caseId: 'case-1', caseTitle: 'Test', caseBrief: 'A test case brief' } },
        ]}
      >
        <TransitionScreen />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('transition-brief')).toHaveTextContent('A test case brief')
  })

  it('shows effects summary for to-strategy direction', () => {
    const navigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(navigate)

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/transition', state: { direction: 'to-strategy', caseTitle: 'Test', verdict: 'real', r0Delta: -0.3, sigmaDelta: 0.2, budgetBonus: 100 } },
        ]}
      >
        <TransitionScreen />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('transition-effects')).toHaveTextContent('R₀')
    expect(screen.getByTestId('transition-effects')).toHaveTextContent('+100')
  })

  it('renders Begin Investigation button for to-detective', () => {
    const navigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(navigate)

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/transition', state: { direction: 'to-detective', caseId: 'case-1' } },
        ]}
      >
        <TransitionScreen />
      </MemoryRouter>,
    )

    expect(screen.getByText('Begin Investigation')).toBeInTheDocument()
  })

  it('renders Return to City button for to-strategy', () => {
    const navigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(navigate)

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/transition', state: { direction: 'to-strategy' } },
        ]}
      >
        <TransitionScreen />
      </MemoryRouter>,
    )

    expect(screen.getByText('Return to City')).toBeInTheDocument()
  })

  it('navigates to /detective/:caseId on Begin Investigation click', async () => {
    const navigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(navigate)

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/transition', state: { direction: 'to-detective', caseId: 'case-2', caseTitle: 'Test' } },
        ]}
      >
        <TransitionScreen />
      </MemoryRouter>,
    )

    await userEvent.click(screen.getByTestId('transition-action-btn'))
    expect(navigate).toHaveBeenCalledWith('/detective/case-2', { replace: true })
  })

  it('navigates to /strategy on Return to City click', async () => {
    const navigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(navigate)

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/transition', state: { direction: 'to-strategy' } },
        ]}
      >
        <TransitionScreen />
      </MemoryRouter>,
    )

    await userEvent.click(screen.getByTestId('transition-action-btn'))
    expect(navigate).toHaveBeenCalledWith('/strategy', { replace: true })
  })

  it('shows city paused indicator for to-detective direction', () => {
    const navigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(navigate)

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/transition', state: { direction: 'to-detective', caseId: 'case-1', caseTitle: 'Test' } },
        ]}
      >
        <TransitionScreen />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('transition-pause-indicator')).toHaveTextContent('City simulation paused')
  })
})
