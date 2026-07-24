import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore, useSimulationStore } from '@shared/stores'
import type { Verdict } from '@engine/types'
import { getIntervention } from '@engine/interventions'
import { getCaseUnlocks } from '../../strategy/useCaseUnlocks'

const FACT_CHECK_COST = getIntervention('fact-check')!.cost
const MIL_SCHOOL_COST = getIntervention('mil-school')!.cost

beforeEach(() => {
  useGameStore.getState().reset()
})

describe('GameStore', () => {
  it('initializes with correct defaults', () => {
    const state = useGameStore.getState()
    expect(state.mode).toBe('strategy')
    expect(state.sigma).toBe(78)
    expect(state.r0).toBe(0.6)
    expect(state.budget).toBe(300)
    expect(state.activeCase).toBeNull()
    expect(state.verdict).toBeNull()
    expect(state.usedTools).toEqual([])
    expect(state.appliedInterventions).toEqual([])
    expect(state.cooldowns).toEqual({})
    expect(state.interventionUseCounts).toEqual({})
    expect(state.lastDeployId).toBeNull()
    expect(state.lastDeployTick).toBe(-10)
    expect(state.completedCases).toBe(0)
    expect(state.gameStatus).toBe('playing')
  })

  it('switchMode updates the mode', () => {
    useGameStore.getState().switchMode('detective')
    expect(useGameStore.getState().mode).toBe('detective')

    useGameStore.getState().switchMode('transition')
    expect(useGameStore.getState().mode).toBe('transition')

    useGameStore.getState().switchMode('strategy')
    expect(useGameStore.getState().mode).toBe('strategy')
  })

  it('deployIntervention pushes to appliedInterventions and deducts budget', () => {
    useGameStore.getState().deployIntervention('fact-check', FACT_CHECK_COST)
    const state1 = useGameStore.getState()
    expect(state1.appliedInterventions).toEqual(['fact-check'])
    expect(state1.budget).toBe(300 - FACT_CHECK_COST)

    useGameStore.getState().deployIntervention('mil-school', MIL_SCHOOL_COST)
    const state2 = useGameStore.getState()
    expect(state2.appliedInterventions).toEqual([
      'fact-check',
      'mil-school',
    ])
    expect(state2.budget).toBe(170)
  })

  it('deployIntervention does not let budget go below zero', () => {
    useGameStore.getState().deployIntervention('algorithm-audit', 300)
    expect(useGameStore.getState().budget).toBe(0)
  })

  it('startCase sets activeCase, clears state, switches to detective', () => {
    useGameStore.getState().deployIntervention('fact-check', FACT_CHECK_COST)
    useGameStore.getState().useTool('magnifier')

    useGameStore.getState().startCase('case-1')
    const state = useGameStore.getState()
    expect(state.activeCase).toBe('case-1')
    expect(state.mode).toBe('detective')
    expect(state.verdict).toBeNull()
    expect(state.usedTools).toEqual([])
    expect(state.appliedInterventions).toEqual(['fact-check'])
  })

  it('useTool appends to usedTools', () => {
    useGameStore.getState().useTool('magnifier')
    expect(useGameStore.getState().usedTools).toEqual(['magnifier'])

    useGameStore.getState().useTool('metadata-viewer')
    expect(useGameStore.getState().usedTools).toEqual([
      'magnifier',
      'metadata-viewer',
    ])
  })

  it('submitVerdict sets verdict and returns to strategy', () => {
    useGameStore.getState().startCase('case-1')
    useGameStore.getState().submitVerdict('manipulated' as Verdict)

    const state = useGameStore.getState()
    expect(state.verdict).toBe('manipulated')
    expect(state.mode).toBe('strategy')
    expect(state.activeCase).toBe('case-1')
  })

  it('addIncome increases budget', () => {
    useGameStore.getState().addIncome(5)
    expect(useGameStore.getState().budget).toBe(305)

    useGameStore.getState().addIncome(5)
    expect(useGameStore.getState().budget).toBe(310)

    useGameStore.getState().addIncome(50)
    expect(useGameStore.getState().budget).toBe(360)
  })

  it('setCooldown sets ticks for an intervention', () => {
    useGameStore.getState().setCooldown('fact-check', 30)
    expect(useGameStore.getState().cooldowns).toEqual({ 'fact-check': 30 })
  })

  it('tickCooldowns decrements all active cooldowns by 1', () => {
    useGameStore.getState().setCooldown('fact-check', 30)
    useGameStore.getState().setCooldown('mil-school', 60)
    useGameStore.getState().tickCooldowns()
    expect(useGameStore.getState().cooldowns).toEqual({ 'fact-check': 29, 'mil-school': 59 })
  })

  it('tickCooldowns removes cooldowns that reach 0', () => {
    useGameStore.getState().setCooldown('fact-check', 2)
    useGameStore.getState().setCooldown('mil-school', 1)
    useGameStore.getState().tickCooldowns()
    expect(useGameStore.getState().cooldowns).toEqual({ 'fact-check': 1 })
  })

  it('tickCooldowns removes the last entry when it reaches 0', () => {
    useGameStore.getState().setCooldown('fact-check', 1)
    useGameStore.getState().tickCooldowns()
    expect(useGameStore.getState().cooldowns).toEqual({})
  })

  it('finishCase increments completedCases', () => {
    useGameStore.getState().finishCase(-0.2, 0.1, 100)
    expect(useGameStore.getState().completedCases).toBe(1)

    useGameStore.getState().finishCase(-0.1, 0.15, 75)
    expect(useGameStore.getState().completedCases).toBe(2)
  })

  it('gameStatus stays playing after 3 completed cases (win requires σ/R₀)', () => {
    useGameStore.getState().finishCase(-0.2, 0.1, 100)
    expect(useGameStore.getState().gameStatus).toBe('playing')

    useGameStore.getState().finishCase(-0.1, 0.15, 75)
    expect(useGameStore.getState().gameStatus).toBe('playing')

    useGameStore.getState().finishCase(-0.3, 0.2, 150)
    expect(useGameStore.getState().completedCases).toBe(3)
    expect(useGameStore.getState().gameStatus).toBe('playing')
  })

  it('finishCase updates permanentR0Modifier, sigma, and budget with correct bounds', () => {
    useGameStore.getState().finishCase(-0.5, 0.3, 100)
    const state = useGameStore.getState()
    expect(state.permanentR0Modifier).toBeCloseTo(-0.5, 10)
    expect(state.sigma).toBe(78.3)
    expect(state.budget).toBe(400)
  })

  it('cityPaused is false by default', () => {
    const state = useGameStore.getState()
    expect(state.cityPaused).toBe(false)
  })

  it('startCase sets cityPaused to true', () => {
    useGameStore.getState().startCase('case-01')
    expect(useGameStore.getState().cityPaused).toBe(true)
  })

  it('finishCase sets cityPaused back to false', () => {
    useGameStore.getState().startCase('case-01')
    expect(useGameStore.getState().cityPaused).toBe(true)

    useGameStore.getState().finishCase(-0.2, 0.1, 100)
    expect(useGameStore.getState().cityPaused).toBe(false)
  })

  it('strategy state unchanged after detective session (tick, activeEffects, population)', () => {
    const simInitial = useSimulationStore.getState()
    const tickBefore = simInitial.tick
    const popBefore = { ...simInitial.population }
    const effectsBefore = [...simInitial.activeEffects]

    useGameStore.getState().startCase('case-01')
    useGameStore.getState().finishCase(-0.2, 0.1, 100)

    const simAfter = useSimulationStore.getState()
    expect(simAfter.tick).toBe(tickBefore)
    expect(simAfter.population).toEqual(popBefore)
    expect(simAfter.activeEffects).toEqual(effectsBefore)
    expect(simAfter.isRunning).toBe(true)
  })

  it('reset clears completedCases and resets gameStatus', () => {
    useGameStore.getState().finishCase(-0.2, 0.1, 100)
    useGameStore.getState().finishCase(-0.2, 0.1, 100)
    useGameStore.getState().finishCase(-0.2, 0.1, 100)
    expect(useGameStore.getState().gameStatus).toBe('playing')

    useGameStore.getState().reset()
    expect(useGameStore.getState().completedCases).toBe(0)
    expect(useGameStore.getState().gameStatus).toBe('playing')
  })

  it('reset clears all cooldowns', () => {
    useGameStore.getState().deployIntervention('fact-check', FACT_CHECK_COST)
    useGameStore.getState().startCase('case-1')
    useGameStore.getState().useTool('magnifier')
    useGameStore.getState().submitVerdict('real' as Verdict)
    useGameStore.getState().setCooldown('fact-check', 30)

    useGameStore.getState().reset()

    const state = useGameStore.getState()
    expect(state.mode).toBe('strategy')
    expect(state.sigma).toBe(78)
    expect(state.r0).toBe(0.6)
    expect(state.budget).toBe(300)
    expect(state.activeCase).toBeNull()
    expect(state.verdict).toBeNull()
    expect(state.usedTools).toEqual([])
    expect(state.appliedInterventions).toEqual([])
    expect(state.cooldowns).toEqual({})
  })

  it('finishCase with +100 budget (S grade) increases budget from 300 to 400', () => {
    useGameStore.getState().finishCase(-0.2, 0.1, 100)
    expect(useGameStore.getState().budget).toBe(400)
  })

  it('finishCase with +75 budget (A grade) increases budget from 300 to 375', () => {
    useGameStore.getState().finishCase(-0.2, 0.1, 75)
    expect(useGameStore.getState().budget).toBe(375)
  })

  it('initial unlock state: case2Unlocked = false, case3Unlocked = false', () => {
    const state = useGameStore.getState()
    expect(state.case2Unlocked).toBe(false)
    expect(state.case3Unlocked).toBe(false)
  })

  it('unlockCase2 sets case2Unlocked to true', () => {
    useGameStore.getState().unlockCase2()
    expect(useGameStore.getState().case2Unlocked).toBe(true)
  })

  it('unlockCase3 sets case3Unlocked to true', () => {
    useGameStore.getState().unlockCase3()
    expect(useGameStore.getState().case3Unlocked).toBe(true)
  })

  it('unlock flags persist after finishCase roundtrip', () => {
    useGameStore.getState().unlockCase2()
    useGameStore.getState().unlockCase3()
    useGameStore.getState().startCase('case-01')
    useGameStore.getState().finishCase(-0.2, 0.1, 100)
    expect(useGameStore.getState().case2Unlocked).toBe(true)
    expect(useGameStore.getState().case3Unlocked).toBe(true)
  })

  it('reset clears unlock flags', () => {
    useGameStore.getState().unlockCase2()
    useGameStore.getState().unlockCase3()
    useGameStore.getState().reset()
    expect(useGameStore.getState().case2Unlocked).toBe(false)
    expect(useGameStore.getState().case3Unlocked).toBe(false)
  })

  it('bad strategy performance (sigma < 40, tick < 120) — only case-01 unlocked via getCaseUnlocks', () => {
    const unlocks = getCaseUnlocks()
    expect(unlocks.find((c) => c.id === 'case-01')!.unlocked).toBe(true)
    expect(unlocks.find((c) => c.id === 'case-02')!.unlocked).toBe(false)
    expect(unlocks.find((c) => c.id === 'case-03')!.unlocked).toBe(false)
  })

  it('recordCaseGrade stores grade for case ID', () => {
    useGameStore.getState().recordCaseGrade('case-01', 'S')
    const state = useGameStore.getState()
    expect(state.caseResults['case-01']).toBe('S')
  })

  it('recordCaseGrade accumulates multiple results', () => {
    useGameStore.getState().recordCaseGrade('case-01', 'A')
    useGameStore.getState().recordCaseGrade('case-02', 'B')
    const state = useGameStore.getState()
    expect(state.caseResults['case-01']).toBe('A')
    expect(state.caseResults['case-02']).toBe('B')
  })

  it('startingBudgetBonus starts at 0', () => {
    expect(useGameStore.getState().startingBudgetBonus).toBe(0)
  })

  it('Case 2 S/A adds extra 50 budget bonus via finishCase', () => {
    useGameStore.getState().startCase('case-02')
    useGameStore.getState().recordCaseGrade('case-02', 'S')
    useGameStore.getState().finishCase(-0.2, 0.1, 75)
    expect(useGameStore.getState().budget).toBe(300 + 75 + 50)
  })

  it('setGameStatus updates gameStatus', () => {
    useGameStore.getState().setGameStatus('won')
    expect(useGameStore.getState().gameStatus).toBe('won')
    useGameStore.getState().setGameStatus('lost')
    expect(useGameStore.getState().gameStatus).toBe('lost')
  })

  it('resetStrategyOnly preserves detective progress', () => {
    useGameStore.getState().recordCaseGrade('case-01', 'S')
    useGameStore.getState().recordCaseGrade('case-02', 'A')
    useGameStore.getState().unlockCase2()
    useGameStore.getState().unlockCase3()
    useGameStore.getState().deployIntervention('fact-check', 50)

    useGameStore.getState().resetStrategyOnly()

    const state = useGameStore.getState()
    expect(state.caseResults['case-01']).toBe('S')
    expect(state.caseResults['case-02']).toBe('A')
    expect(state.case2Unlocked).toBe(true)
    expect(state.case3Unlocked).toBe(true)
  })

  it('resetStrategyOnly resets strategy state', () => {
    useGameStore.getState().deployIntervention('fact-check', 50)
    useGameStore.getState().deployIntervention('mil-school', 80)
    useGameStore.getState().setCooldown('fact-check', 10)

    useGameStore.getState().resetStrategyOnly()

    const state = useGameStore.getState()
    expect(state.appliedInterventions.length).toBe(0)
    expect(state.cooldowns).toEqual({})
    expect(state.gameStatus).toBe('playing')
    expect(state.mode).toBe('strategy')
  })
})
