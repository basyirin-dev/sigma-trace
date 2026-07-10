import type { District, Phase, ActiveEffect } from '@engine/types';
import type { Intervention } from '@engine/interventions';

export interface StrategyState {
  sigma: number;
  r0: number;
  budget: number;
  time: number;
  phase: Phase;
  districts: District[];
  activeEffects: ActiveEffect[];
  interventions: Intervention[];
}

export const initialStrategyState: StrategyState = {
  sigma: 78,
  r0: 0.6,
  budget: 500,
  time: 0,
  phase: 'calm',
  districts: [],
  activeEffects: [],
  interventions: [],
};
