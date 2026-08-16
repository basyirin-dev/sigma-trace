import type { Intervention } from '@engine/interventions';
import { INTERVENTION_COLORS } from '@engine/interventions';
import { Tooltip } from '@shared/Tooltip';

export interface InterventionCardProps {
  intervention: Intervention;
  affordable: boolean;
  cooldownRemaining: number;
  selected: boolean;
  onDeploy: () => void;
  baseCost?: number;
  useCount?: number;
}

function effectSummary(intervention: Intervention): string {
  const parts: string[] = [];
  const { effect } = intervention;
  if (effect.r0Delta < 0) parts.push(`R₀${effect.r0Delta}`);
  if (effect.sigmaDelta > 0) parts.push(`Σ+${effect.sigmaDelta}`);
  return parts.join('  ') || '';
}

function tooltipText(intervention: Intervention, baseCost?: number, useCount?: number): string {
  const { effect } = intervention;
  const lines: string[] = [intervention.description];
  if (baseCost !== undefined && useCount !== undefined && useCount > 0) {
    lines.push(`Cost: $${intervention.cost} (base $${baseCost}, ×${useCount + 1})`);
  } else {
    lines.push(`Cost: $${intervention.cost}`);
  }
  if (effect.r0Delta < 0)
    lines.push(`R₀ reduction: ${effect.r0Delta} for ${effect.durationTicks}s`);
  if (effect.sigmaDelta > 0)
    lines.push(`Σ boost: +${effect.sigmaDelta} for ${effect.durationTicks}s`);
  lines.push(`Cooldown: ${intervention.cooldown}s`);
  return lines.join('\n');
}

export function InterventionCard({
  intervention,
  affordable,
  cooldownRemaining,
  selected,
  onDeploy,
  baseCost,
  useCount = 0,
}: InterventionCardProps) {
  const isCooldown = cooldownRemaining > 0;
  const isLocked = !affordable && !isCooldown;
  const accentColor = INTERVENTION_COLORS[intervention.id] ?? '#555';

  const cardStyle: Record<string, React.CSSProperties> = {
    wrapper: {
      borderLeft: `4px solid ${accentColor}`,
      background: selected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
      padding: '14px 16px',
      cursor: isCooldown || isLocked ? 'not-allowed' : 'pointer',
      opacity: isCooldown ? 0.45 : isLocked ? 0.5 : 1,
      fontFamily: 'monospace',
      fontSize: '13px',
      marginBottom: '8px',
      border: selected ? '1px solid ' + accentColor : '1px solid transparent',
    },
    nameRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '6px',
    },
    name: {
      color: '#ccd6f6',
      fontWeight: 600,
      fontSize: '15px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    cost: {
      color: isLocked ? '#e74c3c' : '#8892b0',
      fontSize: '14px',
      flexShrink: 0,
      marginLeft: '8px',
    },
    effect: {
      color: '#B2DFDB',
      fontSize: '13px',
      marginTop: '4px',
    },
    desc: {
      color: '#80CBC4',
      fontSize: '12px',
      marginTop: '4px',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      whiteSpace: 'normal',
      lineHeight: '1.4',
      maxWidth: '100%',
    },
    status: {
      color: isCooldown ? '#f1c40f' : '#e74c3c',
      fontSize: '12px',
      marginTop: '6px',
      fontWeight: 600,
    },
  };

  const summary = effectSummary(intervention);
  const statusText: string | null = isCooldown
    ? `⏳ ${cooldownRemaining}s`
    : isLocked
      ? 'Insufficient budget'
      : null;

  const content = (
    <div
      data-testid="intervention-card"
      style={cardStyle.wrapper}
      onClick={isCooldown || isLocked ? undefined : onDeploy}
      role="button"
      tabIndex={isCooldown || isLocked ? -1 : 0}
      aria-disabled={isCooldown || isLocked}
      onKeyDown={(e) => {
        if (!isCooldown && !isLocked && (e.key === 'Enter' || e.key === ' ')) {
          onDeploy();
        }
      }}
    >
      <div style={cardStyle.nameRow}>
        <span style={cardStyle.name}>{intervention.name}</span>
        <span style={cardStyle.cost}>
          ${intervention.cost}
          {useCount > 0 && ` (×${useCount + 1})`}
        </span>
      </div>
      {summary && <div style={cardStyle.effect}>{summary}</div>}
      <div style={cardStyle.desc}>{intervention.description}</div>
      {statusText && <div style={cardStyle.status}>{statusText}</div>}
    </div>
  );

  return (
    <Tooltip content={tooltipText(intervention, baseCost, useCount)} position="left">
      {content}
    </Tooltip>
  );
}
