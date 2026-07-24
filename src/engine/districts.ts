import type { District, SimulationConfig, PopulationState } from './types'
import { INITIAL_EXPOSED_FRACTION, INITIAL_INFECTED_FRACTION } from './constants'

function makePopulation(total: number): PopulationState {
  return {
    susceptible: total - Math.round(total * (INITIAL_EXPOSED_FRACTION + INITIAL_INFECTED_FRACTION)),
    exposed: Math.round(total * INITIAL_EXPOSED_FRACTION),
    infected: Math.round(total * INITIAL_INFECTED_FRACTION),
    recovered: 0,
    total,
  }
}

export const DISTRICTS: District[] = [
  {
    id: 'foundry',
    name: 'Foundry',
    population: makePopulation(100_000),
    baseR0: 0.8,
    vulnerability: 0.7,
    literacyFactor: 0.25,
    internetAccessFactor: 0.45,
  },
  {
    id: 'harborview',
    name: 'Harborview',
    population: makePopulation(130_000),
    baseR0: 0.5,
    vulnerability: 0.8,
    literacyFactor: 0.35,
    internetAccessFactor: 0.35,
  },
  {
    id: 'uptown',
    name: 'Uptown',
    population: makePopulation(120_000),
    baseR0: 0.4,
    vulnerability: 0.6,
    literacyFactor: 0.85,
    internetAccessFactor: 0.95,
  },
  {
    id: 'campus',
    name: 'Campus',
    population: makePopulation(130_000),
    baseR0: 0.7,
    vulnerability: 0.65,
    literacyFactor: 0.90,
    internetAccessFactor: 0.98,
  },
]

export function getDistrict(id: string): District | undefined {
  return DISTRICTS.find((d) => d.id === id)
}

export function computeDistrictEffectiveR0(
  district: District,
  cityR0: number,
  config: SimulationConfig,
): number {
  const literacyMitigation = district.literacyFactor * 0.3
  const internetMitigation = district.internetAccessFactor * 0.15
  const auditMitigation = config.algorithmAuditActive ? 0.2 : 0
  const baseEffective = district.baseR0 + cityR0 * 0.5
  const vulnerabilityMultiplier = 1 + (district.vulnerability - 0.5) * 0.5
  const effectiveR0 = (baseEffective - literacyMitigation - internetMitigation - auditMitigation) * vulnerabilityMultiplier
  return Math.max(0, effectiveR0)
}
