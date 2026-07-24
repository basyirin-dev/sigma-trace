import { describe, it, expect, vi } from 'vitest'
import { simulateTick, buildDefaultConfig } from './simulate'
import { detectSigmaTrap } from './sigma-trap'
import { getIntervention } from './interventions'
import { SIGMA_TRAP } from './tuning'
import type { SimulationParams, PopulationState, ActiveEffect } from './index'

const config = buildDefaultConfig()

vi.setConfig({ testTimeout: 15000 })

const STEPS = 200

interface TickSummary {
  t: number
  S: number
  E: number
  I: number
  R: number
  r0: string
  σ: string
  phase: string
}

function runSimulation(
  initialState: PopulationState,
  initialR0: number,
  initialSigma: number,
  getEffects: (tick: number) => ActiveEffect[] = () => [],
): TickSummary[] {
  const summaries: TickSummary[] = []
  let state = initialState
  let sigma = initialSigma
  let r0 = initialR0

  for (let tick = 0; tick < STEPS; tick++) {
    const effects = getEffects(tick)
    const params: SimulationParams = { population: state, sigma, r0, activeEffects: effects, time: tick }
    const snapshot = simulateTick(params, config)
    state = snapshot.state
    sigma = snapshot.sigma
    r0 = snapshot.r0

    if (tick % 20 === 0 || tick === STEPS - 1) {
      summaries.push({
        t: tick,
        S: Math.round(state.susceptible),
        E: Math.round(state.exposed),
        I: Math.round(state.infected),
        R: Math.round(state.recovered),
        r0: r0.toFixed(3),
        σ: sigma.toFixed(2),
        phase: snapshot.phase,
      })
    }
  }

  return summaries
}

const BASE_STATE: PopulationState = {
  susceptible: 9900,
  exposed: 90,
  infected: 10,
  recovered: 0,
  total: 10000,
}

function logSummary(scenario: string, data: TickSummary[]): void {
  console.log(`\n${scenario}`)
  console.log('tick  S      E      I      R      r0     σ      phase')
  for (const r of data) {
    console.log(
      `${String(r.t).padStart(4)}  ${String(r.S).padStart(6)} ${String(r.E).padStart(6)} ${String(r.I).padStart(6)} ${String(r.R).padStart(6)} ${r.r0.padStart(6)} ${r.σ.padStart(5)} ${r.phase}`,
    )
  }
}

describe('Engine integration validation', () => {
  it('Scenario 1: S-curve over 200 steps no interventions', () => {
    const summaries = runSimulation(BASE_STATE, 2.0, 78)

    const peakTick = summaries.reduce(
      (max, r) => (r.I > (summaries[max]?.I ?? 0) ? summaries.indexOf(r) : max),
      0,
    )
    const peak = summaries[peakTick]!

    expect(peak.t).toBeLessThan(150)
    expect(peak.I).toBeGreaterThan(BASE_STATE.infected)
    expect(summaries[summaries.length - 1]!.I).toBeLessThan(peak.I)

    logSummary('Scenario 1: S-curve (no interventions)', summaries)
  })

  it('Scenario 2: Fact-check at step 50 reduces R0 vs no-intervention baseline', () => {
    const factCheck = getIntervention('fact-check')!

    const controlSummaries = runSimulation(BASE_STATE, 2.0, 78)
    const interventionSummaries = runSimulation(BASE_STATE, 2.0, 78, (tick) => {
      if (tick >= 50) {
        return [{
          interventionId: factCheck.id,
          remainingTicks: factCheck.effect.durationTicks,
          r0Delta: factCheck.effect.r0Delta,
          sigmaDelta: factCheck.effect.sigmaDelta,
        }]
      }
      return []
    })

    const control = controlSummaries.find((r) => r.t === 60)
    const withIntervention = interventionSummaries.find((r) => r.t === 60)

    expect(control).toBeDefined()
    expect(withIntervention).toBeDefined()
    expect(parseFloat(withIntervention!.r0)).toBeLessThan(parseFloat(control!.r0))
    expect(withIntervention!.I).toBeLessThan(control!.I)

    logSummary('Scenario 2: Fact-check at step 50', interventionSummaries)
  })

  it('Scenario 3: σ-trap triggers with high baseR0', () => {
    const trapStart: PopulationState = {
      susceptible: 1000,
      exposed: 1000,
      infected: 8000,
      recovered: 0,
      total: 10000,
    }

    let sigma = 12
    let state = trapStart
    let r0 = 4.0
    const sigmaHistory: number[] = []
    let trapDetected = false

    for (let tick = 0; tick < STEPS; tick++) {
      const params: SimulationParams = { population: state, sigma, r0, activeEffects: [], time: tick }
      const snapshot = simulateTick(params, config)
      state = snapshot.state
      sigma = snapshot.sigma
      r0 = snapshot.r0
      sigmaHistory.push(sigma)

      if (detectSigmaTrap(sigmaHistory)) {
        trapDetected = true
        break
      }
    }

    if (!trapDetected) {
      console.log('Sigma trap not detected in 200 ticks')
      console.log('First 30 sigma values:', sigmaHistory.slice(0, 30).map((v) => v.toFixed(4)))
      console.log('Last 30 sigma values:', sigmaHistory.slice(-30).map((v) => v.toFixed(4)))
      console.log('SIGMA_TRAP.THRESHOLD:', SIGMA_TRAP.THRESHOLD)
    }

    // With sigma trap threshold lowered to 10, sigma should still drop below 10
    // within 200 ticks when starting with 2000 infected and R₀=4.0
    expect(trapDetected).toBe(true)
  })
})
