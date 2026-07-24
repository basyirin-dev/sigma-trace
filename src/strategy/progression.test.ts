import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@shared/stores/gameStore'
import { useSimulationStore } from '@shared/stores/useSimulationStore'
import { checkUnlocks, getCaseUnlocks, CASE_INFO, resetUnlockNotification } from '@strategy/useCaseUnlocks'
import { resolveBuffs, getEffectivenessMultiplier, getEffectiveInterventions } from '@strategy/buffs'
import { STARTING_STATE } from '@engine/tuning'

describe('Progression: Case Unlocks', () => {
  beforeEach(() => {
    useGameStore.setState({
      case2Unlocked: false,
      case3Unlocked: false,
      completedCases: 0,
    })
    useSimulationStore.setState({
      sigma: STARTING_STATE.sigma,
      r0: STARTING_STATE.r0,
      tick: 0,
    })
    resetUnlockNotification()
  })

  it('case-01 is always unlocked', () => {
    const unlocks = getCaseUnlocks()
    const case1 = unlocks.find((c) => c.id === 'case-01')
    expect(case1?.unlocked).toBe(true)
  })

  it('case-02 unlocks when sigma >= 40', () => {
    useSimulationStore.setState({ sigma: 39 })
    checkUnlocks()
    expect(useGameStore.getState().case2Unlocked).toBe(false)

    useSimulationStore.setState({ sigma: 40 })
    checkUnlocks()
    expect(useGameStore.getState().case2Unlocked).toBe(true)
  })

  it('case-03 unlocks when tick >= 80 and r0 < 1.5', () => {
    useSimulationStore.setState({ tick: 79, r0: 0.5 })
    checkUnlocks()
    expect(useGameStore.getState().case3Unlocked).toBe(false)

    useSimulationStore.setState({ tick: 80, r0: 1.5 })
    checkUnlocks()
    expect(useGameStore.getState().case3Unlocked).toBe(false)

    useSimulationStore.setState({ tick: 80, r0: 1.4 })
    checkUnlocks()
    expect(useGameStore.getState().case3Unlocked).toBe(true)
  })

  it('case info hints reference correct unlock values', () => {
    const case2Hint = CASE_INFO[1]!.hint
    expect(case2Hint).toContain('40')

    const case3Hint = CASE_INFO[2]!.hint
    expect(case3Hint).toContain('80')
    expect(case3Hint).toContain('1.5')
  })
})

describe('Progression: Permanent Buffs', () => {
  it('resolveBuffs returns +10% effectiveness when case-01 is S/A', () => {
    const results1: Record<string, string> = { 'case-01': 'A' }
    const buffs1 = resolveBuffs(results1)
    expect(buffs1).toHaveLength(1)
    expect(buffs1[0]!.id).toBe('intervention-bonus')

    const results2: Record<string, string> = { 'case-01': 'S' }
    const buffs2 = resolveBuffs(results2)
    expect(buffs2).toHaveLength(1)
    expect(buffs2[0]!.id).toBe('intervention-bonus')

    const results3: Record<string, string> = { 'case-01': 'B' }
    const buffs3 = resolveBuffs(results3)
    expect(buffs3).toHaveLength(0)
  })

  it('getEffectivenessMultiplier returns 1.0 for B/C/F grades on case-01', () => {
    expect(getEffectivenessMultiplier({ 'case-01': 'B' })).toBe(1.0)
    expect(getEffectivenessMultiplier({ 'case-01': 'C' })).toBe(1.0)
    expect(getEffectivenessMultiplier({ 'case-01': 'F' })).toBe(1.0)
    expect(getEffectivenessMultiplier({})).toBe(1.0)
  })

  it('getEffectivenessMultiplier returns 1.1 for S/A on case-01', () => {
    expect(getEffectivenessMultiplier({ 'case-01': 'S' })).toBe(1.1)
    expect(getEffectivenessMultiplier({ 'case-01': 'A' })).toBe(1.1)
  })

  it('resolveBuffs returns emergency unlock when case-03 is S/A', () => {
    const results = { 'case-01': 'A', 'case-03': 'A' }
    const buffs = resolveBuffs(results)
    const emergency = buffs.find((b) => b.id === 'emergency-unlock')
    expect(emergency).toBeDefined()
  })

  it('getEffectiveInterventions upgrades Emergency Broadcast when case-03 is S/A', () => {
    const interventions = getEffectiveInterventions({ 'case-03': 'S' })
    const emergency = interventions.find((i) => i.id === 'emergency-broadcast')
    expect(emergency).toBeDefined()
    expect(emergency!.cost).toBe(300)
    expect(emergency!.effect.r0Delta).toBe(-0.6)
    expect(emergency!.cooldown).toBe(60)
    expect(emergency!.effect.durationTicks).toBe(15)
  })

  it('getEffectiveInterventions keeps normal Emergency Broadcast when case-03 is not S/A', () => {
    const interventions = getEffectiveInterventions({ 'case-03': 'B' })
    const emergency = interventions.find((i) => i.id === 'emergency-broadcast')
    expect(emergency).toBeDefined()
    expect(emergency!.cost).toBe(100)
    expect(emergency!.cooldown).toBe(75)
  })
})

describe('Progression: Composite Grade', () => {
  const GRADE_VALUES: Record<string, number> = { S: 5, A: 4, B: 3, C: 2, F: 0 }

  function computeCompositeGrade(caseResults: Record<string, string>): string {
    const grades = Object.values(caseResults)
    if (grades.length === 0) return 'F'
    const total = grades.reduce((s, g) => s + (GRADE_VALUES[g] ?? 0), 0)
    const avg = total / grades.length
    if (avg >= 4.5) return 'S'
    if (avg >= 3.5) return 'A'
    if (avg >= 2.5) return 'B'
    if (avg >= 1.5) return 'C'
    return 'F'
  }

  it('grades S when all results are S', () => {
    expect(computeCompositeGrade({ 'case-01': 'S', 'case-02': 'S', 'case-03': 'S' })).toBe('S')
  })

  it('grades S when average >= 4.5', () => {
    expect(computeCompositeGrade({ 'case-01': 'S', 'case-02': 'S', 'case-03': 'A' })).toBe('S')
  })

  it('grades A when average >= 3.5', () => {
    expect(computeCompositeGrade({ 'case-01': 'A', 'case-02': 'A', 'case-03': 'B' })).toBe('A')
    expect(computeCompositeGrade({ 'case-01': 'B', 'case-02': 'A', 'case-03': 'B' })).toBe('B')
    expect(computeCompositeGrade({ 'case-01': 'F', 'case-02': 'S', 'case-03': 'B' })).toBe('B')
  })

  it('grades B when average >= 2.5', () => {
    expect(computeCompositeGrade({ 'case-01': 'B', 'case-02': 'B', 'case-03': 'B' })).toBe('B')
  })

  it('grades C when average >= 1.5', () => {
    expect(computeCompositeGrade({ 'case-01': 'C', 'case-02': 'C', 'case-03': 'C' })).toBe('C')
  })

  it('grades F when no cases completed', () => {
    expect(computeCompositeGrade({})).toBe('F')
  })

  it('grades F when average < 1.5', () => {
    expect(computeCompositeGrade({ 'case-01': 'F', 'case-02': 'F', 'case-03': 'F' })).toBe('F')
  })

  it('handles 2-case completion gracefully', () => {
    expect(computeCompositeGrade({ 'case-01': 'S', 'case-02': 'S' })).toBe('S')
    expect(computeCompositeGrade({ 'case-01': 'B', 'case-02': 'C' })).toBe('B')
  })
})

describe('Progression: Budget Bonus Stacking', () => {
  beforeEach(() => {
    useGameStore.setState({
      startingBudgetBonus: 0,
      case1BonusClaimed: false,
      case2BonusClaimed: false,
      completedCases: 0,
      budget: STARTING_STATE.budget,
    })
  })

  it('Case 1 S grade adds 50 budget bonus', () => {
    useGameStore.getState().startCase('case-01')
    useGameStore.getState().recordCaseGrade('case-01', 'S')
    useGameStore.getState().finishCase(0, 0, 0)
    expect(useGameStore.getState().startingBudgetBonus).toBe(50)
    expect(useGameStore.getState().case1BonusClaimed).toBe(true)
  })

  it('Case 1 A grade adds 50 budget bonus', () => {
    useGameStore.getState().startCase('case-01')
    useGameStore.getState().recordCaseGrade('case-01', 'A')
    useGameStore.getState().finishCase(0, 0, 0)
    expect(useGameStore.getState().startingBudgetBonus).toBe(50)
  })

  it('Case 1 B grade does not add bonus', () => {
    useGameStore.getState().startCase('case-01')
    useGameStore.getState().recordCaseGrade('case-01', 'B')
    useGameStore.getState().finishCase(0, 0, 0)
    expect(useGameStore.getState().startingBudgetBonus).toBe(0)
  })

  it('Case 2 S grade adds 50 budget bonus separately', () => {
    useGameStore.getState().startCase('case-01')
    useGameStore.getState().recordCaseGrade('case-01', 'S')
    useGameStore.getState().finishCase(0, 0, 0)
    expect(useGameStore.getState().startingBudgetBonus).toBe(50)
    expect(useGameStore.getState().case1BonusClaimed).toBe(true)

    useGameStore.getState().startCase('case-02')
    useGameStore.getState().recordCaseGrade('case-02', 'S')
    useGameStore.getState().finishCase(0, 0, 0)
    expect(useGameStore.getState().startingBudgetBonus).toBe(100)
    expect(useGameStore.getState().case2BonusClaimed).toBe(true)
  })

  it('Case 2 bonus does not stack if Case 1 already claimed both', () => {
    useGameStore.getState().startCase('case-02')
    useGameStore.getState().recordCaseGrade('case-02', 'S')
    useGameStore.getState().finishCase(0, 0, 0)
    expect(useGameStore.getState().startingBudgetBonus).toBe(50)
    expect(useGameStore.getState().case2BonusClaimed).toBe(true)
  })
})
