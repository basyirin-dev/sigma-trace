import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { TOOL_TUTORIALS } from './toolTutorials'
import styles from './ToolTutorialOverlay.module.css'

export interface ToolTutorialOverlayProps {
  toolId: string
  toolName: string
  toolIcon: string
  isOpen: boolean
  onDismiss: () => void
}

export function ToolTutorialOverlay({
  toolId,
  toolName,
  toolIcon,
  isOpen,
  onDismiss,
}: ToolTutorialOverlayProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  const tutorial = TOOL_TUTORIALS[toolId]

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onDismiss])

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus()
    }
  }, [isOpen])

  if (!isOpen || !tutorial) return null

  const modal = (
    <div className={styles.backdrop}>
      <div className={styles.card} data-testid="tutorial-card">
        <div className={styles.cardHeader}>
          <span className={styles.toolIcon}>{toolIcon}</span>
          <span className={styles.toolName} data-testid="tutorial-tool-name">
            {toolName}
          </span>
        </div>

        <div className={styles.badge}>What to look for</div>

        <div className={styles.tipBlock}>
          <span className={styles.tipPrefix}>Did you know?</span>
          <p className={styles.tipText} data-testid="tutorial-tip">{tutorial.tip}</p>
        </div>

        <ul className={styles.indicators} data-testid="tutorial-indicators">
          {tutorial.indicators.map((item, i) => (
            <li key={i} className={styles.indicator} data-testid={`tutorial-indicator-${i}`}>
              <span className={styles.bullet}>&#x25B8;</span>
              {item}
            </li>
          ))}
        </ul>

        <button
          ref={closeRef}
          className={styles.gotItBtn}
          onClick={onDismiss}
          data-testid="got-it-btn"
        >
          Got it
        </button>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
