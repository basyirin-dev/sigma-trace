import type { Phase } from './types';

export interface TrapStatus {
  isInTrap: boolean;
  phase: Phase;
  timeToCritical: number;
}

const CRITICAL_THRESHOLD = 30;
const TRAP_THRESHOLD = 20;

export function classifySigmaTrap(
  sigma: number,
  r0: number,
  _timeAboveThreshold: number,
): TrapStatus {
  if (sigma < TRAP_THRESHOLD) {
    return { isInTrap: true, phase: 'trap', timeToCritical: 0 };
  }
  if (sigma < CRITICAL_THRESHOLD) {
    return { isInTrap: false, phase: 'outbreak', timeToCritical: sigma - TRAP_THRESHOLD };
  }
  if (r0 > 1.0) {
    return { isInTrap: false, phase: 'outbreak', timeToCritical: sigma - TRAP_THRESHOLD };
  }
  return { isInTrap: false, phase: 'calm', timeToCritical: sigma - TRAP_THRESHOLD };
}
