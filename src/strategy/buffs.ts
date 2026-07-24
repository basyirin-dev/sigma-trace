import { INTERVENTIONS, type Intervention } from '@engine/interventions'
import { EFFECTIVENESS_BUFF, UPGRADED_EMERGENCY } from '@engine/tuning'

export interface ActiveBuff {
  id: string
  name: string
  description: string
}

export function resolveBuffs(caseResults: Record<string, string>): ActiveBuff[] {
  const buffs: ActiveBuff[] = []

  const case1 = caseResults['case-01']
  if (case1 === 'S' || case1 === 'A') {
    buffs.push({
      id: 'intervention-bonus',
      name: '+10% Intervention Effectiveness',
      description: 'Case 1 completed at Grade A or higher',
    })
  }

  const case3 = caseResults['case-03']
  if (case3 === 'S' || case3 === 'A') {
    buffs.push({
      id: 'emergency-unlock',
      name: 'Emergency Broadcast Unlocked',
      description: 'Case 3 completed at Grade A or higher',
    })
  }

  return buffs
}

export function getEffectivenessMultiplier(caseResults: Record<string, string>): number {
  const case1 = caseResults['case-01']
  if (case1 === 'S' || case1 === 'A') {
    return EFFECTIVENESS_BUFF.MULTIPLIER
  }
  return 1.0
}

export function getEffectiveInterventions(caseResults: Record<string, string>): Intervention[] {
  const case3 = caseResults['case-03']
  const emergencyUpgraded = case3 === 'S' || case3 === 'A'

  return INTERVENTIONS.map((inv) => {
    if (inv.id === 'emergency-broadcast' && emergencyUpgraded) {
      return {
        ...inv,
        cost: UPGRADED_EMERGENCY.cost,
        cooldown: UPGRADED_EMERGENCY.cooldown,
        effect: { r0Delta: UPGRADED_EMERGENCY.r0Delta, sigmaDelta: UPGRADED_EMERGENCY.sigmaDelta, durationTicks: UPGRADED_EMERGENCY.durationTicks },
        description: 'Super-powered city-wide alert — case 3 intelligence applied',
      }
    }
    return inv
  })
}
