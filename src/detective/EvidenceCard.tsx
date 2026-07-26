import { useState, useCallback, useEffect, useRef, type MouseEvent, type DragEvent } from 'react';
import styles from './EvidenceCard.module.css';

export type EvidenceType = 'video' | 'audio' | 'image' | 'text' | 'metadata';

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  label: string;
  description: string;
  isRedHerring: boolean;
  src?: string;
}

export interface EvidenceCardProps {
  evidence: EvidenceItem;
  selected: boolean;
  onSelect: () => void;
  onContextMenu?: (e: MouseEvent) => void;
  onConnectMouseDown?: (e: MouseEvent) => void;
  onDragStart?: (e: DragEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
  isRevealed?: boolean;
  showRedHerringBadge?: boolean;
  evidenceDetails?: string;
  onCardClick?: () => void;
  clickDenied?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const TYPE_LABELS: Record<EvidenceType, string> = {
  video: 'VIDEO',
  audio: 'AUDIO',
  image: 'IMAGE',
  text: 'TEXT',
  metadata: 'META',
};

const TYPE_ICONS: Record<EvidenceType, string> = {
  video: '\u25B6',
  audio: '\u266A',
  image: '\u25A0',
  text: '\u00B6',
  metadata: '\u2699',
};

export function EvidenceCard({
  evidence,
  selected,
  onSelect,
  onContextMenu,
  onConnectMouseDown,
  onDragStart,
  onMouseEnter,
  onMouseLeave,
  style,
  isRevealed = false,
  showRedHerringBadge = false,
  evidenceDetails,
  onCardClick,
  clickDenied = false,
  onKeyDown,
}: EvidenceCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [wasExamined, setWasExamined] = useState(false);
  const [flashDenied, setFlashDenied] = useState(false);
  const prevClickDenied = useRef(false);

  useEffect(() => {
    if (clickDenied && !prevClickDenied.current) {
      setFlashDenied(true);
      const timer = setTimeout(() => setFlashDenied(false), 400);
      prevClickDenied.current = true;
      return () => clearTimeout(timer);
    }
    prevClickDenied.current = clickDenied;
  }, [clickDenied]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (onCardClick) {
        onCardClick();
        return;
      }
      const firstExamine = !wasExamined;
      if (firstExamine) {
        setWasExamined(true);
        onSelect();
      }
      setFlipped((prev) => !prev);
    },
    [wasExamined, onSelect, onCardClick],
  );

  const frontClass = [styles.face, styles.front, styles[evidence.type]].join(' ');

  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''} ${flipped ? styles.flipped : ''} ${flashDenied ? styles.denied : ''}`}
      style={style}
      tabIndex={0}
      role="button"
      draggable
      onDragStart={onDragStart}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e);
      }}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as unknown as MouseEvent);
        }
        if (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) {
          e.preventDefault();
          onContextMenu?.(e as unknown as MouseEvent);
        }
        onKeyDown?.(e);
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid="evidence-card"
      data-evidence-id={evidence.id}
      data-flipped={flipped}
    >
      <div className={styles.inner}>
        <div className={frontClass}>
          <div className={styles.topRow}>
            <span className={styles.typeBadge} data-testid="type-badge">
              <span className={styles.typeBadgeIcon}>{TYPE_ICONS[evidence.type]}</span>
              {TYPE_LABELS[evidence.type]}
            </span>
            <span className={styles.badgeRow}>
              {!wasExamined && (
                <span className={styles.badgeNew} data-testid="badge-new">
                  NEW
                </span>
              )}
              {isRevealed && (
                <span className={styles.badgeRevealed} data-testid="badge-revealed">
                  REVEALED
                </span>
              )}
              {evidence.isRedHerring && showRedHerringBadge && (
                <span className={styles.badgeRedHerring} data-testid="badge-red-herring">
                  RED HERRING
                </span>
              )}
            </span>
          </div>

          <div className={styles.previewArea} data-testid="preview-area">
            {evidence.type === 'video' && (
              <div className={styles.previewVideo} data-testid="preview-video">
                <span className={styles.previewIcon}>{TYPE_ICONS.video}</span>
              </div>
            )}
            {evidence.type === 'audio' && (
              <div className={styles.previewAudio} data-testid="preview-audio">
                {[8, 6, 10, 4, 7, 5, 9, 3].map((h, i) => (
                  <div key={i} className={styles.waveformBar} style={{ height: `${h * 8}%` }} />
                ))}
              </div>
            )}
            {evidence.type === 'image' && (
              <div className={styles.previewImage} data-testid="preview-image">
                <span className={styles.previewIcon}>{TYPE_ICONS.image}</span>
              </div>
            )}
            {evidence.type === 'text' && (
              <div className={styles.previewText} data-testid="preview-text">
                {evidence.description.length > 45
                  ? `${evidence.description.slice(0, 45)}\u2026`
                  : evidence.description}
              </div>
            )}
            {evidence.type === 'metadata' && (
              <div className={styles.previewMetadata} data-testid="preview-metadata">
                <span className={styles.previewIcon}>{TYPE_ICONS.metadata}</span>
              </div>
            )}
          </div>

          <div className={styles.bottomRow}>
            <span className={styles.label}>{evidence.label}</span>
          </div>

          <div
            draggable={false}
            className={styles.connectHandle}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConnectMouseDown?.(e);
            }}
            data-testid="connect-handle-front"
          />
        </div>

        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.backContent} data-testid="card-back">
            <div className={styles.backType}>
              {TYPE_ICONS[evidence.type]} {TYPE_LABELS[evidence.type]}
            </div>
            <div className={styles.backTitle}>{evidence.label}</div>
            <div className={styles.backDivider} />
            <div className={styles.backBody}>
              <p className={styles.backDesc}>{evidence.description}</p>
              {isRevealed && evidenceDetails && (
                <>
                  <div className={styles.backDivider} />
                  <p className={styles.backDetails} data-testid="back-details">
                    {evidenceDetails}
                  </p>
                </>
              )}
            </div>
          </div>

          <div
            draggable={false}
            className={styles.connectHandle}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConnectMouseDown?.(e);
            }}
            data-testid="connect-handle-back"
          />
        </div>
      </div>
    </div>
  );
}
