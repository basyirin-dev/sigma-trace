import { useState, useEffect, useRef } from 'react';
import type { Phase, ActiveEffect } from '@engine/types';
import type { ActiveBuff } from '@strategy/buffs';
import { INTERVENTION_COLORS } from '@engine/interventions';
import { SettingsPanel } from './SettingsPanel';
import { Tooltip } from './Tooltip';
import { Modal } from './Modal';
import styles from './HUD.module.css';

interface HUDProps {
  sigma: number;
  r0: number;
  budget: number;
  phase: Phase;
  className?: string;
  lowBudget?: boolean;
  cityPaused?: boolean;
  buffs?: ActiveBuff[];
  activeEffects?: ActiveEffect[];
  completedCases?: number;
  totalCases?: number;
  r0DangerCount?: number;
  r0DangerMax?: number;
  budgetIncome?: number;
  onRequestHome?: () => void;
}

const PHASE_LABELS: Record<Phase, string> = {
  calm: 'Calm',
  outbreak: 'Outbreak',
  crisis: 'Crisis',
  trap: 'SIGMA TRAP',
};

const PHASE_CLASSES: Record<Phase, string> = {
  calm: styles.phaseCalm ?? '',
  outbreak: styles.phaseOutbreak ?? '',
  crisis: styles.phaseCrisis ?? '',
  trap: styles.phaseTrap ?? '',
};

const PHASE_DESCRIPTORS: Record<Phase, string> = {
  calm: 'skeptical',
  outbreak: 'fast spread',
  crisis: 'communities fracturing',
  trap: 'echo chambers',
};

export function HUD({
  sigma,
  r0,
  budget,
  phase,
  className,
  lowBudget,
  cityPaused,
  buffs,
  activeEffects,
  completedCases = 0,
  totalCases = 3,
  r0DangerCount = 0,
  r0DangerMax = 5,
  budgetIncome = 0,
  onRequestHome,
}: HUDProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [budgetFlash, setBudgetFlash] = useState<'gain' | 'loss' | null>(null);
  const prevBudgetRef = useRef(budget);
  const casesRemaining = Math.max(0, totalCases - completedCases);

  useEffect(() => {
    const diff = budget - prevBudgetRef.current;
    if (diff !== 0) {
      setBudgetFlash(diff > 0 ? 'gain' : 'loss');
      prevBudgetRef.current = budget;
      const timer = setTimeout(() => setBudgetFlash(null), 300);
      return () => clearTimeout(timer);
    }
  }, [budget]);

  return (
    <div className={`${styles.hud} ${className ?? ''}`}>
      <div className={styles.statGroup}>
        <div className={`${styles.stat} ${styles.litStat}`}>
          <Tooltip content="Media Literacy (Σ): how well citizens resist disinformation. If Σ drops below 20, the city enters a sigma trap.">
            <span className={styles.value}>{sigma.toFixed(1)}</span>
          </Tooltip>
          <span className={styles.label}>LIT</span>
        </div>
        <div className={styles.stat}>
          <Tooltip content="Spread Rate (R&#x2080;): how fast disinformation spreads. Keep below 1.5 to prevent crisis. Interventions reduce R&#x2080;.">
            <span className={`${styles.value} ${r0 > 1.5 ? (styles.r0High ?? '') : ''}`}>
              {r0.toFixed(2)}
            </span>
          </Tooltip>
          <span className={styles.label}>SPD</span>
        </div>
        <div className={`${styles.stat} ${styles.budgetStat}`}>
          <Tooltip content="Budget: spend on interventions to reduce R&#x2080; or boost &#x3A3;. Earn more by solving cases. Passive income scales with &#x3A3;.">
            <span
              className={`${styles.budgetValue} ${lowBudget ? (styles.budgetLow ?? '') : ''} ${budgetFlash === 'gain' ? (styles.budgetGain ?? '') : ''} ${budgetFlash === 'loss' ? (styles.budgetLoss ?? '') : ''}`}
            >
              ${budget.toFixed(0)}
            </span>
          </Tooltip>
          <span className={styles.label}>
            BUDGET{' '}
            {budgetIncome > 0 && (
              <span className={styles.incomeLabel}>+{budgetIncome.toFixed(1)}</span>
            )}
          </span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.statusGroup}>
        {cityPaused ? (
          <div className={`${styles.phase} ${styles.phasePaused}`} data-testid="city-paused">
            CITY PAUSED
          </div>
        ) : (
          <div className={`${styles.phase} ${PHASE_CLASSES[phase]}`}>
            <span>
              {PHASE_LABELS[phase]}
              <span className={styles.phaseDescriptor}> | {PHASE_DESCRIPTORS[phase]}</span>
            </span>
            {r0DangerCount > 0 && phase !== 'trap' && (
              <span className={styles.dangerCountdown} data-testid="danger-countdown">
                {' '}
                Collapse in {r0DangerMax - r0DangerCount}
              </span>
            )}
          </div>
        )}
        {casesRemaining > 0 && (
          <div className={`${styles.stat} ${styles.casesStat}`}>
            <span className={styles.value}>
              {completedCases}/{totalCases}
            </span>
            <span className={styles.label}>Cases</span>
          </div>
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.utilityCluster}>
        {buffs && buffs.length > 0 && (
          <div className={styles.buffs} data-testid="hud-buffs">
            <span className={styles.buffsLabel}>INTEL</span>
            {buffs.map((buff) => (
              <span
                key={buff.id}
                className={styles.buffTag}
                data-testid={`buff-${buff.id}`}
                title={buff.description}
              >
                {buff.name}
              </span>
            ))}
          </div>
        )}
        {activeEffects && activeEffects.length > 0 && (
          <div className={styles.activeEffects} data-testid="hud-active-effects">
            <span className={styles.activeEffectsLabel}>ACTIVE</span>
            {activeEffects.slice(0, 3).map((e) => (
              <span
                key={e.interventionId}
                className={styles.activeEffectTag}
                style={{ borderColor: INTERVENTION_COLORS[e.interventionId] ?? '#555' }}
                title={`${e.remainingTicks} ticks remaining`}
              >
                {e.interventionId === 'fact-check'
                  ? 'FC'
                  : e.interventionId === 'mil-school'
                    ? 'MIL'
                    : e.interventionId === 'algorithm-audit'
                      ? 'AA'
                      : e.interventionId === 'community-dialog'
                        ? 'CD'
                        : e.interventionId === 'source-verify'
                          ? 'SV'
                          : e.interventionId === 'emergency-broadcast'
                            ? 'EM'
                            : e.interventionId.slice(0, 2).toUpperCase()}
                {e.districtId !== undefined
                  ? ` [${['FD', 'HV', 'UP', 'CA'][e.districtId] ?? e.districtId}]`
                  : ''}
              </span>
            ))}
            {activeEffects.length > 3 && (
              <span className={styles.activeEffectMore}>+{activeEffects.length - 3}</span>
            )}
          </div>
        )}
        <button
          className={styles.utilityBtn}
          onClick={() => setHelpOpen(true)}
          data-testid="help-btn"
          aria-label="Help"
          title="Help"
        >
          ?
        </button>
        <button
          className={styles.utilityBtn}
          onClick={() => onRequestHome?.()}
          data-testid="home-btn"
          aria-label="Main Menu"
          title="Main Menu"
        >
          &#x21A9;
        </button>
        <button
          className={styles.utilityBtn}
          onClick={() => setSettingsOpen(true)}
          data-testid="settings-btn"
          aria-label="Settings"
          title="Settings"
        >
          {'\u2699'}
        </button>
      </div>
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Modal title="GIHA Field Manual" isOpen={helpOpen} onClose={() => setHelpOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 420 }}>
          <div>
            <p style={{ fontWeight: 700, color: '#4ecdc4', marginBottom: 6, fontSize: 18 }}>
              Media Literacy (Σ)
            </p>
            <p style={{ color: '#aaa', lineHeight: 1.8, fontSize: 16 }}>
              Measures the population's ability to distinguish real from manipulated content. High Σ
              means citizens think critically. If Σ drops below 20, the city enters a sigma-trap —
              irreversible collapse.
            </p>
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#f39c12', marginBottom: 6, fontSize: 18 }}>
              Spread Rate (R₀)
            </p>
            <p style={{ color: '#aaa', lineHeight: 1.8, fontSize: 16 }}>
              How fast disinformation spreads through the population. R₀ &gt; 1 means disinformation
              is growing. Keep R₀ below 1.5 to avoid crisis.
            </p>
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#2ecc71', marginBottom: 6, fontSize: 18 }}>
              Budget
            </p>
            <p style={{ color: '#aaa', lineHeight: 1.8, fontSize: 16 }}>
              Spend on interventions to boost Σ or reduce R₀. Earn more by solving detective cases.
              Passive income scales with Σ.
            </p>
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#e74c3c', marginBottom: 6, fontSize: 18 }}>
              Phase System
            </p>
            <p style={{ color: '#aaa', lineHeight: 1.8, fontSize: 16 }}>
              The city progresses through phases (Calm → Outbreak → Crisis → Sigma Trap) based on
              your Σ and R₀. Each phase escalates the challenge.
            </p>
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#888', marginBottom: 6, fontSize: 18 }}>
              GIHA Personnel
            </p>
            <p style={{ color: '#aaa', lineHeight: 1.8, fontSize: 16 }}>
              Dr. Elena Voss — Director. Former UN diplomat.
              <br />
              Marcus Chen — Chief Analyst. Ex-NSA, disillusioned.
              <br />
              Yara Abadi — Field Operations. Logistics specialist.
              <br />
              Dr. Amara Okafor — Intelligence. Media studies, deepfake expert.
              <br />
              <span style={{ color: '#e74c3c' }}>Mira Petrova</span> — City Hall data entry clerk.
              Flagged for suspicious access patterns under active GIHA monitoring.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
