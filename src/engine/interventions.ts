export type InterventionCategory = 'r0-control' | 'sigma-boost' | 'dual'

export interface Intervention {
  id: string;
  name: string;
  cost: number;
  cooldown: number;
  effect: InterventionEffect;
  description: string;
  category: InterventionCategory;
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
    description: 'Professional verification teams debunk viral claims before they spread through social networks',
    category: 'r0-control',
  },
  {
    id: 'mil-school',
    name: 'School MIL Program',
    cost: 80,
    cooldown: 60,
    effect: { r0Delta: 0, sigmaDelta: 2, durationTicks: 60 },
    description: 'Curriculum-based media literacy education — teaching critical source evaluation in schools',
    category: 'sigma-boost',
  },
  {
    id: 'algorithm-audit',
    name: 'Algorithm Audit',
    cost: 120,
    cooldown: 90,
    effect: { r0Delta: -0.3, sigmaDelta: 0, durationTicks: 20 },
    description: 'Investigates and adjusts platform recommendation algorithms to reduce amplification of false content',
    category: 'r0-control',
  },
  {
    id: 'community-dialog',
    name: 'Community Dialog',
    cost: 40,
    cooldown: 45,
    effect: { r0Delta: -0.1, sigmaDelta: 1, durationTicks: 20 },
    description: 'Facilitates cross-community discussion groups that build shared understanding and resilience',
    category: 'dual',
  },
  {
    id: 'source-verify',
    name: 'Source Verification Campaign',
    cost: 60,
    cooldown: 50,
    effect: { r0Delta: -0.15, sigmaDelta: 0, durationTicks: 25 },
    description: 'Public awareness campaign teaching citizens how to verify sources and identify manipulation tactics',
    category: 'r0-control',
  },
  {
    id: 'emergency-broadcast',
    name: 'Emergency Broadcast',
    cost: 100,
    cooldown: 75,
    effect: { r0Delta: -0.4, sigmaDelta: 0, durationTicks: 10 },
    description: 'City-wide coordinated alert system that rapidly corrects viral disinformation across all platforms',
    category: 'r0-control',
  },
];

export const INTERVENTION_COLORS: Record<string, string> = {
  'fact-check': '#3498DB',
  'mil-school': '#9B59B6',
  'algorithm-audit': '#E67E22',
  'community-dialog': '#2ECC71',
  'source-verify': '#F1C40F',
  'emergency-broadcast': '#E74C3C',
}

export function getIntervention(id: string): Intervention | undefined {
  return INTERVENTIONS.find((i) => i.id === id);
}

import { INTERVENTION_DEFAULTS } from './tuning'

export function getEscalatedCost(baseCost: number, useCount: number): number {
  const penalty = 1 + useCount * INTERVENTION_DEFAULTS.COST_ESCALATION_RATE;
  return Math.round(baseCost * penalty);
}
