import { Button } from '@shared/Button';
import styles from './TimeControls.module.css';

export interface TimeControlsProps {
  isRunning: boolean;
  speed: number;
  onTogglePlay: () => void;
  onStep: () => void;
  onSpeedChange: (speed: number) => void;
  className?: string;
}

const SPEEDS = [1, 2, 5, 10] as const;

export function TimeControls({
  isRunning,
  speed,
  onTogglePlay,
  onStep,
  onSpeedChange,
  className,
}: TimeControlsProps) {
  return (
    <div className={`${styles.controls} ${className ?? ''}`} data-testid="time-controls">
      <div className={styles.group}>
        <Button
          variant="primary"
          size="sm"
          onClick={onTogglePlay}
          testId="play-btn"
          tooltip={isRunning ? 'Pause' : 'Play'}
        >
          {isRunning ? '⏸' : '▶'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onStep}
          testId="step-btn"
          tooltip="Step one tick"
        >
          ⏭
        </Button>
      </div>

      <div className={styles.separator} />

      <div className={styles.group}>
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
    </div>
  );
}
