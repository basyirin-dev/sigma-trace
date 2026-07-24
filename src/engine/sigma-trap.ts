import { SIGMA_TRAP } from './tuning'

export function detectSigmaTrap(sigmaHistory: number[]): boolean {
  let consecutiveLow = 0

  for (let i = sigmaHistory.length - 1; i >= 0; i--) {
    if (sigmaHistory[i]! < SIGMA_TRAP.THRESHOLD) {
      consecutiveLow++
      if (consecutiveLow >= SIGMA_TRAP.CONSECUTIVE_TICKS) return true
    } else {
      return false
    }
  }

  return false
}
