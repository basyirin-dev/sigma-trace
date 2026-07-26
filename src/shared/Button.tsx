import { type ReactNode, useCallback } from 'react';
import { Tooltip } from './Tooltip';
import { playSfx } from './useAudioManager';
import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'pixel';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
  testId?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  tooltip,
  onClick,
  className,
  testId,
}: ButtonProps) {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    loading ? styles.loading : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = useCallback(() => {
    playSfx('button-click');
    onClick?.();
  }, [onClick]);

  const button = (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      type="button"
      data-testid={testId}
    >
      {loading && <span className={styles.spinner} data-testid="spinner" />}
      {children}
    </button>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{button}</Tooltip>;
  }

  return button;
}
