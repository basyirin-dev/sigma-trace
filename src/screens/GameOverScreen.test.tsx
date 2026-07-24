import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { GameOverScreen } from './GameOverScreen'
import { useGameStore } from '@shared/stores'

beforeEach(() => {
  useGameStore.getState().reset()
})

function renderGameOver() {
  return render(
    <BrowserRouter>
      <GameOverScreen />
    </BrowserRouter>,
  )
}

describe('GameOverScreen', () => {
  it('renders GAME OVER header', () => {
    renderGameOver()
    expect(screen.getByText('GAME OVER')).toBeInTheDocument()
  })

  it('renders CIVILIZATION COLLAPSE subtitle', () => {
    renderGameOver()
    expect(screen.getByText('CIVILIZATION COLLAPSE')).toBeInTheDocument()
  })

  it('renders post-mortem analysis section', () => {
    renderGameOver()
    expect(screen.getByTestId('postmortem')).toBeInTheDocument()
    expect(screen.getByText('POST-MORTEM ANALYSIS')).toBeInTheDocument()
  })

  it('renders Try Again button', () => {
    renderGameOver()
    expect(screen.getByTestId('try-again-btn')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('preserves detective progress on Try Again', async () => {
    useGameStore.getState().recordCaseGrade('case-01', 'S')
    useGameStore.getState().recordCaseGrade('case-02', 'A')
    useGameStore.getState().unlockCase2()
    useGameStore.getState().unlockCase3()
    useGameStore.getState().deployIntervention('fact-check', 50)

    renderGameOver()

    await userEvent.click(screen.getByTestId('try-again-btn'))
    const after = useGameStore.getState()
    expect(after.caseResults['case-01']).toBe('S')
    expect(after.caseResults['case-02']).toBe('A')
    expect(after.case2Unlocked).toBe(true)
    expect(after.case3Unlocked).toBe(true)
  })

  it('resets strategy state on Try Again', async () => {
    useGameStore.getState().deployIntervention('fact-check', 50)
    useGameStore.getState().deployIntervention('mil-school', 80)
    useGameStore.getState().setCooldown('fact-check', 10)

    renderGameOver()

    await userEvent.click(screen.getByTestId('try-again-btn'))
    const after = useGameStore.getState()
    expect(after.appliedInterventions.length).toBe(0)
    expect(after.cooldowns).toEqual({})
    expect(after.gameStatus).toBe('playing')
  })

  it('shows progress preservation note', () => {
    renderGameOver()
    expect(screen.getByText(/Detective progress is preserved/)).toBeInTheDocument()
  })
})
