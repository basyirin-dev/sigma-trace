import { describe, it, expect } from 'vitest'
import { resolveBuffs, getEffectivenessMultiplier, getEffectiveInterventions } from './buffs'

describe('resolveBuffs', () => {
  it('no cases completed returns empty buffs', () => {
    const buffs = resolveBuffs({})
    expect(buffs.length).toBe(0)
  })

  it('Case 1 Grade A returns intervention bonus buff', () => {
    const buffs = resolveBuffs({ 'case-01': 'A' })
    expect(buffs.find((b) => b.id === 'intervention-bonus')).toBeDefined()
  })

  it('Case 1 Grade S returns intervention bonus buff', () => {
    const buffs = resolveBuffs({ 'case-01': 'S' })
    expect(buffs.find((b) => b.id === 'intervention-bonus')).toBeDefined()
  })

  it('Case 1 Grade B does NOT return buff', () => {
    const buffs = resolveBuffs({ 'case-01': 'B' })
    expect(buffs.find((b) => b.id === 'intervention-bonus')).toBeUndefined()
  })

  it('Case 3 Grade A returns emergency unlock buff', () => {
    const buffs = resolveBuffs({ 'case-03': 'A' })
    expect(buffs.find((b) => b.id === 'emergency-unlock')).toBeDefined()
  })

  it('two buffs active when all cases S', () => {
    const buffs = resolveBuffs({ 'case-01': 'S', 'case-02': 'S', 'case-03': 'S' })
    expect(buffs.length).toBe(2)
  })

  it('F grade never gives buffs', () => {
    const buffs = resolveBuffs({ 'case-01': 'F', 'case-02': 'F', 'case-03': 'F' })
    expect(buffs.length).toBe(0)
  })
})

describe('getEffectivenessMultiplier', () => {
  it('returns 1.0 with no case results', () => {
    expect(getEffectivenessMultiplier({})).toBe(1.0)
  })

  it('returns 1.1 when Case 1 Grade A', () => {
    expect(getEffectivenessMultiplier({ 'case-01': 'A' })).toBe(1.1)
  })

  it('returns 1.1 when Case 1 Grade S', () => {
    expect(getEffectivenessMultiplier({ 'case-01': 'S' })).toBe(1.1)
  })

  it('returns 1.0 when Case 1 Grade B', () => {
    expect(getEffectivenessMultiplier({ 'case-01': 'B' })).toBe(1.0)
  })
})

describe('getEffectiveInterventions', () => {
  it('returns default interventions when no Case 3 buff', () => {
    const list = getEffectiveInterventions({})
    const emergency = list.find((i) => i.id === 'emergency-broadcast')
    expect(emergency).toBeDefined()
    expect(emergency!.cost).toBe(100)
  })

  it('upgrades emergency broadcast when Case 3 Grade A', () => {
    const list = getEffectiveInterventions({ 'case-03': 'A' })
    const emergency = list.find((i) => i.id === 'emergency-broadcast')
    expect(emergency).toBeDefined()
    expect(emergency!.cost).toBe(300)
    expect(emergency!.cooldown).toBe(60)
    expect(emergency!.effect.r0Delta).toBe(-0.6)
  })

  it('upgrades emergency broadcast when Case 3 Grade S', () => {
    const list = getEffectiveInterventions({ 'case-03': 'S' })
    const emergency = list.find((i) => i.id === 'emergency-broadcast')
    expect(emergency!.cost).toBe(300)
    expect(emergency!.effect.durationTicks).toBe(15)
  })

  it('other interventions are unchanged when emergency is upgraded', () => {
    const list = getEffectiveInterventions({ 'case-03': 'A' })
    const factCheck = list.find((i) => i.id === 'fact-check')
    expect(factCheck!.cost).toBe(50)
    expect(factCheck!.effect.r0Delta).toBe(-0.2)
  })
})
