import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, useSimulationStore } from '@shared/stores';
import { INTERVENTIONS, getEscalatedCost } from '@engine/interventions';
import { playSfx, stopMusic, stopAllSfx } from '@shared/useAudioManager';
import styles from './GameOverScreen.module.css';

function generatePostMortem(): string[] {
  const sim = useSimulationStore.getState();
  const game = useGameStore.getState();
  const analysis: string[] = [];

  if (sim.r0 > 2.0) {
    analysis.push(
      `R₀ reached ${sim.r0.toFixed(1)} — spread rate grew beyond intervention capacity`,
    );
    const antiR0Interventions = INTERVENTIONS.filter((i) => i.effect.r0Delta < 0);
    for (const inv of antiR0Interventions) {
      const useCount = game.interventionUseCounts[inv.id] ?? 0;
      if (!game.appliedInterventions.includes(inv.id)) {
        const escCost = getEscalatedCost(inv.cost, useCount);
        analysis.push(
          `Deploying "${inv.name}" (cost: $${escCost}, base $${inv.cost}) would have reduced R₀ by ${Math.abs(inv.effect.r0Delta).toFixed(1)} for ${inv.effect.durationTicks} ticks`,
        );
      }
    }
  }

  if (sim.sigma < 30) {
    analysis.push(
      `σ-coherence critically low (${sim.sigma.toFixed(0)}) — population trust collapsed`,
    );
    const proSigmaInterventions = INTERVENTIONS.filter((i) => i.effect.sigmaDelta > 0);
    for (const inv of proSigmaInterventions) {
      const useCount = game.interventionUseCounts[inv.id] ?? 0;
      if (!game.appliedInterventions.includes(inv.id)) {
        const escCost = getEscalatedCost(inv.cost, useCount);
        analysis.push(
          `"${inv.name}" (cost: $${escCost}, base $${inv.cost}) would have boosted σ by +${inv.effect.sigmaDelta} per tick for ${inv.effect.durationTicks} ticks`,
        );
      }
    }
  }

  if (sim.sigma < 20) {
    analysis.push(
      `σ-coherence entered the trap zone (below 20). Recovery requires sustained σ-boosting interventions deployed at least 15 ticks before the trap threshold.`,
    );
  }

  const caseResults = game.caseResults;
  const completedCaseIds = Object.keys(caseResults);
  if (completedCaseIds.length === 0 || completedCaseIds.every((id) => id.startsWith('__'))) {
    analysis.push(
      'No cases were solved — disinformation spread through the city unchecked. Each solved case provides critical intelligence that strengthens the city\u2019s defenses.',
    );
  } else {
    analysis.push(`Cases completed: ${completedCaseIds.length} of 3`);
    for (const [id, grade] of Object.entries(caseResults)) {
      if (id.startsWith('__')) continue;
      const info: Record<string, string> = {
        'case-01': 'The Viral Mayor',
        'case-02': "Grandma's Distress Call",
        'case-03': 'The Front Page',
      };
      analysis.push(`  ${info[id] ?? id}: Grade ${grade}`);
    }
  }

  if (analysis.length === 0) {
    analysis.push(
      'The collapse was sudden — no single intervention could have prevented this outcome',
    );
  }

  return analysis;
}

export function GameOverScreen() {
  const navigate = useNavigate();
  const resetStrategy = useGameStore((s) => s.resetStrategyOnly);
  const resetSim = useSimulationStore((s) => s.resetSimulation);
  const postMortem = generatePostMortem();

  useEffect(() => {
    stopMusic();
    playSfx('game-over');
  }, []);

  const handleTryAgain = () => {
    stopAllSfx();
    stopMusic();
    resetStrategy();
    resetSim();
    navigate('/strategy', { replace: true });
  };

  return (
    <div className={styles.screen} data-testid="gameover-screen">
      <div className={styles.header}>
        <div className={styles.skull}>&#x2620;</div>
        <div className={styles.title}>GAME OVER</div>
        <div className={styles.subtitle}>CIVILIZATION COLLAPSE</div>
      </div>

      <p className={styles.message}>
        Veritas has fallen to disinformation. The Shadow Collective's network exploited every
        vulnerability — and without a population capable of identifying and resisting manipulated
        content, the city's social fabric has unraveled. VeraTech Solutions was only one of their
        shell companies.
      </p>

      <div className={styles.postmortem} data-testid="postmortem">
        <div className={styles.postmortemHeader}>POST-MORTEM ANALYSIS</div>
        <div className={styles.postmortemBody}>
          {postMortem.map((line, i) => (
            <p key={i} className={styles.postmortemLine} data-testid={`postmortem-line-${i}`}>
              {line}
            </p>
          ))}
        </div>
      </div>

      <button
        className={styles.tryAgainBtn}
        onClick={handleTryAgain}
        type="button"
        data-testid="try-again-btn"
      >
        Try Again
      </button>

      <p className={styles.progressNote}>
        Detective progress is preserved. You may replay previously solved cases.
      </p>
    </div>
  );
}
