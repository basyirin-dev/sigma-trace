export interface CityPopulation {
  S: number
  E: number
  I: number
  R: number
  N: number
}

export interface District {
  id: string
  name: string
  vulnerability: number
  sigma: number
  r0: number
}

export type Phase = 'calm' | 'outbreak' | 'trap'

export interface ActiveEffect {
  interventionId: string
  remainingTicks: number
}

export type Verdict = 'real' | 'manipulated' | 'uncertain'
