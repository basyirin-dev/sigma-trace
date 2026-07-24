import { useSimulationStore, useGameStore, useWarningStore } from '@shared/stores'
import { playSfx } from '@shared/useAudioManager'
import { CASE_UNLOCK } from '@engine/tuning'
import type { CaseInfo } from './CaseSelector'

export const CASE_INFO: Omit<CaseInfo, 'unlocked'>[] = [
  {
    id: 'case-01',
    title: 'The Viral Mayor',
    brief: 'A manipulated video of the mayor making inflammatory statements spreads rapidly through social media.',
    hint: 'Available from the start — investigate as your first case',
  },
  {
    id: 'case-02',
    title: "Grandma's Distress Call",
    brief: 'Residents receive calls with AI-cloned voices of loved ones in distress, demanding urgent payments.',
    hint: `Maintain σ-coherence above ${CASE_UNLOCK.CASE2_SIGMA} to unlock this case`,
  },
  {
    id: 'case-03',
    title: 'The Front Page',
    brief: 'A manipulated photo of police clashing with protesters goes viral. Claims it shows Veritas — but the city hasn\'t seen a protest all week.',
    hint: `Survive ${CASE_UNLOCK.CASE3_TICK} ticks with R₀ below ${CASE_UNLOCK.CASE3_R0} to unlock this case`,
  },
]

let lastUnlockNotification = ''

export function checkUnlocks(): void {
  const sim = useSimulationStore.getState()
  const game = useGameStore.getState()
  const warn = useWarningStore.getState().addWarning

  if (!game.case2Unlocked && sim.sigma >= CASE_UNLOCK.CASE2_SIGMA) {
    useGameStore.getState().unlockCase2()
    playSfx('evidence-found')
    const msg = 'Case 2: Grandma\u2019s Distress Call unlocked!'
    if (lastUnlockNotification !== msg) {
      warn(msg)
      lastUnlockNotification = msg
    }
  }

  if (!game.case3Unlocked && sim.tick >= CASE_UNLOCK.CASE3_TICK && sim.r0 < CASE_UNLOCK.CASE3_R0) {
    useGameStore.getState().unlockCase3()
    playSfx('evidence-found')
    const msg = 'Case 3: The Front Page unlocked!'
    if (lastUnlockNotification !== msg) {
      warn(msg)
      lastUnlockNotification = msg
    }
  }
}

export function resetUnlockNotification(): void {
  lastUnlockNotification = ''
}

export function getCaseUnlocks(): CaseInfo[] {
  const game = useGameStore.getState()

  return CASE_INFO.map((info) => {
    let unlocked = false
    if (info.id === 'case-01') unlocked = true
    else if (info.id === 'case-02') unlocked = game.case2Unlocked
    else if (info.id === 'case-03') unlocked = game.case3Unlocked

    return { ...info, unlocked }
  })
}
