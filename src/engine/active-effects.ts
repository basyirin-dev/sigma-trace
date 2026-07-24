import type { Intervention } from './interventions'
import type { ActiveEffect } from './types'
import { INTERVENTION_DEFAULTS } from './tuning'

export function createActiveEffect(
  intervention: Intervention,
  districtId?: number,
): ActiveEffect {
  if (intervention.effect.durationTicks <= 0) {
    return {
      interventionId: intervention.id,
      remainingTicks: 0,
      r0Delta: 0,
      sigmaDelta: 0,
      districtId,
    }
  }
  return {
    interventionId: intervention.id,
    remainingTicks: intervention.effect.durationTicks,
    r0Delta: intervention.effect.r0Delta,
    sigmaDelta: intervention.effect.sigmaDelta,
    districtId,
  }
}

export function applyTargetedMultiplier(effect: ActiveEffect): ActiveEffect {
  if (effect.districtId === undefined) return effect
  return {
    ...effect,
    r0Delta: effect.r0Delta * INTERVENTION_DEFAULTS.TARGETED_DISTRICT_MULTIPLIER,
    sigmaDelta: effect.sigmaDelta * INTERVENTION_DEFAULTS.TARGETED_DISTRICT_MULTIPLIER,
  }
}

export function tickActiveEffects(effects: ActiveEffect[]): ActiveEffect[] {
  return effects
    .map((e) => ({ ...e, remainingTicks: e.remainingTicks - 1 }))
    .filter((e) => e.remainingTicks > 0)
}
