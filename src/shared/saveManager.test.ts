import { describe, it, expect, beforeEach } from 'vitest'
import {
  saveGame,
  loadGame,
  hasSave,
  clearSave,
  getSaveMeta,
} from './saveManager'
import { useGameStore } from './stores/gameStore'
import { useSimulationStore } from './stores/useSimulationStore'
import { useInterventionLogStore } from './stores/useInterventionLogStore'
import { SAVE_KEY } from './localStorageKeys'

beforeEach(() => {
  localStorage.clear()
  useGameStore.getState().reset()
  useSimulationStore.getState().resetSimulation()
  useInterventionLogStore.setState({ entries: [] })
})

describe('saveManager', () => {
  it('hasSave returns false with no save', () => {
    expect(hasSave()).toBe(false)
  })

  it('hasSave returns false for corrupt JSON', () => {
    localStorage.setItem(SAVE_KEY, 'not-json')
    expect(hasSave()).toBe(false)
  })

  it('hasSave returns false for wrong version', () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 999 }))
    expect(hasSave()).toBe(false)
  })

  it('hasSave returns false for missing required fields', () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: 3,
      timestamp: Date.now(),
      gameStore: { sigma: 100 },
      simStore: {},
    }))
    expect(hasSave()).toBe(false)
  })

  it('hasSave returns true after saveGame', () => {
    expect(hasSave()).toBe(false)
    saveGame()
    expect(hasSave()).toBe(true)
  })

  it('clearSave removes the key', () => {
    saveGame()
    expect(hasSave()).toBe(true)
    clearSave()
    expect(hasSave()).toBe(false)
  })

  it('getSaveMeta returns null with no save', () => {
    expect(getSaveMeta()).toBeNull()
  })

  it('getSaveMeta returns null for corrupt data', () => {
    localStorage.setItem(SAVE_KEY, 'garbage')
    expect(getSaveMeta()).toBeNull()
  })

  it('getSaveMeta returns timestamp after save', () => {
    saveGame()
    const meta = getSaveMeta()
    expect(meta).not.toBeNull()
    expect(meta!.timestamp).toBeGreaterThan(0)
  })

  it('save → load round-trip restores game store', () => {
    useGameStore.setState({
      sigma: 65,
      r0: 1.8,
      budget: 120,
      completedCases: 2,
      caseResults: { 'case-01': 'A', 'case-02': 'B' },
      case2Unlocked: true,
      case3Unlocked: true,
      startingBudgetBonus: 20,
      strategyTutorialShown: true,
      appliedInterventions: ['media-lit', 'source-verify'],
      interventionUseCounts: { 'media-lit': 1 },
      cooldowns: { 'media-lit': 3 },
      failedCaseCount: 0,
      permanentR0Modifier: 0.2,
      case1BonusClaimed: true,
      case2BonusClaimed: false,
    })

    saveGame()
    useGameStore.getState().reset()
    expect(useGameStore.getState().sigma).not.toBe(65)

    const loaded = loadGame()
    expect(loaded).toBe(true)

    const g = useGameStore.getState()
    expect(g.sigma).toBe(65)
    expect(g.r0).toBe(1.8)
    expect(g.budget).toBe(120)
    expect(g.completedCases).toBe(2)
    expect(g.caseResults).toEqual({ 'case-01': 'A', 'case-02': 'B' })
    expect(g.case2Unlocked).toBe(true)
    expect(g.case3Unlocked).toBe(true)
    expect(g.startingBudgetBonus).toBe(20)
    expect(g.strategyTutorialShown).toBe(true)
    expect(g.appliedInterventions).toEqual(['media-lit', 'source-verify'])
    expect(g.interventionUseCounts).toEqual({ 'media-lit': 1 })
    expect(g.cooldowns).toEqual({ 'media-lit': 3 })
    expect(g.failedCaseCount).toBe(0)
    expect(g.permanentR0Modifier).toBe(0.2)
    expect(g.case1BonusClaimed).toBe(true)
    expect(g.case2BonusClaimed).toBe(false)
  })

  it('save → load round-trip restores simulation store', () => {
    useSimulationStore.setState({
      population: { susceptible: 800, exposed: 100, infected: 50, recovered: 50, total: 1000 },
      sigma: 55,
      r0: 1.5,
      tick: 42,
      phase: 'outbreak',
      activeEffects: [{ interventionId: 'fact-check', remainingTicks: 3, r0Delta: -0.3, sigmaDelta: 5 }],
      r0History: [1.2, 1.3, 1.5],
      sigmaHistory: [60, 58, 55],
      isRunning: false,
      speed: 2,
    })

    saveGame()
    useSimulationStore.getState().resetSimulation()
    expect(useSimulationStore.getState().tick).not.toBe(42)

    loadGame()

    const s = useSimulationStore.getState()
    expect(s.population).toEqual({ susceptible: 800, exposed: 100, infected: 50, recovered: 50, total: 1000 })
    expect(s.sigma).toBe(55)
    expect(s.r0).toBe(1.5)
    expect(s.tick).toBe(42)
    expect(s.phase).toBe('outbreak')
    expect(s.activeEffects).toHaveLength(1)
    const effect = s.activeEffects[0]!
    expect(effect.interventionId).toBe('fact-check')
    expect(effect.remainingTicks).toBe(3)
    expect(s.r0History).toEqual([1.2, 1.3, 1.5])
    expect(s.sigmaHistory).toEqual([60, 58, 55])
    expect(s.isRunning).toBe(false)
    expect(s.speed).toBe(2)
  })

  it('save → load round-trip restores intervention log', () => {
    useInterventionLogStore.setState({
      entries: [
        { interventionId: 'media-lit', tick: 5, r0AtDeploy: 2.1, sigmaAtDeploy: 50 },
        { interventionId: 'source-verify', tick: 10, r0AtDeploy: 1.8, sigmaAtDeploy: 45 },
      ],
    })

    saveGame()
    useInterventionLogStore.setState({ entries: [] })

    loadGame()

    const il = useInterventionLogStore.getState()
    expect(il.entries).toHaveLength(2)
    expect(il.entries[0]!.interventionId).toBe('media-lit')
    expect(il.entries[0]!.tick).toBe(5)
    expect(il.entries[1]!.interventionId).toBe('source-verify')
    expect(il.entries[1]!.tick).toBe(10)
  })

  it('loadGame returns false with no save', () => {
    expect(loadGame()).toBe(false)
  })

  it('loadGame returns false with corrupt JSON', () => {
    localStorage.setItem(SAVE_KEY, '{{{')
    expect(loadGame()).toBe(false)
  })

  it('loadGame returns false with wrong version', () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, gameStore: {}, simStore: {}, interventionLog: [] }))
    expect(loadGame()).toBe(false)
  })

  it('loadGame returns false with missing gameStore fields', () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: 3,
      timestamp: Date.now(),
      gameStore: { sigma: 50 },
      simStore: {
        population: { susceptible: 0, exposed: 0, infected: 0, recovered: 0, total: 1000 },
        sigma: 50, r0: 1, tick: 0, phase: 'calm',
        activeEffects: [], r0History: [], sigmaHistory: [],
        isRunning: true, speed: 1,
      },
      interventionLog: [],
    }))
    expect(loadGame()).toBe(false)
  })

  it('loadGame sets gameStatus to playing and mode to strategy', () => {
    useGameStore.setState({ gameStatus: 'won', mode: 'transition' })
    saveGame()
    useGameStore.setState({ gameStatus: 'lost', mode: 'detective' })
    loadGame()
    const g = useGameStore.getState()
    expect(g.gameStatus).toBe('playing')
    expect(g.mode).toBe('strategy')
  })
})
