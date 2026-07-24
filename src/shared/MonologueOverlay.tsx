import { useEffect } from 'react'
import { usePlaytestStore } from './stores/usePlaytestStore'

const OVERLAY_STYLE: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100000,
    cursor: 'pointer',
  },
  box: {
    maxWidth: 480,
    padding: '24px 32px',
    background: '#1a1a2e',
    border: '1px solid rgba(78, 205, 196, 0.4)',
    borderRadius: 8,
    textAlign: 'center',
    pointerEvents: 'auto',
  },
  text: {
    fontFamily: 'monospace',
    fontSize: 16,
    lineHeight: 1.6,
    color: '#4ecdc4',
    fontStyle: 'italic',
  },
  clue: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#666',
    marginTop: 16,
  },
}

const AUTO_DISMISS_DELAY = 4000

export function MonologueOverlay() {
  const activeMonologue = usePlaytestStore((s) => s.activeMonologue)
  const dismissMonologue = usePlaytestStore((s) => s.dismissMonologue)

  useEffect(() => {
    if (!activeMonologue) return
    const timer = setTimeout(() => dismissMonologue(), AUTO_DISMISS_DELAY)
    return () => clearTimeout(timer)
  }, [activeMonologue, dismissMonologue])

  if (!activeMonologue) return null

  return (
    <div
      style={OVERLAY_STYLE.backdrop}
      onClick={() => dismissMonologue()}
    >
      <div style={OVERLAY_STYLE.box} onClick={(e) => e.stopPropagation()}>
        <div style={OVERLAY_STYLE.text}>{activeMonologue}</div>
        <div style={OVERLAY_STYLE.clue}>Click anywhere to dismiss</div>
      </div>
    </div>
  )
}
