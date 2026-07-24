import { useCallback } from 'react'
import { getIntervention, getEscalatedCost } from '@engine/interventions'
import { createActiveEffect, applyTargetedMultiplier } from '@engine/active-effects'
import { useGameStore, useSimulationStore, useInterventionLogStore } from '@shared/stores'
import { getEffectivenessMultiplier } from './buffs'
import { playSfx } from '@shared/useAudioManager'
import { INTERVENTION_DEFAULTS } from '@engine/tuning'
import type { ActiveEffect } from '@engine/types'

function getSynergyMultiplier(
  interventionId: string,
  lastDeployId: string | null,
  lastDeployTick: number,
  currentTick: number,
): number {
  if (!lastDeployId || lastDeployId === interventionId) return 1.0
  if (currentTick - lastDeployTick > INTERVENTION_DEFAULTS.SYNERGY_WINDOW_TICKS) return 1.0
  return INTERVENTION_DEFAULTS.SYNERGY_MULTIPLIER
}

export function useActiveEffects() {
  const deploy = useCallback((interventionId: string, districtId?: number) => {
    playSfx('intervention-deploy')
    const intervention = getIntervention(interventionId)
    if (!intervention) return

    const gameStore = useGameStore.getState()
    const useCount = gameStore.interventionUseCounts[interventionId] ?? 0
    const escalatedCost = getEscalatedCost(intervention.cost, useCount)

    if (gameStore.budget < escalatedCost) return

    const prevDeployId = gameStore.lastDeployId
    const prevDeployTick = gameStore.lastDeployTick

    gameStore.deployIntervention(interventionId, escalatedCost)
    gameStore.setCooldown(interventionId, intervention.cooldown)

    const { tick: simTick } = useSimulationStore.getState()

    const mult = getEffectivenessMultiplier(gameStore.caseResults)
    const synergyMult = getSynergyMultiplier(
      interventionId,
      prevDeployId,
      prevDeployTick,
      simTick,
    )
    const totalMult = mult * synergyMult

    gameStore.recordDeploy(interventionId, simTick)

    const base = createActiveEffect(intervention, districtId)
    const targeted = applyTargetedMultiplier(base)
    const effect: ActiveEffect = {
      interventionId: targeted.interventionId,
      remainingTicks: targeted.remainingTicks,
      r0Delta: targeted.r0Delta * totalMult,
      sigmaDelta: targeted.sigmaDelta * totalMult,
      districtId: targeted.districtId,
    }
    useSimulationStore.getState().applyEffect(effect)

    const { tick, r0, sigma } = useSimulationStore.getState()
    useInterventionLogStore.getState().addEntry({
      interventionId,
      tick,
      r0AtDeploy: r0,
      sigmaAtDeploy: sigma,
    })
  }, [])

  return { deploy }
}
