import { useGameStore } from '@shared/stores/gameStore';
import { useSimulationStore } from '@shared/stores/useSimulationStore';
import { usePlaytestStore } from '@shared/stores/usePlaytestStore';

declare global {
  interface Window {
    __GIHA_DEV__?: DevAPI;
  }
}

interface DevAPI {
  setSigma(n: number): void;
  setR0(n: number): void;
  setBudget(n: number): void;
  setTick(n: number): void;
  setGameState(patch: { sigma?: number; r0?: number; budget?: number }): void;
  unlockAll(): void;
  skipCooldowns(): void;
  state(): Record<string, unknown>;
  addIncome(n: number): void;
  forceWin(): void;
  forceLoss(): void;
  toggleSpeed(): void;
  completeCase(caseId: string, grade: string): void;
  exportLog(): void;
  toggleDevMode(): void;
}

function getGame(): ReturnType<typeof useGameStore.getState> {
  return useGameStore.getState();
}

function getSim(): ReturnType<typeof useSimulationStore.getState> {
  return useSimulationStore.getState();
}

export function initDevTools(): void {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('dev')) return;

  const api: DevAPI = {
    setSigma(n: number) {
      useSimulationStore.setState({ sigma: Math.max(0, Math.min(100, n)) });
    },
    setR0(n: number) {
      useSimulationStore.setState({ r0: Math.max(0, Math.min(5, n)) });
    },
    setBudget(n: number) {
      useGameStore.setState({ budget: Math.max(0, n) });
    },
    setTick(n: number) {
      useSimulationStore.setState({ tick: Math.max(0, n) });
    },
    setGameState(patch: { sigma?: number; r0?: number; budget?: number }) {
      if (patch.sigma !== undefined) {
        useGameStore.setState({ sigma: Math.max(0, Math.min(100, patch.sigma)) });
      }
      if (patch.r0 !== undefined) {
        useGameStore.setState({ r0: Math.max(0, Math.min(5, patch.r0)) });
      }
      if (patch.budget !== undefined) {
        useGameStore.setState({ budget: Math.max(0, patch.budget) });
      }
    },
    unlockAll() {
      getGame().unlockCase2();
      getGame().unlockCase3();
    },
    skipCooldowns() {
      useGameStore.setState({ cooldowns: {} });
    },
    state() {
      return {
        game: getGame(),
        sim: getSim(),
      };
    },
    addIncome(n: number) {
      getGame().addIncome(n);
    },
    forceWin() {
      getGame().setGameStatus('won');
      getSim().pauseSimulation();
    },
    forceLoss() {
      getGame().setGameStatus('lost');
      getSim().pauseSimulation();
    },
    toggleSpeed() {
      const current = getSim().speed;
      const next = current >= 10 ? 1 : current * 2;
      getSim().setSpeed(next);
    },
    completeCase(caseId: string, grade: string) {
      const grades = ['S', 'A', 'B', 'C', 'F'];
      if (!grades.includes(grade)) {
        console.warn(`[GIHA Dev] Invalid grade "${grade}". Must be one of ${grades.join(', ')}`);
        return;
      }
      getGame().startCase(caseId);
      getGame().recordCaseGrade(caseId, grade);
      getGame().finishCase(0, 0, 0);
      console.log(`[GIHA Dev] Case "${caseId}" completed with grade "${grade}"`);
    },
    exportLog() {
      usePlaytestStore.getState().exportLog();
    },
    toggleDevMode() {
      usePlaytestStore.getState().toggleDevMode();
      console.log(
        `[GIHA Dev] Dev overlay: ${usePlaytestStore.getState().isDevMode ? 'ON' : 'OFF'}`,
      );
    },
  };

  window.__GIHA_DEV__ = api;
  console.log('[GIHA Dev] Dev mode active. Use window.__GIHA_DEV__ API');
  console.log(
    '[GIHA Dev] Commands: setSigma(), setR0(), setBudget(), setTick(), setGameState(), unlockAll(), skipCooldowns(), state(), addIncome(), forceWin(), forceLoss(), toggleSpeed(), completeCase(), exportLog(), toggleDevMode()',
  );
}
