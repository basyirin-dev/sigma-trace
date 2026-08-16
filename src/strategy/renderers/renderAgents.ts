import { TILE_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, DISTRICT_QUADRANTS } from './renderGrid';
import type { PopulationState } from '@engine/types';
import type { Particle } from './renderParticles';

export interface Agent {
  x: number;
  y: number;
  stateColor: string;
  targetX: number;
  targetY: number;
  speed: number;
  threshold: number;
  homeDistrict: number;
  compartment: 'S' | 'E' | 'I' | 'R';
}

const AGENT_SIZE = 4;
const OUTLINE_COLOR = '#1a1a2e';
const STATE_COLORS: Record<string, string> = {
  S: '#2ECC71',
  E: '#F1C40F',
  I: '#E74C3C',
  R: '#3498DB',
};

const STATE_LABELS = ['S', 'E', 'I', 'R'] as const;

let seed = 42;
function seededRand(): number {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
}

function getDistrictForColRow(col: number, row: number): number {
  if (col < 25 && row < 25) return 0;
  if (col >= 25 && row < 25) return 1;
  if (col < 25 && row >= 25) return 2;
  return 3;
}

let hotspotCenter: { x: number; y: number } | null = null;

export function setHotspotCenter(center: { x: number; y: number } | null): void {
  hotspotCenter = center;
}

export function createAgent(col: number, row: number, state: string): Agent {
  const cx = col * TILE_SIZE + TILE_SIZE / 2;
  const cy = row * TILE_SIZE + TILE_SIZE / 2;
  const offsetX = (seededRand() - 0.5) * TILE_SIZE * 0.6;
  const offsetY = (seededRand() - 0.5) * TILE_SIZE * 0.6;
  return {
    x: cx + offsetX,
    y: cy + offsetY,
    stateColor: STATE_COLORS[state] ?? '#888',
    targetX: cx + (seededRand() - 0.5) * TILE_SIZE * 0.6,
    targetY: cy + (seededRand() - 0.5) * TILE_SIZE * 0.6,
    speed: 0.3 + seededRand() * 0.4,
    threshold: seededRand(),
    homeDistrict: getDistrictForColRow(col, row),
    compartment: 'S',
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function updateAgents(
  agents: Agent[],
  dt: number,
  burstParticles?: Particle[],
  infectedDelta?: number,
): void {
  for (const agent of agents) {
    const dx = agent.targetX - agent.x;
    const dy = agent.targetY - agent.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const speedMult =
      agent.compartment === 'I'
        ? 1.5
        : agent.compartment === 'E'
          ? 1.2
          : agent.compartment === 'R'
            ? 0.7
            : 1.0;

    if (dist < 1) {
      let newX: number;
      let newY: number;

      const affinityChance =
        agent.compartment === 'I' ? 0.4 : agent.compartment === 'R' ? 0.9 : 0.7;
      const useAffinity = Math.random() < affinityChance && agent.homeDistrict >= 0;

      if (agent.compartment === 'I' && Math.random() < 0.5) {
        const quad = DISTRICT_QUADRANTS[agent.homeDistrict];
        if (quad) {
          const midX = ((quad.colStart + quad.colEnd) / 2) * TILE_SIZE;
          const midY = ((quad.rowStart + quad.rowEnd) / 2) * TILE_SIZE;
          newX = agent.x - (midX - agent.x) * 0.5 + (Math.random() - 0.5) * 40;
          newY = agent.y - (midY - agent.y) * 0.5 + (Math.random() - 0.5) * 40;
        } else {
          newX = agent.x + (Math.random() - 0.5) * 40;
          newY = agent.y + (Math.random() - 0.5) * 40;
        }
      } else if (useAffinity) {
        const quad = DISTRICT_QUADRANTS[agent.homeDistrict];
        if (quad) {
          const minCol = quad.colStart * TILE_SIZE;
          const maxCol = quad.colEnd * TILE_SIZE;
          const minRow = quad.rowStart * TILE_SIZE;
          const maxRow = quad.rowEnd * TILE_SIZE;
          newX = minCol + Math.random() * (maxCol - minCol);
          newY = minRow + Math.random() * (maxRow - minRow);
        } else {
          newX = agent.x + (Math.random() - 0.5) * 40;
          newY = agent.y + (Math.random() - 0.5) * 40;
        }
      } else {
        newX = agent.x + (Math.random() - 0.5) * 40;
        newY = agent.y + (Math.random() - 0.5) * 40;
      }

      if (agent.compartment === 'S') {
        for (const other of agents) {
          if (other === agent || other.compartment !== 'I') continue;
          const repDx = agent.x - other.x;
          const repDy = agent.y - other.y;
          const repDist = Math.sqrt(repDx * repDx + repDy * repDy);
          if (repDist < 30 && repDist > 0) {
            const repel = 20 / repDist;
            newX += repDx * repel;
            newY += repDy * repel;
          }
        }
      }

      if (hotspotCenter && Math.random() < 0.5) {
        newX += (hotspotCenter.x - newX) * 0.3;
        newY += (hotspotCenter.y - newY) * 0.3;
      }

      agent.targetX = clamp(newX, 0, CANVAS_WIDTH);
      agent.targetY = clamp(newY, 0, CANVAS_HEIGHT);
    } else {
      const step = agent.speed * dt * 60 * speedMult;
      agent.x += (dx / dist) * step;
      agent.y += (dy / dist) * step;
    }
  }

  if (burstParticles && infectedDelta !== undefined && infectedDelta > 0) {
    const infectedAgents = agents.filter((a) => a.compartment === 'I');
    const burstCount = Math.min(6, Math.round(infectedDelta * 200));
    for (let i = 0; i < burstCount && infectedAgents.length > 0; i++) {
      const source = infectedAgents[Math.floor(Math.random() * infectedAgents.length)];
      if (source) {
        burstParticles.push({
          x: source.x,
          y: source.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: 3,
          color: 'rgba(231, 76, 60, 0.7)',
        });
      }
    }
  }
  agentsNeedSort = true;
}

export function recolorByPopulation(agents: Agent[], population: PopulationState): void {
  const weights = [
    population.susceptible / population.total,
    population.exposed / population.total,
    population.infected / population.total,
    population.recovered / population.total,
  ];

  for (const agent of agents) {
    const r = agent.threshold;
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i]!;
      if (r < cumulative) {
        const compartment = STATE_LABELS[i]!;
        agent.stateColor = STATE_COLORS[compartment] ?? '#888';
        agent.compartment = compartment;
        break;
      }
    }
  }
}

function drawPixelAgent(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  size: number,
  blinkOn: boolean,
): void {
  const px = Math.round(x - size / 2);
  const py = Math.round(y - size / 2);

  ctx.fillStyle = OUTLINE_COLOR;
  ctx.fillRect(px - 1, py - 1, size + 2, size + 2);

  ctx.fillStyle = blinkOn ? color : shadeColor(color, -30);
  ctx.fillRect(px, py, size, size);

  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(px, py, size, 1);

  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(px, py + size - 1, size, 1);
}

function shadeColor(color: string, amount: number): string {
  let hex = color.replace('#', '');
  if (hex.length === 3) {
    const a = hex[0] ?? '0';
    const b = hex[1] ?? '0';
    const c = hex[2] ?? '0';
    hex = a + a + b + b + c + c;
  }
  const num = parseInt(hex, 16);
  const r = clamp(((num >> 16) & 0xff) + amount, 0, 255);
  const g = clamp(((num >> 8) & 0xff) + amount, 0, 255);
  const b = clamp((num & 0xff) + amount, 0, 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

let agentsNeedSort = true;

export function markAgentsDirty(): void {
  agentsNeedSort = true;
}

export function renderAgents(ctx: CanvasRenderingContext2D, agents: Agent[]): void {
  let sorted: Agent[];
  if (agentsNeedSort) {
    sorted = [...agents].sort((a, b) => a.y - b.y);
    agentsNeedSort = false;
  } else {
    sorted = agents;
  }
  const now = performance.now();
  const blinkPhase = Math.floor(now / 400) % 2 === 0;

  for (const agent of sorted) {
    const isInfected = agent.compartment === 'I';
    const blinkOn = isInfected ? blinkPhase : true;
    drawPixelAgent(ctx, agent.x, agent.y, agent.stateColor, AGENT_SIZE, blinkOn);
  }
}
