import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { playSfx } from '@shared/useAudioManager'
import type { ToolResult } from './tools/types'
import styles from './ToolResultModal.module.css'

export interface ToolResultModalProps {
  toolName: string
  toolIcon: string
  evidenceLabel: string
  result: ToolResult
  isOpen: boolean
  onClose: () => void
  analyzeDelayMs?: number
}

export function ToolResultModal({
  toolName,
  toolIcon,
  evidenceLabel,
  result,
  isOpen,
  onClose,
  analyzeDelayMs = 150,
}: ToolResultModalProps) {
  const [[barAnimated, analyzing], setFlags] = useState<[boolean, boolean]>([false, analyzeDelayMs > 0])
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    lastFocusRef.current = document.activeElement as HTMLElement
    const analyzeTimer = window.setTimeout(() => {
      setFlags(([b]) => [b, false])
      playSfx('tool-result')
    }, analyzeDelayMs)
    const barTimer = window.setTimeout(() => setFlags(([, a]) => [true, a]), Math.max(analyzeDelayMs - 50, 10))
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(analyzeTimer)
      clearTimeout(barTimer)
      document.body.style.overflow = ''
      lastFocusRef.current?.focus()
    }
  }, [isOpen, analyzeDelayMs])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const confidencePct = Math.round(Math.min(1, Math.max(0, result.confidence)) * 100)
  const barColor =
    confidencePct >= 67 ? '#2ecc71' : confidencePct >= 34 ? '#f39c12' : '#ff4444'

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const modal = (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.sheet} data-testid="result-sheet">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.toolIcon} data-testid="tool-icon">
              {toolIcon}
            </span>
            <div>
              <div className={styles.toolName} data-testid="tool-name">
                {toolName}
              </div>
              <div className={styles.evidenceLabel} data-testid="evidence-label">
                {evidenceLabel}
              </div>
            </div>
          </div>
          <button
            ref={closeRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          {analyzing ? (
            <div className={styles.analyzing} data-testid="analyzing-state">
              <span className={styles.spinner} data-testid="spinner" />
              <span className={styles.analyzingText}>Analyzing evidence...</span>
            </div>
          ) : (
          <>
          <div className={styles.confidence} data-testid="confidence-section">
            <div className={styles.confidenceLabel}>
              <span>Confidence: {confidencePct}%</span>
            </div>
            <div className={styles.confidenceTrack} data-testid="confidence-track">
              <div
                className={styles.confidenceBar}
                data-testid="confidence-bar"
                style={{
                  width: barAnimated ? `${confidencePct}%` : '0%',
                  background: barColor,
                }}
              />
            </div>
          </div>

          <div className={styles.cards} data-testid="finding-cards">
            {result.findings.length === 0 ? (
              <div className={styles.emptyMessage} data-testid="no-findings">
                No findings generated
              </div>
            ) : (
              result.findings.map((finding, i) => (
                <div
                  key={i}
                  className={styles.card}
                  data-testid={`finding-card-${i}`}
                >
                  <span className={styles.cardIcon}>&#x1F50D;</span>
                  <span className={styles.cardText}>{finding}</span>
                </div>
              ))
            )}
          </div>
          <div className={styles.savedLabel} data-testid="saved-label">
            ✓ Finding saved to evidence card
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
