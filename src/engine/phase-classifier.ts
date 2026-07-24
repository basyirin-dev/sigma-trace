import type { Phase } from './types'
import { TRAP_SIGMA_THRESHOLD, CRISIS_SIGMA_THRESHOLD, CRISIS_R0_THRESHOLD, OUTBREAK_SIGMA_THRESHOLD, OUTBREAK_R0_THRESHOLD } from './constants'

export function classifyPhase(sigma: number, r0: number): Phase {
  if (sigma < TRAP_SIGMA_THRESHOLD) return 'trap'
  if (sigma < CRISIS_SIGMA_THRESHOLD && r0 >= CRISIS_R0_THRESHOLD) return 'crisis'
  if (sigma < OUTBREAK_SIGMA_THRESHOLD || r0 >= OUTBREAK_R0_THRESHOLD) return 'outbreak'
  return 'calm'
}
