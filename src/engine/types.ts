export interface PopulationState {
  susceptible: number
  exposed: number
  infected: number
  recovered: number
  total: number
}

export interface District {
  id: string
  name: string
  population: PopulationState
  baseR0: number
  vulnerability: number
  literacyFactor: number
  internetAccessFactor: number
}

export type Phase = 'calm' | 'outbreak' | 'crisis' | 'trap'

export interface ActiveEffect {
  interventionId: string
  remainingTicks: number
  r0Delta: number
  sigmaDelta: number
  districtId?: number
}

export type Verdict = 'real' | 'manipulated' | 'uncertain'

export interface SimulationConfig {
  baseR0: number
  literacyRate: number
  factCheckCoverage: number
  algorithmAuditActive: boolean
  recoveryRate: number
  incubationRate: number
}

export interface SimulationSnapshot {
  state: PopulationState
  r0: number
  sigma: number
  phase: Phase
  time: number
  interventions: ActiveEffect[]
}
