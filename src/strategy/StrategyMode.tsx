import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { CityCanvas } from './CityCanvas';
import { TimeControls } from './TimeControls';
import { InterventionPalette } from './InterventionPalette';
import { InterventionTimeline } from './InterventionTimeline';
import type { CityState } from './useCityLoop';
import { buildDistrictState } from './useCityLoop';
import { buildDefaultConfig } from '@engine/simulate';
import { HUD } from '@shared/HUD';
import { WarningToastContainer } from '@shared/WarningToast';
import { HintToastContainer } from '@shared/HintToast';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from './useSimulation';
import {
  useSimulationStore,
  useGameStore,
  useWarningStore,
  useInterventionLogStore,
} from '@shared/stores';
import { INCOME, WIN_CONDITIONS, LOSS_CONDITIONS } from '@engine/tuning';
import { setHotspotCenter } from './renderers';
import { useAudioManager } from '@shared/useAudioManager';
import { useWarningDetection } from './useWarningDetection';
import { useHintDetection } from './useHintDetection';
import { usePlaytestLogger } from '@shared/usePlaytestLogger';
import { usePlaytestStore } from '@shared/stores/usePlaytestStore';
import { useActiveEffects } from './useActiveEffects';
import { CaseSelector } from './CaseSelector';
import { getCaseUnlocks, checkUnlocks } from './useCaseUnlocks';
import { resolveBuffs, getEffectiveInterventions } from './buffs';
import { StrategyTutorial } from './StrategyTutorial';
import { saveGame } from '@shared/saveManager';
import { Modal } from '@shared/Modal';
import type { Phase } from '@engine/types';
import styles from './StrategyMode.module.css';

export function StrategyMode() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('calm');
  const { sigma, r0, tick, isRunning, speed, simulationTick, stepTick, activeEffects } =
    useSimulation();
  const budget = useGameStore((s) => s.budget);
  const cityPaused = useGameStore((s) => s.cityPaused);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const caseResults = useGameStore((s) => s.caseResults);
  const logEntries = useInterventionLogStore((s) => s.entries);
  const interventions = useMemo(() => getEffectiveInterventions(caseResults), [caseResults]);
  const buffs = resolveBuffs(caseResults);
  const MIN_COST = Math.min(...interventions.map((i) => i.cost));
  const isBudgetLow = budget < MIN_COST;
  const { deploy } = useActiveEffects();
  const wasPausedRef = useRef(cityPaused);
  const r0DangerRef = useRef(0);
  const [r0DangerCount, setR0DangerCount] = useState(0);
  const stableTicksRef = useRef(0);
  const districtR0DangerRef = useRef<Record<string, number>>({});
  const gameStatusRef = useRef(gameStatus);
  useAudioManager();
  useWarningDetection();
  useHintDetection();
  usePlaytestLogger();

  const strategyTutorialShown = useGameStore((s) => s.strategyTutorialShown);
  const dismissTutorial = useGameStore((s) => s.dismissStrategyTutorial);
  const [showSaved, setShowSaved] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [phaseTransition, setPhaseTransition] = useState<Phase | null>(null);

  const caseUnlocks = getCaseUnlocks();
  const simConfig = buildDefaultConfig();
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  function getIncome(currentSigma: number): number {
    return INCOME.BASE + (currentSigma / 100) * INCOME.SCALE;
  }

  const phaseRef = useRef<Phase>('calm');
  useEffect(() => {
    if (phaseRef.current !== phase) {
      phaseRef.current = phase;
      if (phase === 'outbreak' || phase === 'crisis') {
        setHotspotCenter({
          x: Math.random() * 800 + 100,
          y: Math.random() * 800 + 100,
        });
      } else {
        setHotspotCenter(null);
      }
      if (phase !== 'calm') {
        const timer = window.setTimeout(() => {
          setPhaseTransition(phase);
          window.setTimeout(() => setPhaseTransition(null), 2000);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [phase]);

  useEffect(() => {
    if (wasPausedRef.current && !cityPaused) {
      useWarningStore.getState().addWarning('City Resumed');
    }
    wasPausedRef.current = cityPaused;
  }, [cityPaused]);

  useEffect(() => {
    if (tick > 0 && tick % 5 === 0) saveGame();
  }, [tick]);

  useEffect(() => {
    const unsub = useGameStore.subscribe((state, prev) => {
      if (state.lastDeployId !== prev.lastDeployId) saveGame();
      if (state.completedCases !== prev.completedCases) {
        saveGame();
        if (state.completedCases === 1) {
          usePlaytestStore
            .getState()
            .showMonologue('One down. Two to go. They\u2019re getting smarter.');
        }
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (tick === 0) return;
    const show = window.setTimeout(() => setShowSaved(true), 0);
    const hide = window.setTimeout(() => setShowSaved(false), 1200);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [tick]);

  useEffect(() => {
    if (gameStatus === 'won' && gameStatusRef.current !== 'won') {
      navigate('/transition', { state: { direction: 'to-victory' }, replace: true });
    }
    if (gameStatus === 'lost' && gameStatusRef.current !== 'lost') {
      navigate('/transition', { state: { direction: 'to-gameover' }, replace: true });
    }
    gameStatusRef.current = gameStatus;
  }, [gameStatus, navigate]);

  const districtNames = ['Foundry', 'Harborview', 'Uptown', 'Campus'];

  const handleDistrictClick = (districtId: number) => {
    const newSelection = selectedDistrict === districtId ? null : districtId;
    setSelectedDistrict(newSelection);
    const name =
      newSelection !== null
        ? (districtNames[newSelection] ?? `District ${newSelection}`)
        : 'all districts';
    useWarningStore.getState().addWarning(` Targeting: ${name}`);
  };

  const handleTick = useCallback(
    (state: CityState): CityState => {
      simulationTick();
      checkUnlocks();

      const sim = useSimulationStore.getState();
      const game = useGameStore.getState();
      const income = getIncome(sim.sigma);
      game.addIncome(income);
      game.tickCooldowns();
      const completed = game.completedCases;
      const effectiveR0 = Math.max(0, sim.r0 + game.permanentR0Modifier);

      if (effectiveR0 > LOSS_CONDITIONS.CITY_R0_THRESHOLD) {
        r0DangerRef.current++;
        setR0DangerCount(r0DangerRef.current);
        if (r0DangerRef.current >= LOSS_CONDITIONS.CITY_R0_TICKS) {
          useGameStore.getState().setGameStatus('lost');
          useSimulationStore.getState().pauseSimulation();
          return state;
        }
      } else {
        r0DangerRef.current = 0;
        setR0DangerCount(0);
      }

      if (
        completed >= WIN_CONDITIONS.REQUIRED_CASES &&
        sim.sigma >= WIN_CONDITIONS.SIGMA_THRESHOLD &&
        effectiveR0 < WIN_CONDITIONS.R0_THRESHOLD
      ) {
        stableTicksRef.current++;
        if (stableTicksRef.current >= WIN_CONDITIONS.STABLE_TICKS) {
          useGameStore.getState().setGameStatus('won');
          useSimulationStore.getState().pauseSimulation();
          return state;
        }
      } else {
        stableTicksRef.current = 0;
      }

      const districtState = buildDistrictState(sim.sigma, sim.r0, simConfig);
      for (const [id, ds] of Object.entries(districtState)) {
        if (ds.r0 > LOSS_CONDITIONS.DISTRICT_R0_THRESHOLD) {
          districtR0DangerRef.current[id] = (districtR0DangerRef.current[id] ?? 0) + 1;
          if (districtR0DangerRef.current[id] >= LOSS_CONDITIONS.DISTRICT_R0_TICKS) {
            useGameStore.getState().setGameStatus('lost');
            useSimulationStore.getState().pauseSimulation();
            return state;
          }
        } else {
          districtR0DangerRef.current[id] = 0;
        }
      }

      const failedCases = useGameStore.getState().failedCaseCount;
      if (failedCases >= LOSS_CONDITIONS.MAX_FAILED_CASES) {
        useGameStore.getState().setGameStatus('lost');
        useSimulationStore.getState().pauseSimulation();
        return state;
      }

      return {
        tiles: state.tiles,
        agents: state.agents,
        particles: state.particles,
        smoothSigma: state.smoothSigma,
        smoothR0: state.smoothR0,
        sigma: sim.sigma,
        r0: sim.r0,
        phase: sim.phase,
        tick: sim.tick,
        districtState,
        activeEffects: sim.activeEffects,
      };
    },
    [simulationTick, simConfig],
  );

  const handleTogglePlay = () => {
    const { isRunning: running, startSimulation, pauseSimulation } = useSimulationStore.getState();
    if (running) {
      pauseSimulation();
    } else {
      startSimulation();
    }
  };

  const handleStep = () => {
    stepTick();
  };

  const handleSpeedChange = (newSpeed: number) => {
    useSimulationStore.getState().setSpeed(newSpeed);
  };

  const handleHome = () => {
    setShowExitConfirm(true);
  };

  const handlersRef = useRef({ handleTogglePlay, handleStep, handleSpeedChange, handleHome });
  useEffect(() => {
    handlersRef.current = { handleTogglePlay, handleStep, handleSpeedChange, handleHome };
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const h = handlersRef.current;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          h.handleTogglePlay();
          break;
        case 's':
          h.handleStep();
          break;
        case '1':
          h.handleSpeedChange(1);
          break;
        case '2':
          h.handleSpeedChange(2);
          break;
        case '3':
          h.handleSpeedChange(5);
          break;
        case '4':
          h.handleSpeedChange(10);
          break;
        case 'h':
          h.handleHome();
          break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleStartCase = (caseId: string) => {
    const game = useGameStore.getState();
    game.startCase(caseId);
    const info = getCaseUnlocks().find((c) => c.id === caseId);
    navigate('/transition', {
      state: {
        direction: 'to-detective',
        caseId,
        caseTitle: info?.title ?? '',
        caseBrief: info?.brief ?? '',
      },
    });
  };

  return (
    <div
      className={styles.flashIn}
      style={{
        backgroundColor: '#1a1a2e',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className={styles.topBar}>
        <TimeControls
          isRunning={isRunning}
          speed={speed}
          onTogglePlay={handleTogglePlay}
          onStep={handleStep}
          onSpeedChange={handleSpeedChange}
        />
        <HUD
          sigma={sigma}
          r0={Math.max(0, r0 + useGameStore.getState().permanentR0Modifier)}
          budget={budget}
          phase={phase}
          lowBudget={isBudgetLow}
          cityPaused={cityPaused}
          buffs={buffs}
          activeEffects={activeEffects}
          completedCases={Object.keys(caseResults).length}
          r0DangerCount={r0DangerCount}
          r0DangerMax={30}
          budgetIncome={getIncome(sigma)}
          onRequestHome={handleHome}
        />
        <div className={styles.dayDivider} />
        <div className={styles.dayBox}>
          <span className={styles.dayNum}>{tick}</span>
          <span className={styles.dayLabel}>DAY</span>
        </div>
      </div>
      <CaseSelector cases={caseUnlocks} onStartCase={handleStartCase} />
      <div className={styles.mainRow}>
        <div className={styles.canvasCol}>
          <CityCanvas
            onDistrictClick={handleDistrictClick}
            onPhaseChange={setPhase}
            onTick={handleTick}
            cityPaused={cityPaused}
          />
        </div>
        <div className={styles.sidebarCol}>
          <InterventionPalette
            interventions={interventions}
            budget={budget}
            selectedDistrict={selectedDistrict}
            onDeploy={(id, districtId) => deploy(id, districtId)}
          />
          <div className={styles.sidebarFooter}>
            <InterventionTimeline entries={logEntries} />
          </div>
        </div>
      </div>
      {phaseTransition && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998,
            background: 'rgba(0,0,0,0.55)',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 42,
              fontWeight: 'bold',
              color:
                phaseTransition === 'trap'
                  ? '#E53935'
                  : phaseTransition === 'crisis'
                    ? '#FB8C00'
                    : '#FFB300',
              textTransform: 'uppercase',
              letterSpacing: 6,
              marginBottom: 8,
              textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            }}
          >
            {phaseTransition === 'trap' ? 'SIGMA TRAP' : phaseTransition.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 17,
              color: 'rgba(255,255,255,0.7)',
              fontStyle: 'italic',
            }}
          >
            {phaseTransition === 'outbreak'
              ? 'Misinformation is outpacing the truth'
              : phaseTransition === 'crisis'
                ? 'Panic fractures neighborhoods faster than facts can unite them'
                : 'Citizens have retreated into sealed echo chambers'}
          </div>
        </div>
      )}
      {showSaved && (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            color: 'var(--color-secondary)',
            fontFamily: 'monospace',
            fontSize: 14,
            background: 'rgba(0,0,0,0.6)',
            padding: '6px 14px',
            borderRadius: 4,
            zIndex: 9999,
          }}
        >
          Saved
        </div>
      )}
      <WarningToastContainer />
      <HintToastContainer />
      {showExitConfirm && (
        <Modal
          title="Leave Strategy Mode?"
          isOpen
          onClose={() => setShowExitConfirm(false)}
          variant="confirm"
          confirmLabel="Leave"
          cancelLabel="Stay"
          onConfirm={() => navigate('/', { replace: true })}
        >
          <p>Unsaved progress will be lost. Are you sure?</p>
        </Modal>
      )}
      {!strategyTutorialShown && <StrategyTutorial onDismiss={dismissTutorial} />}
    </div>
  );
}
