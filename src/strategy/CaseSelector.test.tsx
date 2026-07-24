import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CaseSelector, type CaseInfo } from './CaseSelector'

const ALL_CASES: CaseInfo[] = [
  {
    id: 'case-01',
    title: 'AI Deepfake of Mayor Goes Viral',
    brief: 'A manipulated video of the mayor.',
    hint: 'Available from the start',
    unlocked: true,
  },
  {
    id: 'case-02',
    title: "Grandma's Distress Call",
    brief: 'Residents receive AI-cloned voice calls.',
    hint: 'Maintain σ-coherence above 40',
    unlocked: false,
  },
  {
    id: 'case-03',
    title: 'The Front Page Fake',
    brief: 'A photoshopped front-page article.',
    hint: 'Survive 120 ticks with R₀ below 1.0',
    unlocked: false,
  },
]

describe('CaseSelector', () => {
  it('renders all 3 case cards', () => {
    render(<CaseSelector cases={ALL_CASES} onStartCase={vi.fn()} />)
    expect(screen.getByTestId('case-card-case-01')).toBeInTheDocument()
    expect(screen.getByTestId('case-card-case-02')).toBeInTheDocument()
    expect(screen.getByTestId('case-card-case-03')).toBeInTheDocument()
  })

  it('shows case titles', () => {
    render(<CaseSelector cases={ALL_CASES} onStartCase={vi.fn()} />)
    expect(screen.getByTestId('case-title-case-01')).toHaveTextContent('AI Deepfake of Mayor Goes Viral')
    expect(screen.getByTestId('case-title-case-02')).toHaveTextContent("Grandma's Distress Call")
    expect(screen.getByTestId('case-title-case-03')).toHaveTextContent('The Front Page Fake')
  })

  it('shows unlock hint for locked cases', () => {
    render(<CaseSelector cases={ALL_CASES} onStartCase={vi.fn()} />)
    expect(screen.getByTestId('case-hint-case-02')).toHaveTextContent('Maintain σ-coherence above 40')
    expect(screen.getByTestId('case-hint-case-03')).toHaveTextContent('Survive 120 ticks with R₀ below 1.0')
  })

  it('does not show hint for unlocked case', () => {
    render(<CaseSelector cases={ALL_CASES} onStartCase={vi.fn()} />)
    expect(screen.queryByTestId('case-hint-case-01')).not.toBeInTheDocument()
  })

  it('shows Investigate button only for unlocked cases', () => {
    render(<CaseSelector cases={ALL_CASES} onStartCase={vi.fn()} />)
    expect(screen.getByTestId('case-start-case-01')).toBeInTheDocument()
    expect(screen.queryByTestId('case-start-case-02')).not.toBeInTheDocument()
    expect(screen.queryByTestId('case-start-case-03')).not.toBeInTheDocument()
  })

  it('clicking Investigate fires onStartCase with correct caseId', async () => {
    const onStartCase = vi.fn()
    render(<CaseSelector cases={ALL_CASES} onStartCase={onStartCase} />)
    await userEvent.click(screen.getByTestId('case-start-case-01'))
    expect(onStartCase).toHaveBeenCalledWith('case-01')
  })

  it('clicking locked case does nothing (no button)', () => {
    render(<CaseSelector cases={ALL_CASES} onStartCase={vi.fn()} />)
    expect(screen.queryByTestId('case-start-case-02')).not.toBeInTheDocument()
  })

  it('shows unlocked icon (🔓) for unlocked and locked icon (🔒) for locked', () => {
    render(<CaseSelector cases={ALL_CASES} onStartCase={vi.fn()} />)
    expect(screen.getByTestId('case-card-case-01')).toHaveTextContent('\uD83D\uDD13')
    expect(screen.getByTestId('case-card-case-02')).toHaveTextContent('\uD83D\uDD12')
  })

  it('renders nothing when cases array is empty', () => {
    const { container } = render(<CaseSelector cases={[]} onStartCase={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })
})
