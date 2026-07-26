import { useRef, useEffect } from 'react';
import { getIntervention, INTERVENTION_COLORS } from '@engine/interventions';
import type { DeploymentEntry } from '@shared/stores';

export interface InterventionTimelineProps {
  entries: DeploymentEntry[];
}

export function InterventionTimeline({ entries }: InterventionTimelineProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [entries.length]);

  const containerStyle: React.CSSProperties = {
    border: '1px solid #2a3a5e',
    background: '#16213e',
    maxHeight: '380px',
    overflowY: 'auto',
    fontFamily: 'monospace',
    fontSize: '13px',
  };

  const headerStyle: React.CSSProperties = {
    padding: '10px 14px',
    borderBottom: '1px solid #333',
    color: '#8892b0',
    fontWeight: 600,
    fontSize: '15px',
    position: 'sticky',
    top: 0,
    background: '#16213e',
  };

  const emptyStyle: React.CSSProperties = {
    padding: '32px 16px',
    color: '#555',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  };

  const emptyIconStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    border: '2px solid #2a3a5e',
    background: '#0F3460',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  return (
    <div data-testid="intervention-timeline" style={containerStyle}>
      <div style={headerStyle}>Intervention Log</div>
      {entries.length === 0 && (
        <div style={emptyStyle}>
          <div style={emptyIconStyle}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              style={{ imageRendering: 'pixelated' }}
            >
              <rect
                x="4"
                y="6"
                width="24"
                height="16"
                fill="#16213e"
                stroke="#2a3a5e"
                strokeWidth="1"
              />
              <rect x="8" y="10" width="4" height="2" fill="#00897B" />
              <rect x="8" y="14" width="8" height="2" fill="#00897B" />
              <rect x="8" y="18" width="6" height="2" fill="#00897B" />
              <rect x="10" y="22" width="12" height="2" fill="#2a3a5e" />
              <rect x="8" y="24" width="16" height="2" fill="#2a3a5e" />
            </svg>
          </div>
          <span>No interventions deployed</span>
        </div>
      )}
      {entries.map((entry, i) => {
        const intervention = getIntervention(entry.interventionId);
        const name = intervention?.name ?? entry.interventionId;
        const cost = intervention?.cost;
        const effect = intervention?.effect;

        const typeColor = INTERVENTION_COLORS[entry.interventionId] ?? '#555';
        const borderColor = typeColor;

        const effectParts: string[] = [];
        if (effect) {
          if (effect.r0Delta < 0) effectParts.push(`R₀${effect.r0Delta}`);
          if (effect.sigmaDelta > 0) effectParts.push(`Σ+${effect.sigmaDelta}`);
        }
        const effectText = effectParts.length > 0 ? effectParts.join(' ') : '';

        return (
          <div
            key={`${entry.interventionId}-${entry.tick}-${i}`}
            data-testid="timeline-entry"
            style={{
              display: 'flex',
              gap: '10px',
              padding: '8px 12px',
              borderLeft: `3px solid ${borderColor}`,
              margin: '4px 8px',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '32px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: borderColor,
                  marginTop: '4px',
                }}
              />
              {i < entries.length - 1 && (
                <div
                  style={{
                    width: '1px',
                    flex: 1,
                    background: '#333',
                    marginTop: '4px',
                  }}
                />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#ccd6f6', fontWeight: 600, fontSize: '14px' }}>{name}</span>
                <span
                  style={{
                    color: borderColor,
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  {entry.r0AtDeploy >= 1.0 ? 'Urgent' : 'Preventive'}
                </span>
              </div>
              <div
                style={{
                  color: '#8892b0',
                  fontSize: '13px',
                  marginTop: '3px',
                }}
              >
                T{entry.tick}
                {cost !== undefined && ` · $${cost}`}
                {effectText && ` · ${effectText}`}
                {entry.sigmaAtDeploy !== undefined && ` · Σ=${Math.round(entry.sigmaAtDeploy)}`}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
