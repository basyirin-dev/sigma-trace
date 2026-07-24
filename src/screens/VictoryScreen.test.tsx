import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { VictoryScreen } from './VictoryScreen'
import { useGameStore } from '@shared/stores'

beforeEach(() => {
  useGameStore.getState().reset()
})

function renderVictory() {
  return render(
    <BrowserRouter>
      <VictoryScreen />
    </BrowserRouter>,
  )
}

describe('VictoryScreen', () => {
  it('renders MISSION COMPLETE header', () => {
    renderVictory()
    expect(screen.getByText('MISSION COMPLETE')).toBeInTheDocument()
  })

  it('shows media literacy stat', () => {
    renderVictory()
    expect(screen.getByText('Media Literacy')).toBeInTheDocument()
  })

  it('shows spread rate stat', () => {
    renderVictory()
    expect(screen.getByText('Spread Rate')).toBeInTheDocument()
  })

  it('shows cases solved stat', () => {
    renderVictory()
    expect(screen.getByText('Cases Solved')).toBeInTheDocument()
  })

  it('shows budget stat', () => {
    renderVictory()
    expect(screen.getByText('Budget')).toBeInTheDocument()
  })

  it('shows composite grade', () => {
    const store = useGameStore.getState()
    store.recordCaseGrade('case-01', 'S')
    store.recordCaseGrade('case-02', 'S')
    store.recordCaseGrade('case-03', 'S')
    store.finishCase(-0.2, 0.1, 100)
    store.finishCase(-0.2, 0.1, 100)
    store.finishCase(-0.2, 0.1, 100)
    renderVictory()
    expect(screen.getByText('Composite Grade')).toBeInTheDocument()
  })

  it('shows achievement badges section', () => {
    useGameStore.getState().recordCaseGrade('case-01', 'S')
    useGameStore.getState().recordCaseGrade('case-02', 'S')
    useGameStore.getState().recordCaseGrade('case-03', 'S')
    useGameStore.getState().deployIntervention('fact-check', 50)
    useGameStore.getState().deployIntervention('fact-check', 50)
    useGameStore.getState().deployIntervention('fact-check', 50)
    renderVictory()
    expect(screen.getByTestId('achievement-badges')).toBeInTheDocument()
  })

  it('persists earned badges in game store', async () => {
    useGameStore.getState().recordCaseGrade('case-01', 'S')
    useGameStore.getState().recordCaseGrade('case-02', 'S')
    useGameStore.getState().recordCaseGrade('case-03', 'A')
    useGameStore.getState().deployIntervention('fact-check', 50)
    useGameStore.getState().deployIntervention('fact-check', 50)
    useGameStore.getState().deployIntervention('fact-check', 50)
    renderVictory()
    await waitFor(() => {
      const ids = useGameStore.getState().earnedBadges
      expect(ids).toContain('fact-checker')
      expect(ids).toContain('deepfake-hunter')
      expect(ids).toContain('voice-of-truth')
    })
  })

  it('tracks best case results', async () => {
    useGameStore.getState().recordCaseGrade('case-01', 'B')
    useGameStore.getState().recordCaseGrade('case-01', 'S')
    renderVictory()
    await waitFor(() => {
      expect(useGameStore.getState().bestCaseResults['case-01']).toBe('S')
    })
  })

  it('renders share button', () => {
    renderVictory()
    expect(screen.getByTestId('share-btn')).toBeInTheDocument()
    expect(screen.getByText('Share Scorecard')).toBeInTheDocument()
  })

  it('renders Play Again button', () => {
    renderVictory()
    expect(screen.getByTestId('play-again-btn')).toBeInTheDocument()
    expect(screen.getByText('Play Again')).toBeInTheDocument()
  })

  it('resets game store and navigates home on Play Again click', async () => {
    useGameStore.getState().startCase('case-01')
    useGameStore.getState().finishCase(-0.2, 0.1, 100)
    expect(useGameStore.getState().completedCases).toBe(1)

    renderVictory()

    await userEvent.click(screen.getByTestId('play-again-btn'))
    expect(useGameStore.getState().completedCases).toBe(0)
    expect(useGameStore.getState().mode).toBe('strategy')
  })
})
