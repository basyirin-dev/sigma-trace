import { useState, useCallback, type ChangeEvent } from 'react'
import { Button } from '@shared/Button'
import type { Verdict } from '@engine/types'
import styles from './VerdictPanel.module.css'

export interface VerdictPanelProps {
  onSubmit: (verdict: Verdict, justification: string) => void
  disabled: boolean
  loading?: boolean
  caseTitle?: string
  minJustificationLength?: number
}

const VERDICTS: { id: Verdict; label: string; className: string }[] = [
  { id: 'real', label: 'REAL', className: 'verdictReal' },
  { id: 'manipulated', label: 'MANIPULATED', className: 'verdictManipulated' },
  { id: 'uncertain', label: 'UNCERTAIN', className: 'verdictUncertain' },
]

export function VerdictPanel({
  onSubmit,
  disabled,
  loading = false,
  caseTitle,
  minJustificationLength = 20,
}: VerdictPanelProps) {
  const [selectedVerdict, setSelectedVerdict] = useState<Verdict | null>(null)
  const [justification, setJustification] = useState('')

  const charCount = justification.trim().length
  const canSubmit =
    selectedVerdict !== null && charCount >= minJustificationLength
  const missingVerdict = selectedVerdict === null
  const missingText = charCount < minJustificationLength

  const handleVerdictClick = useCallback((verdict: Verdict) => {
    setSelectedVerdict((prev) => (prev === verdict ? prev : verdict))
  }, [])

  const handleTextChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setJustification(e.target.value)
    },
    [],
  )

  const handleSubmit = useCallback(() => {
    if (!canSubmit || disabled || loading) return
    onSubmit(selectedVerdict!, justification.trim())
  }, [canSubmit, disabled, loading, onSubmit, selectedVerdict, justification])

  const counterClass =
    charCount >= minJustificationLength
      ? styles.counterMet
      : styles.counterUnmet

  return (
    <div className={styles.panel} data-testid="verdict-panel">
      {caseTitle && (
        <div className={styles.title} data-testid="panel-title">
          Verdict for &ldquo;{caseTitle}&rdquo;
        </div>
      )}

      <div className={styles.verdictRow}>
        {VERDICTS.map((v) => {
          const isSelected = selectedVerdict === v.id
          const btnClass = [
            styles.verdictBtn,
            styles[v.className],
            isSelected ? styles.verdictSelected : '',
            disabled ? styles.verdictDisabled : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              key={v.id}
              className={btnClass}
              onClick={() => handleVerdictClick(v.id)}
              disabled={disabled}
              data-testid={`verdict-btn-${v.id}`}
              data-selected={isSelected}
              type="button"
            >
              {v.label}
            </button>
          )
        })}
      </div>

      <textarea
        className={styles.textarea}
        value={justification}
        onChange={handleTextChange}
        placeholder="Explain your reasoning (minimum 20 characters)..."
        disabled={disabled}
        data-testid="verdict-textarea"
        rows={4}
      />

      <div className={styles.counterRow}>
        <span className={counterClass} data-testid="char-counter">
          {charCount} / {minJustificationLength}
        </span>
      </div>

      <div className={styles.submitRow}>
        {!canSubmit && !disabled && !loading && (
          <div className={styles.hint}>
            {missingVerdict && missingText && 'Select a verdict and explain your reasoning'}
            {!missingVerdict && missingText && `Write at least ${minJustificationLength} characters`}
            {missingVerdict && !missingText && 'Select a verdict'}
          </div>
        )}
        <Button
          variant="primary"
          size="lg"
          loading={loading}
          disabled={!canSubmit || disabled || loading}
          onClick={handleSubmit}
          testId="verdict-submit"
          className={styles.submitBtn}
        >
          {loading ? 'VERDICT COMPUTING\u2026' : 'SUBMIT VERDICT'}
        </Button>
      </div>
    </div>
  )
}
