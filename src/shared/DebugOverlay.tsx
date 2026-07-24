import { useEffect } from 'react'
import { usePlaytestStore } from './stores/usePlaytestStore'
import { useGameStore } from './stores/gameStore'
import { useSimulationStore } from './stores/useSimulationStore'

const OVERLAY_STYLE: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0,0,0,0.85)',
    color: '#0f0',
    fontFamily: 'monospace',
    fontSize: 11,
    padding: '6px 12px',
    zIndex: 99999,
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    borderTop: '1px solid #333',
    maxHeight: 160,
    overflowY: 'auto',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 140,
  },
  label: {
    color: '#888',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    color: '#0f0',
    fontSize: 13,
    fontWeight: 'bold',
  },
}

export function DebugOverlay() {
  const isDevMode = usePlaytestStore((s) => s.isDevMode)
  const events = usePlaytestStore((s) => s.events)
  const toggleDevMode = usePlaytestStore((s) => s.toggleDevMode)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
        e.preventDefault()
        toggleDevMode()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleDevMode])

  if (!isDevMode) return null

  const sim = useSimulationStore.getState()
  const game = useGameStore.getState()

  const recentEvents = events.slice(-5).reverse()

  return (
    <div style={OVERLAY_STYLE.container}>
      <div style={OVERLAY_STYLE.section}>
        <span style={OVERLAY_STYLE.label}>State</span>
        <span style={OVERLAY_STYLE.value}>
          σ:{sim.sigma.toFixed(1)} R₀:{sim.r0.toFixed(2)} ${game.budget.toFixed(0)}
        </span>
      </div>
      <div style={OVERLAY_STYLE.section}>
        <span style={OVERLAY_STYLE.label}>Sim</span>
        <span style={OVERLAY_STYLE.value}>
          T:{sim.tick} P:{sim.phase} S:{sim.speed}x
        </span>
      </div>
      <div style={OVERLAY_STYLE.section}>
        <span style={OVERLAY_STYLE.label}>Game</span>
        <span style={OVERLAY_STYLE.value}>
          Mode:{game.mode} Status:{game.gameStatus} Cases:{game.completedCases}/3
        </span>
      </div>
      <div style={OVERLAY_STYLE.section}>
        <span style={OVERLAY_STYLE.label}>Effects ({sim.activeEffects.length})</span>
        <span style={OVERLAY_STYLE.value}>
          {sim.activeEffects.slice(0, 3).map((e) => e.interventionId).join(', ') || '\u2014'}
        </span>
      </div>
      <div style={{ ...OVERLAY_STYLE.section, flex: 1, minWidth: 200 }}>
        <span style={OVERLAY_STYLE.label}>Events ({events.length})</span>
        <div style={{ fontSize: 10, lineHeight: 1.4 }}>
          {recentEvents.map((e) => (
            <div key={e.id}>
              <span style={{ color: '#888' }}>T{e.tick}</span>
              {' '}
              <span style={{ color: '#4ecdc4' }}>{e.type}</span>
              {' '}
              <span style={{ color: '#aaa' }}>
                {JSON.stringify(e.data).slice(0, 60)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={OVERLAY_STYLE.section}>
        <span style={OVERLAY_STYLE.label}>Ctrl+Shift+D</span>
        <span style={{ color: '#f39c12', fontSize: 10 }}>Hide</span>
      </div>
    </div>
  )
}
