import type { ActiveEffect, SimulationConfig, SimulationSnapshot } from './types'
import { computeSigma } from './sigma'
import { classifyPhase } from './phase-classifier'
import { tickActiveEffects } from './active-effects'
import { computeR0 } from './r0'
import { RECOVERY_RATE, INCUBATION_RATE, SIGMA_MIN, SIGMA_MAX, R0_MIN, R0_MAX } from './constants'
import { getRampBaseR0 } from './tuning'

export interface SimulationParams {
  population: { susceptible: number; exposed: number; infected: number; recovered: number; total: number }
  sigma: number
  r0: number
  activeEffects: ActiveEffect[]
  time: number
}

export function buildDefaultConfig(tick?: number): SimulationConfig {
  return {
    baseR0: tick !== undefined ? getRampBaseR0(tick) : 2.5,
    literacyRate: 0,
    factCheckCoverage: 0,
    algorithmAuditActive: false,
    recoveryRate: RECOVERY_RATE,
    incubationRate: INCUBATION_RATE,
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function simulateTick(params: SimulationParams, config: SimulationConfig): SimulationSnapshot {
  const { population, sigma, r0, activeEffects, time } = params
  const { susceptible, exposed, infected, recovered, total } = population

  const beta = r0 * config.recoveryRate
  const deltaS = (-beta * susceptible * infected) / total
  const deltaE = (beta * susceptible * infected) / total - config.incubationRate * exposed
  const deltaI = config.incubationRate * exposed - config.recoveryRate * infected
  const deltaR = config.recoveryRate * infected

  const liveEffects = tickActiveEffects(activeEffects)

  const nextSigma = computeSigma(population, sigma, activeEffects, 1.0)
  const nextR0 = computeR0(population, config, activeEffects)

  const nextPhase = classifyPhase(nextSigma, nextR0)

  return {
    state: {
      susceptible: clamp(susceptible + deltaS, 0, total),
      exposed: clamp(exposed + deltaE, 0, total),
      infected: clamp(infected + deltaI, 0, total),
      recovered: clamp(recovered + deltaR, 0, total),
      total,
    },
    r0: clamp(nextR0, R0_MIN, R0_MAX),
    sigma: clamp(nextSigma, SIGMA_MIN, SIGMA_MAX),
    phase: nextPhase,
    time,
    interventions: liveEffects,
  }
}
