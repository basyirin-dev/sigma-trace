import type { Phase } from '@engine/types'

export interface GameStore {
  strategy: StrategyState
  detective: DetectiveState
  meta: MetaState
}

export interface StrategyState {
  sigma: number
  r0: number
  budget: number
  time: number
  phase: Phase
}

export interface DetectiveState {
  currentCase: string | null
  progress: string
}

export interface MetaState {
  mode: 'strategy' | 'detective' | 'transition'
  gameStatus: 'playing' | 'won' | 'lost'
}
