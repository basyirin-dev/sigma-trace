import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DebriefScreen } from './DebriefScreen'
import { calculateScore, type PlayerActions } from './ScoringEngine'
import type { CaseMeta } from './CaseLoader'
import type { Score } from './ScoringEngine'

const case01Meta: CaseMeta = {
  id: 'case-01',
  title: 'The Viral Mayor',
  brief: '',
  milLesson: 'Deepfake detection through multi-modal analysis',
  correctVerdict: 'manipulated',
  difficulty: 'normal',
  solution: {
    requiredConnections: [
      ['evidence-01', 'evidence-02'],
      ['evidence-01', 'evidence-03'],
      ['evidence-03', 'evidence-05'],
    ],
    requiredToolEvidencePairs: [
      ['spectrogram', 'evidence-02'],
      ['frame-stepper', 'evidence-01'],
    ],
    justificationKeywords: ['lip-sync', 'audio artifact', 'synthetic', 'deepfake'],
  },
  outcome: {
    successR0Delta: -0.3,
    successSigmaDelta: 5,
    failR0Delta: 0.4,
    failSigmaDelta: -5,
    partialR0Delta: -0.1,
    partialSigmaDelta: 1,
  },
}

function perfectScore(verdict: string, timeMs = 120_000): Score {
  return calculateScore(case01Meta, {
    verdict: verdict as PlayerActions['verdict'],
    justification:
      'The video shows clear lip-sync mismatch and audio artifacts. The synthetic voice pattern in the spectrogram confirms this is a deepfake.',
    usedTools: ['spectrogram', 'frame-stepper'],
    usedToolEvidencePairs: [
      ['spectrogram', 'evidence-02'],
      ['frame-stepper', 'evidence-01'],
    ],
    evidenceConnections: [
      ['evidence-01', 'evidence-02'],
      ['evidence-01', 'evidence-03'],
      ['evidence-03', 'evidence-05'],
    ],
  }, timeMs)
}

const conclusionText =
  'The video was a deepfake. An AI-generated audio track was synced to Mayor Chen\'s public speeches using a generative adversarial network. The 2-4kHz audio artifact is a signature of current-generation voice synthesis models.'

const milLesson = 'Deepfakes target multiple senses simultaneously. Always verify through audio analysis, frame inspection, and source checking — no single test is sufficient.'

function renderDebrief(overrides?: Record<string, unknown>) {
  const defaults = {
    caseTitle: 'The Viral Mayor',
    correctVerdict: 'manipulated' as const,
    playerVerdict: 'manipulated' as const,
    conclusionText,
    milLesson,
    score: perfectScore('manipulated'),
    onReturn: vi.fn(),
    timeElapsed: 154_000,
  }
  render(<DebriefScreen {...defaults} {...(overrides as Record<string, unknown>)} />)
}

describe('DebriefScreen', () => {
  it('renders header and case title', () => {
    renderDebrief()
    expect(screen.getByTestId('debrief-screen')).toBeInTheDocument()
    expect(screen.getByText('CASE RESOLVED')).toBeInTheDocument()
    expect(screen.getByTestId('debrief-title')).toHaveTextContent('The Viral Mayor')
  })

  it('shows player verdict and correct answer side-by-side', () => {
    renderDebrief()
    const verdicts = screen.getAllByText(/MANIPULATED/)
    expect(verdicts).toHaveLength(2)
  })

  it('correct verdict shows green Correct indicator', () => {
    renderDebrief()
    const verdictRow = screen.getByTestId('verdict-row')
    expect(verdictRow.innerHTML).toContain('Correct')
  })

  it('wrong verdict shows red Incorrect indicator', () => {
    renderDebrief({ playerVerdict: 'real' })
    const verdictRow = screen.getByTestId('verdict-row')
    expect(verdictRow.innerHTML).toContain('Incorrect')
  })

  it('renders conclusion narrative text', () => {
    renderDebrief()
    const el = screen.getByTestId('conclusion-text')
    expect(el).toHaveTextContent('deepfake')
    expect(el).toHaveTextContent('generative adversarial network')
  })

  it('renders MIL Lesson box with header and lesson', () => {
    renderDebrief()
    const box = screen.getByTestId('mil-box')
    expect(box).toHaveTextContent('What you just learned applies to real life')
    expect(box).toHaveTextContent('Deepfakes target multiple senses simultaneously')
  })

  it('displays grade letter', () => {
    renderDebrief()
    expect(screen.getByTestId('grade-letter')).toHaveTextContent('S')
  })

  it('displays numerical score', () => {
    renderDebrief()
    expect(screen.getByTestId('grade-score')).toHaveTextContent('100')
  })

  it('shows all 6 component rows', () => {
    renderDebrief()
    const labels = ['Verdict accuracy', 'Correct tools', 'Tool efficiency', 'Connections', 'Justification', 'Time bonus']
    for (const label of labels) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('time bonus shows correct value in component row', () => {
    renderDebrief()
    const row = screen.getByTestId('component-timeBonus')
    expect(row).toBeInTheDocument()
    expect(row).toHaveTextContent('5')
  })

  it('time bonus shows 0 when overtime', () => {
    renderDebrief({ score: perfectScore('manipulated', 400_000) })
    const row = screen.getByTestId('component-timeBonus')
    expect(row).toHaveTextContent('0')
  })

  it('displays time elapsed', () => {
    renderDebrief()
    expect(screen.getByTestId('debrief-time')).toHaveTextContent('2m 34s')
  })

  it('return button fires onReturn', () => {
    const onReturn = vi.fn()
    renderDebrief({ onReturn })
    fireEvent.click(screen.getByTestId('return-button'))
    expect(onReturn).toHaveBeenCalledTimes(1)
  })

  it('works with case-02 and case-03 score scenarios', () => {
    const { rerender } = render(
      <DebriefScreen
        caseTitle="The Front Page"
        correctVerdict="manipulated"
        playerVerdict="uncertain"
        conclusionText="An image was real but misattributed."
        milLesson="Reverse image search is your first line of defense."
        score={perfectScore('manipulated')}
        onReturn={vi.fn()}
      />,
    )
    expect(screen.getByTestId('debrief-title')).toHaveTextContent('The Front Page')
    expect(screen.getByTestId('grade-letter')).toHaveTextContent('S')

    rerender(
      <DebriefScreen
        caseTitle="Grandma's Distress Call"
        correctVerdict="manipulated"
        playerVerdict="uncertain"
        conclusionText="Score test."
        milLesson="Lesson test."
        score={perfectScore('uncertain')}
        onReturn={vi.fn()}
        timeElapsed={60_000}
      />,
    )
    expect(screen.getByTestId('debrief-title')).toHaveTextContent("Grandma's Distress Call")
    expect(screen.getByTestId('debrief-time')).toHaveTextContent('1m 0s')
  })

  it('shows budget award when budgetBonus > 0', () => {
    render(
      <DebriefScreen
        caseTitle="Test Case"
        correctVerdict="manipulated"
        playerVerdict="manipulated"
        conclusionText="Done."
        milLesson="Lesson."
        score={perfectScore('real')}
        budgetBonus={100}
        onReturn={vi.fn()}
      />,
    )
    expect(screen.getByTestId('budget-award')).toBeInTheDocument()
    expect(screen.getByTestId('budget-award-value')).toHaveTextContent('+100')
  })

  it('does not show budget award when budgetBonus is 0', () => {
    render(
      <DebriefScreen
        caseTitle="Test Case"
        correctVerdict="manipulated"
        playerVerdict="manipulated"
        conclusionText="Done."
        milLesson="Lesson."
        score={perfectScore('real')}
        budgetBonus={0}
        onReturn={vi.fn()}
      />,
    )
    expect(screen.queryByTestId('budget-award')).not.toBeInTheDocument()
  })

  it('does not show budget award when budgetBonus is undefined', () => {
    render(
      <DebriefScreen
        caseTitle="Test Case"
        correctVerdict="manipulated"
        playerVerdict="manipulated"
        conclusionText="Done."
        milLesson="Lesson."
        score={perfectScore('real')}
        onReturn={vi.fn()}
      />,
    )
    expect(screen.queryByTestId('budget-award')).not.toBeInTheDocument()
  })
})
