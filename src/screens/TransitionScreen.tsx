import { useNavigate, useLocation } from 'react-router-dom'
import styles from './TransitionScreen.module.css'

function asString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined
}

function asNumber(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined
}

export function TransitionScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const raw = location.state as Record<string, unknown> | null
  const hasValidState = raw && typeof raw === 'object' && !Array.isArray(raw)
  const direction = hasValidState && typeof raw.direction === 'string' ? raw.direction : 'to-strategy'
  const caseId = hasValidState ? asString(raw.caseId) : undefined
  const caseTitle = hasValidState ? asString(raw.caseTitle) : undefined
  const caseBrief = hasValidState ? asString(raw.caseBrief) : undefined
  const verdict = hasValidState ? asString(raw.verdict) : undefined
  const r0Delta = hasValidState ? asNumber(raw.r0Delta) : undefined
  const sigmaDelta = hasValidState ? asNumber(raw.sigmaDelta) : undefined
  const budgetBonus = hasValidState ? asNumber(raw.budgetBonus) : undefined

  const handleAction = () => {
    switch (direction) {
      case 'to-detective':
        if (caseId) navigate(`/detective/${caseId}`, { replace: true })
        else navigate('/strategy', { replace: true })
        break
      case 'to-victory':
        navigate('/victory', { replace: true })
        break
      case 'to-gameover':
        navigate('/gameover', { replace: true })
        break
      default:
        navigate('/strategy', { replace: true })
    }
  }

  const badgeText = () => {
    if (direction === 'to-detective') return 'CASE UNLOCKED'
    if (direction === 'to-victory') return 'MISSION COMPLETE'
    if (direction === 'to-gameover') return 'CIVILIZATION COLLAPSE'
    return 'CASE RESOLVED'
  }

  const actionLabel = () => {
    if (direction === 'to-detective') return 'Begin Investigation'
    if (direction === 'to-victory') return 'View Results'
    if (direction === 'to-gameover') return 'View Analysis'
    return 'Return to City'
  }

  return (
    <div className={styles.overlay} data-testid="transition-overlay">
      <div className={styles.card} data-testid="transition-card">
        <div className={styles.badge}>
          {badgeText()}
        </div>

        <div className={styles.divider} />

        {caseTitle && (
          <h2 className={styles.title} data-testid="transition-title">
            &ldquo;{caseTitle}&rdquo;
          </h2>
        )}

        {direction === 'to-detective' && caseBrief && (
          <p className={styles.brief} data-testid="transition-brief">
            {caseBrief}
          </p>
        )}

        {direction === 'to-strategy' && verdict && (
          <div className={styles.verdictBadge} data-testid="transition-verdict">
            Verdict: {verdict.toUpperCase()}
            {verdict !== 'uncertain' && (
              <span className={styles.verdictIcon}>
                {verdict === 'real' ? ' \u2713' : ' \u2717'}
              </span>
            )}
          </div>
        )}

        {(direction === 'to-strategy' || direction === 'to-gameover') && (
          <div className={styles.effects} data-testid="transition-effects">
            {r0Delta !== undefined && (
              <span>R₀: {r0Delta >= 0 ? '+' : ''}{r0Delta.toFixed(1)}</span>
            )}
            {sigmaDelta !== undefined && (
              <span> Σ: +{sigmaDelta.toFixed(0)}</span>
            )}
            {budgetBonus !== undefined && budgetBonus > 0 && (
              <span> Budget: +{budgetBonus}</span>
            )}
          </div>
        )}

        {direction === 'to-detective' && (
          <div className={styles.pauseIndicator} data-testid="transition-pause-indicator">
            ⏸ City simulation paused
          </div>
        )}

        <button
          className={styles.actionBtn}
          onClick={handleAction}
          data-testid="transition-action-btn"
        >
          {actionLabel()}
        </button>
      </div>
    </div>
  )
}
