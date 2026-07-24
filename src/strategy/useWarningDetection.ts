import { useEffect, useRef } from 'react'
import { useSimulationStore, useWarningStore } from '@shared/stores'
import { TRAP_SIGMA_THRESHOLD } from '@engine/constants'
import { WARNINGS } from '@engine/tuning'
import type { Phase } from '@engine/types'

const NARRATIVE_MESSAGES: Record<string, string> = {
  'r0-1.0': 'A manipulated media piece has breached public skepticism thresholds.',
  'r0-1.5': 'The disinformation network is coordinating — multiple vectors converging on the most vulnerable districts.',
  'sigma-trap': 'City coherence has collapsed. Citizens can no longer agree on basic facts.',
  'sigma-rapid-drop': 'A single piece of viral content is overwhelming the city\'s information defenses.',
  'crisis': 'Emergency protocols engaged. The Shadow Collective operation is reaching critical mass.',
}

export function useWarningDetection(): void {
  const tick = useSimulationStore((s) => s.tick)
  const prevR0 = useRef<number | null>(null)
  const prevSigma = useRef<number | null>(null)
  const prevPhase = useRef<Phase>('calm')
  const lastWarningTick = useRef<Record<string, number>>({})

  useEffect(() => {
    function canWarn(key: string): boolean {
      const last = lastWarningTick.current[key]
      if (last !== undefined && tick - last < WARNINGS.COOLDOWN_TICKS) return false
      lastWarningTick.current[key] = tick
      return true
    }

    function addNarrative(key: string): void {
      const msg = NARRATIVE_MESSAGES[key]
      if (msg && canWarn(`narrative-${key}`)) {
        useWarningStore.getState().addWarning(msg)
      }
    }

    const { r0, sigma, phase } = useSimulationStore.getState()

    if (prevR0.current !== null) {
      if (r0 > WARNINGS.R0_OUTBREAK && prevR0.current <= WARNINGS.R0_OUTBREAK && canWarn('r0-1.0')) {
        useWarningStore.getState().addWarning('Outbreak detected')
        addNarrative('r0-1.0')
      }
      if (r0 > WARNINGS.R0_CRITICAL && prevR0.current <= WARNINGS.R0_CRITICAL && canWarn('r0-1.5')) {
        useWarningStore.getState().addWarning('R0 critical — deploy interventions')
        addNarrative('r0-1.5')
      }
    }

    if (prevSigma.current !== null) {
      if (sigma < TRAP_SIGMA_THRESHOLD && prevSigma.current >= TRAP_SIGMA_THRESHOLD && canWarn('sigma-trap')) {
        useWarningStore.getState().addWarning('Critical coherence loss')
        addNarrative('sigma-trap')
      }
      const sigmaDrop = prevSigma.current - sigma
      if (sigmaDrop > WARNINGS.SIGMA_DROP_THRESHOLD && canWarn('sigma-rapid-drop')) {
        useWarningStore.getState().addWarning('Sigma declining rapidly')
        addNarrative('sigma-rapid-drop')
      }
    }

    if (prevPhase.current !== 'crisis' && phase === 'crisis' && canWarn('crisis')) {
      useWarningStore.getState().addWarning('Crisis phase — emergency interventions needed')
      addNarrative('crisis')
    }

    prevR0.current = r0
    prevSigma.current = sigma
    prevPhase.current = phase
  }, [tick])

  useEffect(() => {
    return () => {
      useWarningStore.getState().clearAll()
    }
  }, [])
}
