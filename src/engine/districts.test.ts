import { describe, it, expect } from 'vitest'
import { DISTRICTS, getDistrict, computeDistrictEffectiveR0 } from './districts'
import { computeR0 } from './r0'
import type { SimulationConfig } from './types'

describe('DISTRICTS', () => {
  it('has 4 districts', () => {
    expect(DISTRICTS).toHaveLength(4)
  })

  it('has unique IDs', () => {
    const ids = DISTRICTS.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has population with correct total', () => {
    for (const district of DISTRICTS) {
      expect(district.population.total).toBeGreaterThan(0)
      const sum = district.population.susceptible
        + district.population.exposed
        + district.population.infected
        + district.population.recovered
      expect(sum).toBe(district.population.total)
    }
  })

  it('Foundry has higher effective R0 than Uptown under identical parameters', () => {
    const config: SimulationConfig = {
      baseR0: 1.0,
      literacyRate: 30,
      factCheckCoverage: 10,
      algorithmAuditActive: false,
      recoveryRate: 0.1,
      incubationRate: 0.2,
    }

    const foundry = DISTRICTS.find((d) => d.id === 'foundry')!
    const uptown = DISTRICTS.find((d) => d.id === 'uptown')!

    const foundryR0 = computeR0(foundry.population, { ...config, baseR0: foundry.baseR0 })
    const uptownR0 = computeR0(uptown.population, { ...config, baseR0: uptown.baseR0 })

    expect(foundryR0).toBeGreaterThan(uptownR0)
  })

  it('getDistrict returns the correct district by id', () => {
    const foundry = getDistrict('foundry')
    expect(foundry).toBeDefined()
    expect(foundry!.name).toBe('Foundry')
  })

  it('getDistrict returns undefined for unknown id', () => {
    expect(getDistrict('nonexistent')).toBeUndefined()
  })

  it('computeDistrictEffectiveR0 returns positive value', () => {
    const foundry = DISTRICTS.find((d) => d.id === 'foundry')!
    const config: SimulationConfig = {
      baseR0: 1.0,
      literacyRate: 30,
      factCheckCoverage: 10,
      algorithmAuditActive: false,
      recoveryRate: 0.1,
      incubationRate: 0.2,
    }
    const effective = computeDistrictEffectiveR0(foundry, 1.5, config)
    expect(effective).toBeGreaterThanOrEqual(0)
  })
})
