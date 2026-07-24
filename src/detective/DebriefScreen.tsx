import { useState, useEffect } from 'react'
import { Button } from '@shared/Button'
import type { Verdict } from '@engine/types'
import { COMPONENT_MAX, type Score } from './ScoringEngine'
import { usePlaytestStore } from '@shared/stores/usePlaytestStore'
import styles from './DebriefScreen.module.css'

function useCountUp(target: number, duration = 800): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let frame: number
    let cancelled = false
    const start = performance.now()
    const tick = (now: number) => {
      if (cancelled) return
      const elapsed = now - start
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [target, duration])
  return value
}

export interface DebriefScreenProps {
  caseTitle: string
  correctVerdict: Verdict
  playerVerdict: Verdict
  conclusionText: string
  conclusionTextExposed?: string
  conclusionTextProtected?: string
  miraOutcome?: 'exposed' | 'protected' | 'undiscovered'
  milLesson: string
  score: Score
  budgetBonus?: number
  onReturn: () => void
  timeElapsed?: number
}

const GRADE_COLORS: Record<string, string> = {
  S: '#f39c12',
  A: '#2ecc71',
  B: '#4ecdc4',
  C: '#f1c40f',
  F: '#e74c3c',
}

const COMPONENT_LABELS: Record<string, string> = {
  accuracy: 'Verdict accuracy',
  correctTools: 'Correct tools',
  toolEfficiency: 'Tool efficiency',
  connections: 'Connections',
  justification: 'Justification',
  timeBonus: 'Time bonus',
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${min}m ${sec}s`
}

export function DebriefScreen({
  caseTitle,
  correctVerdict,
  playerVerdict,
  conclusionText,
  conclusionTextExposed,
  conclusionTextProtected,
  miraOutcome,
  milLesson,
  score,
  budgetBonus,
  onReturn,
  timeElapsed,
}: DebriefScreenProps) {
  useEffect(() => {
    usePlaytestStore.getState().showMonologue('The truth is never simple. But it\u2019s always worth finding.')
  }, [])

  const verdictMatch = playerVerdict === correctVerdict
  const verdictIsUncertain = playerVerdict === 'uncertain'
  const displayConclusion = miraOutcome === 'exposed' && conclusionTextExposed
    ? conclusionTextExposed
    : miraOutcome === 'protected' && conclusionTextProtected
      ? conclusionTextProtected
      : conclusionText

  const verdictClass = verdictMatch
    ? styles.verdictCorrect
    : styles.verdictIncorrect

  const verdictIcon = verdictMatch ? '\u2713' : '\u2717'
  const verdictLabel = verdictMatch
    ? 'Correct'
    : verdictIsUncertain
      ? 'Partial'
      : 'Incorrect'

  const cm = COMPONENT_MAX
  const displayComponents: [string, number, number][] = [
    ['accuracy', score.components.accuracy, cm.accuracy!],
    ['correctTools', score.components.correctTools, cm.correctTools!],
    ['toolEfficiency', score.components.toolEfficiency, cm.toolEfficiency!],
    ['connections', score.components.connections, cm.connections!],
    ['justification', score.components.justification, cm.justification!],
    ['timeBonus', score.components.timeBonus, cm.timeBonus!],
  ]

  const gradeColor = GRADE_COLORS[score.grade] ?? '#888'
  const animatedScore = useCountUp(score.total)

  return (
    <div className={styles.screen} data-testid="debrief-screen">
      <div className={styles.header}>
        <div className={styles.badge}>CASE RESOLVED</div>
        <h2 className={styles.title} data-testid="debrief-title">
          &ldquo;{caseTitle}&rdquo;
        </h2>
      </div>

      <div className={styles.verdictRow} data-testid="verdict-row">
        <div className={verdictClass}>
          <span className={styles.verdictIcon}>{verdictIcon}</span>
          <span>
            Your Verdict: <strong>{playerVerdict.toUpperCase()}</strong>
          </span>
          <span className={styles.verdictLabel}>({verdictLabel})</span>
        </div>
        <div className={styles.verdictCorrect}>
          Correct Answer: <strong>{correctVerdict.toUpperCase()}</strong>
        </div>
      </div>

      {timeElapsed !== undefined && (
        <div className={styles.timeElapsed} data-testid="debrief-time">
          Time: {formatTime(timeElapsed)}
        </div>
      )}

      <div className={styles.conclusion} data-testid="conclusion-text">
        {displayConclusion}
      </div>

      <div className={styles.milBox} data-testid="mil-box">
        <div className={styles.milHeader}>What you just learned applies to real life:</div>
        <p className={styles.milText}>{milLesson}</p>
      </div>

      <div className={styles.scoreSection} data-testid="score-section">
        <div className={styles.gradeCircle} style={{ borderColor: gradeColor, color: gradeColor }}>
          <div className={styles.gradeLetter} data-testid="grade-letter">
            {score.grade}
          </div>
          <div className={styles.gradeScore} data-testid="grade-score">
            {animatedScore}
            <span className={styles.gradeMax}> / {score.maxScore}</span>
          </div>
        </div>

        <div className={styles.components} data-testid="components-list">
          {displayComponents.map(([key, value, max]) => (
            <div key={key} className={styles.componentRow} data-testid={`component-${key}`}>
              <span className={styles.componentLabel}>
                {COMPONENT_LABELS[key]}
              </span>
              <span className={styles.componentScore}>
                {value > 0 && key === 'timeBonus' ? `+${value}` : value}
                {' '}/ {max}
              </span>
              <div className={styles.componentBarBg}>
                <div
                  className={styles.componentBarFill}
                  style={{ width: `${Math.max(0, (value / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {budgetBonus !== undefined && budgetBonus > 0 && (
        <div className={styles.budgetAward} data-testid="budget-award">
          <div className={styles.budgetAwardValue} data-testid="budget-award-value">
            +{budgetBonus}
          </div>
          <div className={styles.budgetAwardLabel}>
            Budget awarded (Grade {score.grade})
          </div>
        </div>
      )}

      <div className={styles.returnRow}>
        <Button
          variant="primary"
          size="lg"
          onClick={onReturn}
          testId="return-button"
          className={styles.returnBtn}
        >
          RETURN TO CITY OVERVIEW
        </Button>
      </div>
    </div>
  )
}
