import { useEffect, useRef, useState, useCallback, useLayoutEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { useHintStore } from './stores/useHintStore';
import { Button } from './Button';
import styles from './HintToast.module.css';

const DISMISS_MS = 6000;
const EXIT_MS = 300;

const HintToastItem = memo(function HintToastItem({
  id,
  message,
  onDismiss,
}: {
  id: string;
  message: string;
  onDismiss: () => void;
}) {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<number>(0);
  const onDismissRef = useRef(onDismiss);

  useLayoutEffect(() => {
    onDismissRef.current = onDismiss;
  });

  const handleDismiss = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    window.clearTimeout(timerRef.current);
    setTimeout(() => onDismissRef.current(), EXIT_MS);
  }, [exiting]);

  useEffect(() => {
    timerRef.current = window.setTimeout(handleDismiss, DISMISS_MS);
    return () => window.clearTimeout(timerRef.current);
  }, [handleDismiss]);

  const classNames = [styles.toast, exiting ? styles.out : ''].filter(Boolean).join(' ');

  return (
    <div className={classNames} data-testid={`hint-${id}`} data-exiting={exiting}>
      <span className={styles.message}>{message}</span>
      <Button variant="ghost" size="sm" onClick={handleDismiss} testId={`dismiss-hint-${id}`}>
        ×
      </Button>
    </div>
  );
});

export function HintToastContainer() {
  const hints = useHintStore((s) => s.hints);
  const dismissHint = useHintStore((s) => s.dismissHint);

  if (hints.length === 0) return null;

  return createPortal(
    <div className={styles.container} data-testid="hint-container" role="status" aria-live="polite">
      {hints.map((h) => (
        <HintToastItem
          key={h.id}
          id={h.id}
          message={h.message}
          onDismiss={() => dismissHint(h.id)}
        />
      ))}
    </div>,
    document.body,
  );
}
