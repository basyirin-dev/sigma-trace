import { describe, it, expect } from 'vitest'
import { computeSigma } from './sigma'
import type { PopulationState, ActiveEffect } from './types'

function makeState(infected: number, total: number): PopulationState {
  return { susceptible: total - infected, exposed: 0, infected, recovered: 0, total }
}

describe('computeSigma', () => {
  it('drops when infected population is large', () => {
    const state = makeState(500, 1000)
    const result = computeSigma(state, 80, [], 1.0)
    expect(result).toBeLessThan(80)
  })

  it('recovers with active interventions', () => {
    const state = makeState(500, 1000)
    const interventions: ActiveEffect[] = [
      { interventionId: 'mil-school', remainingTicks: 10, r0Delta: 0, sigmaDelta: 3 },
    ]
    const decayOnly = computeSigma(state, 60, [], 1.0)
    const withBoost = computeSigma(state, 60, interventions, 1.0)
    expect(withBoost).toBeGreaterThan(decayOnly)
  })

  it('clamps to [0, 100]', () => {
    const state = makeState(0, 1000)
    const below = computeSigma(state, -10, [], 1.0)
    const above = computeSigma(state, 120, [], 1.0)
    expect(below).toBe(0)
    expect(above).toBe(100)
  })

  it('higher prevSigma decays faster at same infection level', () => {
    const state = makeState(300, 1000)
    const low = computeSigma(state, 30, [], 1.0)
    const high = computeSigma(state, 80, [], 1.0)
    const lowDecay = 30 - low
    const highDecay = 80 - high
    expect(highDecay).toBeGreaterThan(lowDecay)
  })

  it('intervention boost is saturated at high sigma', () => {
    const infected = makeState(400, 1000)
    const interventions: ActiveEffect[] = [
      { interventionId: 'test', remainingTicks: 10, r0Delta: 0, sigmaDelta: 5 },
    ]

    const boostLow = computeSigma(infected, 30, interventions, 1.0) - computeSigma(infected, 30, [], 1.0)
    const boostHigh = computeSigma(infected, 90, interventions, 1.0) - computeSigma(infected, 90, [], 1.0)
    expect(boostLow).toBeGreaterThan(boostHigh)
  })

  it('dt scales both decay and recovery proportionally', () => {
    const infected = makeState(400, 1000)
    const clean = makeState(0, 1000)
    const interventions: ActiveEffect[] = [
      { interventionId: 'test', remainingTicks: 10, r0Delta: 0, sigmaDelta: 2 },
    ]

    const decayDt1 = 70 - computeSigma(infected, 70, [], 1.0)
    const decayDt2 = 70 - computeSigma(infected, 70, [], 2.0)
    expect(decayDt2).toBeCloseTo(decayDt1 * 2, 5)

    const recoveryDt1 = computeSigma(clean, 50, interventions, 1.0) - 50
    const recoveryDt2 = computeSigma(clean, 50, interventions, 2.0) - 50
    expect(recoveryDt2).toBeCloseTo(recoveryDt1 * 2, 5)
  })
})
