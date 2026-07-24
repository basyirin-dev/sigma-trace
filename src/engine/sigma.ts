import type { PopulationState, ActiveEffect } from './types'
import { SIGMA_DECAY_COEFFICIENT, SIGMA_MIN, SIGMA_MAX } from './constants'
import { SIGMA_DYNAMICS } from './tuning'

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function computeSigma(
  state: PopulationState,
  prevSigma: number,
  interventions: ActiveEffect[],
  dt: number,
): number {
  const infectedFraction = state.infected / state.total
  const decay = SIGMA_DECAY_COEFFICIENT * infectedFraction * (prevSigma / SIGMA_MAX) * dt
  const rawRecovery = Math.min(SIGMA_DYNAMICS.MAX_INTERVENTION_DELTA, interventions.reduce((sum, e) => sum + e.sigmaDelta, 0)) * dt
  const saturation = 1 - prevSigma / SIGMA_MAX
  const recovery = rawRecovery * saturation
  return clamp(prevSigma - decay + recovery, SIGMA_MIN, SIGMA_MAX)
}
