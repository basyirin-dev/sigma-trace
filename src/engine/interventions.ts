export interface Intervention {
  id: string;
  name: string;
  cost: number;
  cooldown: number;
  effect: InterventionEffect;
  description: string;
}

export interface InterventionEffect {
  r0Delta: number;
  sigmaDelta: number;
  durationTicks: number;
}

export const INTERVENTIONS: Intervention[] = [
  {
    id: 'fact-check',
    name: 'Fact-Check Bureau',
    cost: 50,
    cooldown: 30,
    effect: { r0Delta: -0.2, sigmaDelta: 0, durationTicks: 15 },
    description: 'Deploys professional fact-checkers',
  },
  {
    id: 'mil-school',
    name: 'School MIL Program',
    cost: 80,
    cooldown: 60,
    effect: { r0Delta: 0, sigmaDelta: 2, durationTicks: 60 },
    description: 'Funds media literacy education in schools',
  },
  {
    id: 'algorithm-audit',
    name: 'Algorithm Audit',
    cost: 120,
    cooldown: 90,
    effect: { r0Delta: -0.3, sigmaDelta: 0, durationTicks: 20 },
    description: 'Investigates and adjusts platform algorithms',
  },
  {
    id: 'community-dialog',
    name: 'Community Dialog',
    cost: 40,
    cooldown: 45,
    effect: { r0Delta: -0.1, sigmaDelta: 1, durationTicks: 20 },
    description: 'Funds community discussion groups',
  },
  {
    id: 'source-verify',
    name: 'Source Verification Campaign',
    cost: 60,
    cooldown: 50,
    effect: { r0Delta: -0.15, sigmaDelta: 0, durationTicks: 25 },
    description: 'Public campaign teaching source-checking',
  },
  {
    id: 'emergency-broadcast',
    name: 'Emergency Broadcast',
    cost: 100,
    cooldown: 75,
    effect: { r0Delta: -0.4, sigmaDelta: 0, durationTicks: 10 },
    description: 'City-wide fact-correcting alert',
  },
];

export function getIntervention(id: string): Intervention | undefined {
  return INTERVENTIONS.find((i) => i.id === id);
}
