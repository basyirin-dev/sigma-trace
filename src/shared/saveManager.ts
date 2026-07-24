import { useGameStore, useSimulationStore, useInterventionLogStore } from './stores'
import { SAVE_KEY } from './localStorageKeys'
import type { Phase } from '@engine/types'

export interface SaveData {
  gameStore: {
    sigma: number
    r0: number
    budget: number
    completedCases: number
    caseResults: Record<string, string>
    case2Unlocked: boolean
    case3Unlocked: boolean
    startingBudgetBonus: number
    strategyTutorialShown: boolean
    appliedInterventions: string[]
    interventionUseCounts: Record<string, number>
    cooldowns: Record<string, number>
    failedCaseCount: number
    permanentR0Modifier: number
    case1BonusClaimed: boolean
    case2BonusClaimed: boolean
    earnedBadges: string[]
    bestCaseResults: Record<string, string>
  }
  simStore: {
    population: { susceptible: number; exposed: number; infected: number; recovered: number; total: number }
    sigma: number
    r0: number
    tick: number
    phase: Phase
    activeEffects: { interventionId: string; remainingTicks: number; r0Delta: number; sigmaDelta: number }[]
    r0History: number[]
    sigmaHistory: number[]
    isRunning: boolean
    speed: number
  }
  interventionLog: { interventionId: string; tick: number; r0AtDeploy: number; sigmaAtDeploy: number }[]
  version: number
  timestamp: number
}

const VERSION = 4

const REQUIRED_GAME_KEYS: (keyof SaveData['gameStore'])[] = [
  'sigma', 'r0', 'budget', 'completedCases', 'caseResults',
  'case2Unlocked', 'case3Unlocked', 'startingBudgetBonus',
  'strategyTutorialShown', 'appliedInterventions',
  'interventionUseCounts', 'cooldowns', 'failedCaseCount',
  'permanentR0Modifier', 'case1BonusClaimed', 'case2BonusClaimed',
  'earnedBadges', 'bestCaseResults',
]

const REQUIRED_SIM_KEYS: (keyof SaveData['simStore'])[] = [
  'population', 'sigma', 'r0', 'tick', 'phase', 'activeEffects',
  'r0History', 'sigmaHistory', 'isRunning', 'speed',
]

function isValidSaveData(raw: unknown): raw is SaveData {
  if (!raw || typeof raw !== 'object') return false
  const d = raw as Record<string, unknown>
  if (typeof d.version !== 'number' || d.version !== VERSION) return false
  if (typeof d.timestamp !== 'number') return false

  const gs = d.gameStore as Record<string, unknown> | undefined
  if (!gs || typeof gs !== 'object') return false
  for (const key of REQUIRED_GAME_KEYS) {
    if (!(key in gs)) return false
  }

  const ss = d.simStore as Record<string, unknown> | undefined
  if (!ss || typeof ss !== 'object') return false
  for (const key of REQUIRED_SIM_KEYS) {
    if (!(key in ss)) return false
  }

  return true
}

export function saveGame(): void {
  try {
    const g = useGameStore.getState()
    const s = useSimulationStore.getState()
    const il = useInterventionLogStore.getState()
    const data: SaveData = {
      gameStore: {
        sigma: g.sigma,
        r0: g.r0,
        budget: g.budget,
        completedCases: g.completedCases,
        caseResults: g.caseResults,
        case2Unlocked: g.case2Unlocked,
        case3Unlocked: g.case3Unlocked,
        startingBudgetBonus: g.startingBudgetBonus,
        strategyTutorialShown: g.strategyTutorialShown,
        appliedInterventions: g.appliedInterventions,
        interventionUseCounts: g.interventionUseCounts,
        cooldowns: g.cooldowns,
        failedCaseCount: g.failedCaseCount,
        permanentR0Modifier: g.permanentR0Modifier,
        case1BonusClaimed: g.case1BonusClaimed,
        case2BonusClaimed: g.case2BonusClaimed,
        earnedBadges: [...g.earnedBadges],
        bestCaseResults: { ...g.bestCaseResults },
      },
      simStore: {
        population: { ...s.population },
        sigma: s.sigma,
        r0: s.r0,
        tick: s.tick,
        phase: s.phase,
        activeEffects: s.activeEffects.map((e) => ({ ...e })),
        r0History: [...s.r0History],
        sigmaHistory: [...s.sigmaHistory],
        isRunning: s.isRunning,
        speed: s.speed,
      },
      interventionLog: il.entries.map((e) => ({ ...e })),
      version: VERSION,
      timestamp: Date.now(),
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  } catch {
    /* noop */
  }
}

export function loadGame(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    if (!isValidSaveData(data)) return false

    useGameStore.getState().setGameStatus('playing')
    useGameStore.getState().switchMode('strategy')

    useGameStore.setState({
      sigma: data.gameStore.sigma,
      r0: data.gameStore.r0,
      budget: data.gameStore.budget,
      completedCases: data.gameStore.completedCases,
      caseResults: { ...data.gameStore.caseResults },
      case2Unlocked: data.gameStore.case2Unlocked,
      case3Unlocked: data.gameStore.case3Unlocked,
      startingBudgetBonus: data.gameStore.startingBudgetBonus,
      strategyTutorialShown: data.gameStore.strategyTutorialShown,
      appliedInterventions: [...data.gameStore.appliedInterventions],
      interventionUseCounts: { ...data.gameStore.interventionUseCounts },
      cooldowns: { ...data.gameStore.cooldowns },
      failedCaseCount: data.gameStore.failedCaseCount,
      permanentR0Modifier: data.gameStore.permanentR0Modifier,
      case1BonusClaimed: data.gameStore.case1BonusClaimed,
      case2BonusClaimed: data.gameStore.case2BonusClaimed,
      earnedBadges: [...data.gameStore.earnedBadges],
      bestCaseResults: { ...data.gameStore.bestCaseResults },
    })

    useSimulationStore.setState({
      population: { ...data.simStore.population },
      sigma: data.simStore.sigma,
      r0: data.simStore.r0,
      tick: data.simStore.tick,
      phase: data.simStore.phase,
      activeEffects: data.simStore.activeEffects.map((e) => ({ ...e })),
      r0History: [...data.simStore.r0History],
      sigmaHistory: [...data.simStore.sigmaHistory],
      isRunning: data.simStore.isRunning,
      speed: data.simStore.speed,
    })

    useInterventionLogStore.setState({
      entries: data.interventionLog.map((e) => ({ ...e })),
    })

    return true
  } catch {
    return false
  }
}

export function hasSave(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    return isValidSaveData(data)
  } catch {
    return false
  }
}

export function getSaveMeta(): { timestamp: number } | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!isValidSaveData(data)) return null
    return { timestamp: data.timestamp }
  } catch {
    return null
  }
}

export interface SaveRecords {
  bestCaseResults: Record<string, string>
  earnedBadges: string[]
  completedCases: number
  timestamp: number
}

export function getSaveRecords(): SaveRecords | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!isValidSaveData(data)) return null
    return {
      bestCaseResults: data.gameStore.bestCaseResults,
      earnedBadges: data.gameStore.earnedBadges,
      completedCases: data.gameStore.completedCases,
      timestamp: data.timestamp,
    }
  } catch {
    return null
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    /* noop */
  }
}
