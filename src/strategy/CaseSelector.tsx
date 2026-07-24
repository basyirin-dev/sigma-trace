import styles from './CaseSelector.module.css'

export interface CaseInfo {
  id: string
  title: string
  brief: string
  hint: string
  unlocked: boolean
}

export interface CaseSelectorProps {
  cases: CaseInfo[]
  onStartCase: (caseId: string) => void
}

export function CaseSelector({ cases, onStartCase }: CaseSelectorProps) {
  if (cases.length === 0) return null

  return (
    <div className={styles.selector} data-testid="case-selector">
      {cases.map((c) => {
        const locked = !c.unlocked
        return (
          <div
            key={c.id}
            className={`${styles.card} ${locked ? styles.locked : styles.unlocked}`}
            data-testid={`case-card-${c.id}`}
            data-unlocked={c.unlocked}
          >
            <div className={styles.cardTop}>
              <span className={styles.icon}>
                {locked ? '\uD83D\uDD12' : '\uD83D\uDD13'}
              </span>
              <div className={styles.cardInfo}>
                <div className={styles.cardTitle} data-testid={`case-title-${c.id}`}>
                  {c.title}
                </div>
                <div className={styles.cardBrief}>
                  {c.brief}
                </div>
              </div>
            </div>

            {locked && (
              <div className={styles.hint} data-testid={`case-hint-${c.id}`}>
                {c.hint}
              </div>
            )}

            {c.unlocked && (
              <button
                className={styles.startBtn}
                onClick={() => onStartCase(c.id)}
                data-testid={`case-start-${c.id}`}
              >
                Investigate
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
