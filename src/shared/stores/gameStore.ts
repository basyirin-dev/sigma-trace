import { create } from 'zustand'
import type { Verdict } from '@engine/types'
import { useSimulationStore } from './useSimulationStore'
import { useInterventionLogStore } from './useInterventionLogStore'
import { STARTING_STATE, CASE_BUDGET_BONUSES } from '@engine/tuning'

export type GameMode = 'strategy' | 'detective' | 'transition'

export interface GameState {
  mode: GameMode
  sigma: number
  r0: number
  budget: number
  activeCase: string | null
  verdict: Verdict | null
  usedTools: string[]
  appliedInterventions: string[]
  cooldowns: Record<string, number>
  interventionUseCounts: Record<string, number>
  lastDeployId: string | null
  lastDeployTick: number
  completedCases: number
  gameStatus: 'playing' | 'won' | 'lost'
  cityPaused: boolean
  case2Unlocked: boolean
  case3Unlocked: boolean
  caseResults: Record<string, string>
  startingBudgetBonus: number
  case1BonusClaimed: boolean
  case2BonusClaimed: boolean
  failedCaseCount: number
  permanentR0Modifier: number
  strategyTutorialShown: boolean
  earnedBadges: string[]
  bestCaseResults: Record<string, string>
}

export interface GameActions {
  switchMode: (mode: GameMode) => void
  deployIntervention: (id: string, cost: number) => void
  addIncome: (amount: number) => void
  setCooldown: (id: string, ticks: number) => void
  recordDeploy: (id: string, tick: number) => void
  tickCooldowns: () => void
  startCase: (caseId: string) => void
  useTool: (toolId: string) => void
  submitVerdict: (verdict: Verdict) => void
  finishCase: (r0Delta: number, sigmaDelta: number, budgetBonus: number) => void
  recordCaseGrade: (caseId: string, grade: string) => void
  setEarnedBadges: (badges: string[]) => void
  dismissStrategyTutorial: () => void
  resetStrategyTutorial: () => void
  unlockCase2: () => void
  unlockCase3: () => void
  setGameStatus: (status: 'playing' | 'won' | 'lost') => void
  resetStrategyOnly: () => void
  reset: () => void
}

export type GameStore = GameState & GameActions

const DEFAULTS: GameState = {
  mode: 'strategy',
  sigma: STARTING_STATE.sigma,
  r0: STARTING_STATE.r0,
  budget: STARTING_STATE.budget,
  activeCase: null,
  verdict: null,
  usedTools: [],
  appliedInterventions: [],
  cooldowns: {},
  interventionUseCounts: {},
  lastDeployId: null,
  lastDeployTick: -10,
  completedCases: 0,
  gameStatus: 'playing',
  cityPaused: false,
  case2Unlocked: false,
  case3Unlocked: false,
  caseResults: {},
  startingBudgetBonus: 0,
  case1BonusClaimed: false,
  case2BonusClaimed: false,
  failedCaseCount: 0,
  permanentR0Modifier: 0,
  strategyTutorialShown: false,
  earnedBadges: [],
  bestCaseResults: {},
}

export const useGameStore = create<GameStore>((set) => ({
  ...DEFAULTS,
  switchMode: (mode) => set({ mode }),
  deployIntervention: (id, cost) =>
    set((s) => ({
      appliedInterventions: [...s.appliedInterventions, id],
      budget: Math.round(Math.max(0, s.budget - cost)),
      interventionUseCounts: {
        ...s.interventionUseCounts,
        [id]: (s.interventionUseCounts[id] ?? 0) + 1,
      },
    })),
  addIncome: (amount) => set((s) => ({ budget: Math.round(s.budget + amount) })),
  setCooldown: (id, ticks) =>
    set((s) => ({ cooldowns: { ...s.cooldowns, [id]: ticks } })),
  recordDeploy: (id, tick) =>
    set({ lastDeployId: id, lastDeployTick: tick }),
  tickCooldowns: () =>
    set((s) => {
      const next: Record<string, number> = {}
      for (const [id, ticks] of Object.entries(s.cooldowns)) {
        if (ticks > 1) next[id] = ticks - 1
      }
      return { cooldowns: next }
    }),
  startCase: (caseId) => {
    useSimulationStore.getState().pauseSimulation()
    set({
      activeCase: caseId,
      verdict: null,
      usedTools: [],
      mode: 'detective',
      cityPaused: true,
    })
  },
  useTool: (toolId) =>
    set((s) => ({ usedTools: [...s.usedTools, toolId] })),
  submitVerdict: (verdict) =>
    set({ verdict, mode: 'strategy' }),
  finishCase: (r0Delta, sigmaDelta, budgetBonus) => {
    useSimulationStore.getState().startSimulation()
    set((s) => {
      const nextCompleted = s.completedCases + 1
      const caseId = s.activeCase ?? ''
      const grade = s.caseResults[caseId] ?? ''

      let extraBonus = 0
      if (caseId === 'case-01' && (grade === 'S' || grade === 'A') && !s.case1BonusClaimed) {
        extraBonus = CASE_BUDGET_BONUSES.CASE1_BONUS
      }
      if (caseId === 'case-02' && (grade === 'S' || grade === 'A') && !s.case2BonusClaimed) {
        extraBonus = CASE_BUDGET_BONUSES.CASE2_BONUS
      }

      const isFail = grade === 'F'
      const newSigma = Math.max(0, Math.min(100, s.sigma + sigmaDelta))
      return {
        sigma: newSigma,
        budget: s.budget + budgetBonus + extraBonus,
        activeCase: null,
        verdict: null,
        mode: 'strategy',
        completedCases: nextCompleted,
        cityPaused: false,
        startingBudgetBonus: s.startingBudgetBonus + extraBonus,
        case1BonusClaimed: s.case1BonusClaimed || (caseId === 'case-01' && extraBonus > 0),
        case2BonusClaimed: s.case2BonusClaimed || (caseId === 'case-02' && extraBonus > 0),
        failedCaseCount: s.failedCaseCount + (isFail ? 1 : 0),
        permanentR0Modifier: s.permanentR0Modifier + r0Delta,
      }
    })
    const sim = useSimulationStore.getState()
    const game = useGameStore.getState()
    useSimulationStore.setState({ sigma: game.sigma, r0: Math.max(0, sim.r0 + game.permanentR0Modifier) })
  },
  setEarnedBadges: (badges) =>
    set({ earnedBadges: badges }),
  recordCaseGrade: (caseId, grade) =>
    set((s) => {
      const prevBest = s.bestCaseResults[caseId]
      const GRADE_ORDER = ['F', 'C', 'B', 'A', 'S']
      const isBetter = prevBest ? GRADE_ORDER.indexOf(grade) > GRADE_ORDER.indexOf(prevBest) : true
      return {
        caseResults: { ...s.caseResults, [caseId]: grade },
        bestCaseResults: isBetter
          ? { ...s.bestCaseResults, [caseId]: grade }
          : s.bestCaseResults,
      }
    }),
  dismissStrategyTutorial: () =>
    set({ strategyTutorialShown: true }),
  resetStrategyTutorial: () =>
    set({ strategyTutorialShown: false }),
  unlockCase2: () =>
    set({ case2Unlocked: true }),
  unlockCase3: () =>
    set({ case3Unlocked: true }),
  setGameStatus: (status) =>
    set({ gameStatus: status }),
  resetStrategyOnly: () =>
    set((s) => ({
      mode: 'strategy',
      sigma: STARTING_STATE.sigma,
      r0: STARTING_STATE.r0,
      budget: STARTING_STATE.budget + s.startingBudgetBonus,
      appliedInterventions: [],
      cooldowns: {},
      interventionUseCounts: {},
      lastDeployId: null,
      lastDeployTick: -10,
      gameStatus: 'playing',
      cityPaused: false,
      failedCaseCount: 0,
      permanentR0Modifier: s.permanentR0Modifier,
      earnedBadges: s.earnedBadges,
      bestCaseResults: { ...s.bestCaseResults },
    })),
  reset: () => {
    useInterventionLogStore.getState().reset()
    set({ ...DEFAULTS })
  },
}))
