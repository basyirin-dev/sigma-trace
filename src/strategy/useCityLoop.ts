import { useEffect, useRef } from 'react';
import {
  createAgent,
  updateAgents,
  recolorByPopulation,
  createParticles,
  updateParticles,
} from './renderers';
import type { Agent, Particle } from './renderers';
import { createDistrictTiles } from './renderers';
import type { Tile } from './renderers';
import { classifyPhase } from '@engine/phase-classifier';
import { DISTRICTS, computeDistrictEffectiveR0 } from '@engine/districts';
import type { Phase, ActiveEffect, SimulationConfig } from '@engine/types';
import { useSimulationStore } from '@shared/stores';

export interface DistrictState {
  sigma: number;
  r0: number;
}

export interface CityState {
  tiles: Tile[][];
  agents: Agent[];
  particles: Particle[];
  sigma: number;
  r0: number;
  smoothSigma: number;
  smoothR0: number;
  tick: number;
  phase: Phase;
  districtState: Record<string, DistrictState>;
  activeEffects: ActiveEffect[];
}

export interface CityLoopCallbacks {
  onRender: (ctx: CanvasRenderingContext2D, state: CityState) => void;
  onTick?: (state: CityState) => CityState;
  onPhaseChange?: (phase: Phase) => void;
}

export function buildDistrictState(
  sigma: number,
  r0: number,
  config?: SimulationConfig,
): Record<string, DistrictState> {
  const state: Record<string, DistrictState> = {};
  for (const district of DISTRICTS) {
    const districtR0 = config ? computeDistrictEffectiveR0(district, r0, config) : r0;
    const literacyBoost = 0.6 + district.literacyFactor * 0.4 + district.internetAccessFactor * 0.2;
    const districtSigma = Math.min(100, Math.max(0, sigma * literacyBoost));
    state[district.id] = { sigma: districtSigma, r0: Math.max(0, districtR0) };
  }
  return state;
}

export function useCityLoop(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  callbacks: CityLoopCallbacks,
) {
  const simInitial = useSimulationStore.getState();
  const stateRef = useRef<CityState>({
    tiles: createDistrictTiles(createDefaultDistrictMap()),
    agents: createDefaultAgents(),
    particles: createParticles(50),
    sigma: simInitial.sigma,
    r0: simInitial.r0,
    smoothSigma: simInitial.sigma,
    smoothR0: simInitial.r0,
    tick: simInitial.tick,
    phase: simInitial.phase,
    districtState: buildDistrictState(simInitial.sigma, simInitial.r0),
    activeEffects: simInitial.activeEffects,
  });
  const animFrameRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const lastInfectedRef = useRef<number>(simInitial.population.infected);
  const runningRef = useRef(true);
  const callbacksRef = useRef(callbacks);
  const renderSkippedRef = useRef(false);

  useEffect(() => {
    callbacksRef.current = callbacks;
  });

  useEffect(() => {
    runningRef.current = true;
    lastTickRef.current = performance.now();

    function loop(time: number) {
      if (!runningRef.current) return;

      const state = stateRef.current;
      const cb = callbacksRef.current;
      const simState = useSimulationStore.getState();
      const tickInterval = 1000 / simState.speed;

      if (time - lastTickRef.current >= tickInterval) {
        if (simState.isRunning) {
          lastTickRef.current = time;

          if (cb.onTick) {
            const next = cb.onTick(state);
            if (next) {
              stateRef.current = next;
              if (next.phase !== state.phase) {
                cb.onPhaseChange?.(next.phase);
              }
            }
          } else {
            const newPhase = classifyPhase(state.sigma, state.r0);
            if (newPhase !== state.phase) {
              state.phase = newPhase as Phase;
              cb.onPhaseChange?.(newPhase as Phase);
            }
          }

          const prevInfected = lastInfectedRef.current;
          const infectedDelta = simState.population.infected - prevInfected;
          lastInfectedRef.current = simState.population.infected;
          recolorByPopulation(stateRef.current.agents, simState.population);
          updateAgents(stateRef.current.agents, 1, stateRef.current.particles, infectedDelta);
        } else {
          lastTickRef.current = time;
        }
      }

      if (!simState.isRunning && renderSkippedRef.current) {
        // When paused and already rendered, skip particle updates and re-render.
        // Only continue the rAF loop so we can detect unpause.
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }
      renderSkippedRef.current = !simState.isRunning;

      const lerpFactor = 0.05;
      state.smoothSigma += (state.sigma - state.smoothSigma) * lerpFactor;
      state.smoothR0 += (state.r0 - state.smoothR0) * lerpFactor;

      if (simState.isRunning) {
        updateParticles(state.particles, 1);
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          cb.onRender(ctx, stateRef.current);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    }

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [canvasRef]);
}

function createDefaultDistrictMap(): number[][] {
  const map: number[][] = [];
  for (let row = 0; row < 50; row++) {
    const mapRow: number[] = [];
    for (let col = 0; col < 50; col++) {
      if (col < 25 && row < 25) mapRow.push(0);
      else if (col >= 25 && row < 25) mapRow.push(1);
      else if (col < 25 && row >= 25) mapRow.push(2);
      else mapRow.push(3);
    }
    map.push(mapRow);
  }
  return map;
}

function createDefaultAgents(): Agent[] {
  let seed = 42;
  function rand(): number {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  }
  const agents: Agent[] = [];
  for (let i = 0; i < 80; i++) {
    const col = Math.floor(rand() * 50);
    const row = Math.floor(rand() * 50);
    const states = ['S', 'S', 'S', 'S', 'E', 'I'] as const;
    const stateKey = states[Math.floor(rand() * states.length)];
    agents.push(createAgent(col, row, stateKey ?? 'S'));
  }
  return agents;
}
