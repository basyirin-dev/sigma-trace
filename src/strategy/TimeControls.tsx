import { Button } from '@shared/Button'
import styles from './TimeControls.module.css'

export interface TimeControlsProps {
  isRunning: boolean
  tick: number
  speed: number
  onTogglePlay: () => void
  onStep: () => void
  onSpeedChange: (speed: number) => void
}

const SPEEDS = [1, 2, 5, 10] as const

export function TimeControls({
  isRunning,
  tick,
  speed,
  onTogglePlay,
  onStep,
  onSpeedChange,
}: TimeControlsProps) {
  return (
    <div className={styles.controls} data-testid="time-controls">
      <div className={styles.group}>
        <Button variant="primary" size="sm" onClick={onTogglePlay} testId="play-btn" tooltip={isRunning ? 'Pause' : 'Play'}>
          {isRunning ? '⏸' : '▶'}
        </Button>
        <Button variant="secondary" size="sm" onClick={onStep} testId="step-btn" tooltip="Step one tick">
          ⏭
        </Button>
      </div>

      <div className={styles.separator} />

      <div className={styles.group}>
        <span className={styles.speedLabel}>Speed:</span>
        {SPEEDS.map((s) => (
          <Button
            key={s}
            variant={speed === s ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onSpeedChange(s)}
            testId={`speed-${s}x`}
            tooltip={`Set speed to ${s}×`}
          >
            {s}×
          </Button>
        ))}
      </div>

      <div className={styles.separator} />

      <div className={styles.dayCounter} data-testid="day-counter">
        Day {tick}
      </div>
    </div>
  )
}
