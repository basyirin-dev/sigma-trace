import { useEffect, useRef } from 'react'
import { useSimulationStore, useGameStore } from '@shared/stores'
import { useHintStore, canShowHint } from '@shared/stores/useHintStore'

export function useHintDetection(): void {
  const tick = useSimulationStore((s) => s.tick)
  const budget = useGameStore((s) => s.budget)
  const prevTick = useRef(0)
  const prevBudget = useRef(budget)

  useEffect(() => {
    if (tick === 0) return

    const sim = useSimulationStore.getState()
    const game = useGameStore.getState()

    if (tick > 10 && tick - prevTick.current > 5) {
      if (sim.phase !== 'trap' && game.appliedInterventions.length === 0 && canShowHint('no-interventions', tick)) {
        useHintStore.getState().addHint('No interventions deployed yet. Try a Fact-Check to reduce spread rate.')
      }
    }

    if (game.completedCases === 0 && tick > 30 && canShowHint('no-cases', tick)) {
      const unlocked = sim.r0 < 1.5
      if (!unlocked) {
        useHintStore.getState().addHint('Keep R₀ below 1.5 to unlock your first detective case.')
      }
    }

    if (budget < prevBudget.current && budget < 30 && canShowHint('low-budget', tick)) {
      useHintStore.getState().addHint('Budget is low. Solving detective cases awards bonus funds.')
    }

    if (sim.sigma < 40 && tick > 20 && canShowHint('sigma-low', tick)) {
      useHintStore.getState().addHint('Media Literacy (Σ) is declining. Deploy School MIL Program or Community Dialog.')
    }

    if (sim.r0 > 1.2 && sim.r0 <= 1.5 && canShowHint('r0-elevated', tick)) {
      useHintStore.getState().addHint('R₀ is rising. Fact-Check and Algorithm Audit can slow the spread.')
    }

    prevTick.current = tick
    prevBudget.current = budget
  }, [tick, budget])
}
