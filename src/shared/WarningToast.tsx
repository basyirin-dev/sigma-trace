import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { useWarningStore } from '@shared/stores'
import { Button } from './Button'
import styles from './WarningToast.module.css'

const DISMISS_MS = 5000
const EXIT_MS = 300

function WarningToastItem({
  id,
  message,
  onDismiss,
}: {
  id: string
  message: string
  onDismiss: () => void
}) {
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef<number>(0)
  const onDismissRef = useRef(onDismiss)

  useLayoutEffect(() => {
    onDismissRef.current = onDismiss
  })

  const handleDismiss = useCallback(() => {
    if (exiting) return
    setExiting(true)
    window.clearTimeout(timerRef.current)
    setTimeout(() => onDismissRef.current(), EXIT_MS)
  }, [exiting])

  useEffect(() => {
    timerRef.current = window.setTimeout(handleDismiss, DISMISS_MS)
    return () => window.clearTimeout(timerRef.current)
  }, [handleDismiss])

  const classNames = [styles.toast, exiting ? styles.out : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} data-testid={`toast-${id}`} data-exiting={exiting}>
      <span className={styles.message}>{message}</span>
      <Button variant="ghost" size="sm" onClick={handleDismiss} testId={`dismiss-${id}`}>
        ×
      </Button>
    </div>
  )
}

export function WarningToastContainer() {
  const warnings = useWarningStore((s) => s.warnings)
  const dismissWarning = useWarningStore((s) => s.dismissWarning)

  if (warnings.length === 0) return null

  return createPortal(
    <div className={styles.container} data-testid="warning-container" role="status" aria-live="polite">
      {warnings.map((w) => (
        <WarningToastItem
          key={w.id}
          id={w.id}
          message={w.message}
          onDismiss={() => dismissWarning(w.id)}
        />
      ))}
    </div>,
    document.body,
  )
}
