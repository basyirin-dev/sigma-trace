import type { PopulationState, SimulationConfig, ActiveEffect } from './types'
import { LITERACY_MITIGATION_FACTOR, FACTCHECK_MITIGATION_FACTOR, AUDIT_MITIGATION_FACTOR, R0_NOISE_AMPLITUDE } from './constants'
import { R0_MITIGATION } from './tuning'

export function computeR0(
  state: PopulationState,
  config: SimulationConfig,
  activeEffects?: ActiveEffect[],
): number {
  const { baseR0, literacyRate, factCheckCoverage, algorithmAuditActive } = config
  const { susceptible, total } = state

  const literacyMitigation = (literacyRate / 100) * LITERACY_MITIGATION_FACTOR
  const factCheckMitigation = (factCheckCoverage / 100) * FACTCHECK_MITIGATION_FACTOR
  const auditMitigation = algorithmAuditActive ? AUDIT_MITIGATION_FACTOR : 0

  const interventionR0Delta = activeEffects && activeEffects.length > 0
    ? Math.max(-R0_MITIGATION.MAX_INTERVENTION_DELTA, activeEffects.reduce((sum, e) => sum + e.r0Delta, 0))
    : 0

  const mitigationTotal = literacyMitigation + factCheckMitigation + auditMitigation
  let r0 = Math.max(0, baseR0 - mitigationTotal)
  r0 += interventionR0Delta
  if (R0_NOISE_AMPLITUDE > 0) {
    r0 += (Math.random() - 0.5) * R0_NOISE_AMPLITUDE
  }
  r0 *= susceptible / total

  return Math.max(0, r0)
}
