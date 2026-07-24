import { useEffect } from 'react'
import { useGameStore, useSimulationStore, usePlaytestStore } from './stores'

export function usePlaytestLogger(): void {
  useEffect(() => {
    const unsubGame = useGameStore.subscribe((state, prev) => {
      const tick = useSimulationStore.getState().tick ?? 0

      if (state.mode !== prev.mode) {
        usePlaytestStore.getState().logEvent('mode_switch', tick, {
          from: prev.mode,
          to: state.mode,
        })
      }

      if (state.gameStatus !== prev.gameStatus) {
        usePlaytestStore.getState().logEvent('game_status', tick, {
          from: prev.gameStatus,
          to: state.gameStatus,
        })
      }

      if (state.lastDeployId !== prev.lastDeployId && state.lastDeployId !== null) {
        usePlaytestStore.getState().logEvent('deploy', tick, {
          interventionId: state.lastDeployId,
          cost: prev.budget - state.budget,
        })
      }

      if (state.activeCase !== prev.activeCase && state.activeCase !== null) {
        usePlaytestStore.getState().logEvent('case_start', tick, {
          caseId: state.activeCase,
        })
      }

      if (state.completedCases !== prev.completedCases) {
        const caseId = prev.activeCase ?? 'unknown'
        const grade = state.caseResults[caseId] ?? ''
        usePlaytestStore.getState().logEvent('case_end', tick, {
          caseId,
          grade,
          completedCases: state.completedCases,
        })
      }
    })

    return () => {
      unsubGame()
    }
  }, [])
}
