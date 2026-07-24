export const SIGMA_BOUNDS = { MIN: 0, MAX: 100 } as const
export const R0_BOUNDS = { MIN: 0, MAX: 5.0 } as const

export const POPULATION_INITIAL: {
  susceptible: number
  exposed: number
  infected: number
  recovered: number
  total: number
} = {
  susceptible: 494500,
  exposed: 2000,
  infected: 500,
  recovered: 3000,
  total: 500000,
}

export const POPULATION_FRACTIONS = {
  INITIAL_EXPOSED: 0.0001,
  INITIAL_INFECTED: 0.0001,
} as const

export const STARTING_STATE: {
  sigma: number
  r0: number
  budget: number
} = {
  sigma: 78,
  r0: 0.6,
  budget: 300,
}

export const ODE_PARAMS = {
  RECOVERY_RATE: 0.10,
  INCUBATION_RATE: 0.15,
  SIGMA_DECAY_COEFFICIENT: 2.0,
  BASE_R0: 2.5,
} as const

export const SIGMA_DYNAMICS = {
  GROWTH_RATE: 0.15,
  DECAY_PER_INFECTED: 0.03,
  MAX_INTERVENTION_DELTA: 5,
} as const

export const R0_MITIGATION = {
  LITERACY_FACTOR: 0.3,
  FACTCHECK_FACTOR: 0.4,
  AUDIT_FACTOR: 0.3,
  NOISE_AMPLITUDE: 0.02,
  MAX_INTERVENTION_DELTA: 1.5,
} as const

export const PHASE_THRESHOLDS = {
  TRAP_SIGMA: 20,
  CRISIS_SIGMA: 40,
  CRISIS_R0: 1.5,
  OUTBREAK_SIGMA: 60,
  OUTBREAK_R0: 0.8,
  CALM_SIGMA: 60,
  CALM_R0: 0.8,
} as const

export const SIGMA_TRAP = {
  THRESHOLD: 10,
  CONSECUTIVE_TICKS: 5,
} as const

export const WIN_CONDITIONS = {
  SIGMA_THRESHOLD: 70,
  R0_THRESHOLD: 1.2,
  REQUIRED_CASES: 3,
  STABLE_TICKS: 30,
} as const

export const LOSS_CONDITIONS = {
  CITY_R0_THRESHOLD: 2.0,
  CITY_R0_TICKS: 40,
  DISTRICT_R0_THRESHOLD: 2.0,
  DISTRICT_R0_TICKS: 40,
  MAX_FAILED_CASES: 4,
} as const

export const INCOME = {
  BASE: 1.0,
  SCALE: 5.0,
} as const

export const DIFFICULTY_RAMP = {
  ACT1_TICKS: [1, 40] as const,
  ACT1_R0_RANGE: [0.8, 1.2] as const,
  ACT2_TICKS: [41, 80] as const,
  ACT2_R0_RANGE: [1.2, 1.7] as const,
  ACT3_TICKS: [81, 120] as const,
  ACT3_R0_RANGE: [1.7, 2.15] as const,
  ENDGAME_TICK: 121,
  ENDGAME_R0: 2.15,
} as const

export function getRampBaseR0(tick: number): number {
  if (tick < 1) return STARTING_STATE.r0

  const [a1Start, a1End] = DIFFICULTY_RAMP.ACT1_TICKS
  const [a1Lo, a1Hi] = DIFFICULTY_RAMP.ACT1_R0_RANGE
  if (tick <= a1End) {
    const progress = (tick - a1Start) / (a1End - a1Start)
    return a1Lo + (a1Hi - a1Lo) * progress
  }

  const [a2Start, a2End] = DIFFICULTY_RAMP.ACT2_TICKS
  const [a2Lo, a2Hi] = DIFFICULTY_RAMP.ACT2_R0_RANGE
  if (tick <= a2End) {
    const progress = (tick - a2Start) / (a2End - a2Start)
    return a2Lo + (a2Hi - a2Lo) * progress
  }

  const [a3Start, a3End] = DIFFICULTY_RAMP.ACT3_TICKS
  const [a3Lo, a3Hi] = DIFFICULTY_RAMP.ACT3_R0_RANGE
  if (tick <= a3End) {
    const progress = (tick - a3Start) / (a3End - a3Start)
    return a3Lo + (a3Hi - a3Lo) * progress
  }

  return DIFFICULTY_RAMP.ENDGAME_R0
}

export const INTERVENTION_DEFAULTS = {
  COST_ESCALATION_RATE: 0.2,
  SYNERGY_MULTIPLIER: 1.3,
  SYNERGY_WINDOW_TICKS: 3,
  TARGETED_DISTRICT_MULTIPLIER: 1.5,
} as const

export const EFFECTIVENESS_BUFF = {
  MULTIPLIER: 1.1,
} as const

export const CASE_BUDGET_BONUSES = {
  CASE1_BONUS: 50,
  CASE2_BONUS: 50,
  CASE_R0_REDUCTION: 0.4, // Sim approximation; real values per case in metadata.json (case-01:-0.3, case-02:-0.4, case-03:-0.5, total -1.2)
  CASE_SIGMA_BOOST: 5,
} as const

export const UPGRADED_EMERGENCY = {
  cost: 300,
  cooldown: 60,
  r0Delta: -0.6,
  sigmaDelta: 0,
  durationTicks: 15,
} as const

export const CASE_UNLOCK = {
  CASE2_SIGMA: 40,
  CASE3_TICK: 80,
  CASE3_R0: 1.5,
} as const

export const DETECTIVE_SCORING = {
  COMPONENT_MAX: {
    accuracy: 50,
    correctTools: 10,
    toolEfficiency: 10,
    connections: 15,
    justification: 10,
    timeBonus: 5,
  } as Record<string, number>,
  JUSTIFICATION_MIN_LENGTH: 50,
  GRADE_THRESHOLDS: [
    { grade: 'S', minScore: 80 },
    { grade: 'A', minScore: 70 },
    { grade: 'B', minScore: 55 },
    { grade: 'C', minScore: 40 },
  ] as const,
  GRADE_BUDGET: { S: 100, A: 75, B: 50, C: 25, F: 0 } as Record<string, number>,
  TIME_BONUS_FAST_MS: 180_000,
  TIME_BONUS_SLOW_MS: 300_000,
} as const

export const DETECTIVE_OUTCOME = {
  SUCCESS_THRESHOLD: 80,
  PARTIAL_THRESHOLD: 50,
} as const

export const CASE_DIFFICULTY = {
  EASY: {
    CONNECTION_MULTIPLIER: 0.7,
    EFFICIENCY_PENALTY: 3,
    TIME_FAST_MS: 240_000,
    TIME_SLOW_MS: 360_000,
  },
  NORMAL: {
    CONNECTION_MULTIPLIER: 1.0,
    EFFICIENCY_PENALTY: 5,
    TIME_FAST_MS: 180_000,
    TIME_SLOW_MS: 300_000,
  },
  HARD: {
    CONNECTION_MULTIPLIER: 1.3,
    EFFICIENCY_PENALTY: 6,
    TIME_FAST_MS: 120_000,
    TIME_SLOW_MS: 240_000,
  },
} as const

export const WARNINGS = {
  R0_OUTBREAK: 1.0,
  R0_CRITICAL: 1.5,
  SIGMA_DROP_THRESHOLD: 5,
  COOLDOWN_TICKS: 3,
} as const
