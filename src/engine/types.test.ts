import { describe, it, expect } from 'vitest'
import type { CityPopulation, Phase, Verdict } from './types'

describe('engine types', () => {
  it('CityPopulation has correct shape', () => {
    const pop: CityPopulation = { S: 400000, E: 50000, I: 30000, R: 20000, N: 500000 }
    expect(pop.N).toBe(500000)
  })

  it('Verdict accepts valid values', () => {
    const verdicts: Verdict[] = ['real', 'manipulated', 'uncertain']
    expect(verdicts).toHaveLength(3)
  })

  it('Phase accepts valid values', () => {
    const phases: Phase[] = ['calm', 'outbreak', 'trap']
    expect(phases).toHaveLength(3)
  })
})
