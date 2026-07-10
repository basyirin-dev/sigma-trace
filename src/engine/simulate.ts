import type { CityPopulation, Phase, ActiveEffect } from './types';

export interface SimulationParams {
  population: CityPopulation;
  sigma: number;
  r0: number;
  activeEffects: ActiveEffect[];
  time: number;
}

export interface SimulationResult {
  population: CityPopulation;
  sigma: number;
  r0: number;
  phase: Phase;
}

export function simulateTick(params: SimulationParams): SimulationResult {
  const { population, sigma, r0, activeEffects } = params;
  const { S, E, I, R, N } = population;
  const gamma = 0.1;
  const kappa = 0.15;
  const beta = r0 * gamma;

  const deltaS = (-beta * S * I) / N;
  const deltaE = (beta * S * I) / N - kappa * E;
  const deltaI = kappa * E - gamma * I;
  const deltaR = gamma * I;

  const totalEffect = activeEffects.reduce((sum, e) => sum + e.remainingTicks * 0.01, 0);
  const nextSigma = Math.max(0, Math.min(100, sigma + totalEffect - 0.5 * (I / N) * (100 - sigma)));
  const nextR0 = Math.max(0, r0 - totalEffect * 0.1);

  let phase: Phase = 'calm';
  if (nextSigma < 20) phase = 'trap';
  else if (nextR0 > 1.0) phase = 'outbreak';

  return {
    population: {
      S: Math.max(0, S + deltaS),
      E: Math.max(0, E + deltaE),
      I: Math.max(0, I + deltaI),
      R: Math.min(N, R + deltaR),
      N,
    },
    sigma: nextSigma,
    r0: nextR0,
    phase,
  };
}
