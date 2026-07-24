import { useRouteError } from 'react-router-dom'
import { Button } from './Button'
import styles from './ErrorFallback.module.css'

interface ErrorFallbackProps {
  error?: Error | null
  onReset?: () => void
}

export function ErrorFallback({ error: propError, onReset }: ErrorFallbackProps = {}) {
  const routeError = useRouteError()
  const error = propError || routeError
  const message = error instanceof Error ? error.message : String(error ?? 'Unknown error')

  const handleReset = () => {
    if (onReset) {
      onReset()
    } else {
      window.location.reload()
    }
  }

  const handleReport = () => {
    console.error('[GIHA Error Report]', error)
    window.alert('Error report logged. Please share this with the development team.')
  }

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.icon}>&#9888;</div>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.message}>
          An unexpected error occurred. Please try reloading the page.
        </p>
        <details>
          <summary className={styles.errorSummary}>
            Error details
          </summary>
          <pre className={styles.details}>{message}</pre>
        </details>
        <div className={styles.actions}>
          <Button onClick={handleReset}>
            {onReset ? 'Retry' : 'Reload'}
          </Button>
          <Button variant="ghost" onClick={handleReport}>
            Report
          </Button>
        </div>
      </div>
    </div>
  )
}
