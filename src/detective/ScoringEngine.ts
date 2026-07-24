import type { CaseMeta } from './CaseLoader'
import type { Verdict } from '@engine/types'
import { DETECTIVE_SCORING, CASE_DIFFICULTY } from '@engine/tuning'

export interface PlayerActions {
  verdict: Verdict
  justification: string
  usedTools: string[]
  usedToolEvidencePairs: [string, string][]
  evidenceConnections: [string, string][]
}

export const COMPONENT_MAX: Record<string, number> = { ...DETECTIVE_SCORING.COMPONENT_MAX }

export interface ScoreComponents {
  accuracy: number
  correctTools: number
  toolEfficiency: number
  connections: number
  justification: number
  timeBonus: number
}

export interface Score {
  total: number
  components: ScoreComponents
  maxScore: number
  grade: 'S' | 'A' | 'B' | 'C' | 'F'
}

export const GRADE_BUDGET: Record<string, number> = { ...DETECTIVE_SCORING.GRADE_BUDGET }

function computeGrade(total: number): Score['grade'] {
  for (const t of DETECTIVE_SCORING.GRADE_THRESHOLDS) {
    if (total >= t.minScore) return t.grade as Score['grade']
  }
  return 'F'
}

function toSetKey(a: string, b: string): string {
  return [a, b].sort().join('::')
}

function getDifficultyConfig(difficulty: string) {
  if (difficulty === 'easy') return CASE_DIFFICULTY.EASY
  if (difficulty === 'hard') return CASE_DIFFICULTY.HARD
  return CASE_DIFFICULTY.NORMAL
}

export function calculateScore(
  caseData: CaseMeta,
  playerActions: PlayerActions,
  timeMs: number,
  redHerringIds: string[] = [],
): Score {
  const { verdict, justification, usedTools, usedToolEvidencePairs, evidenceConnections } = playerActions
  const { correctVerdict, solution, difficulty } = caseData
  const diff = getDifficultyConfig(difficulty ?? 'normal')
  const requiredPairs = solution.requiredToolEvidencePairs
  const requiredConnections = solution.requiredConnections
  const keywords = solution.justificationKeywords

  const accuracy =
    verdict === correctVerdict ? 50
    : verdict === 'uncertain' ? 30
    : 10

  const usedPairSet = new Set(
    usedToolEvidencePairs.map(([t, e]) => `${t}::${e}`),
  )
  let correctTools: number
  if (requiredPairs.length === 0) {
    correctTools = 10
  } else {
    const matchedToolPairs = requiredPairs.filter(
      ([tool, ev]) => usedPairSet.has(`${tool}::${ev}`),
    ).length
    if (matchedToolPairs === requiredPairs.length) {
      correctTools = 10
    } else {
      const toolIdsUsed = new Set(usedToolEvidencePairs.map(([t]) => t))
      const requiredToolIds = new Set(requiredPairs.map(([t]) => t))
      const toolOverlap = [...requiredToolIds].filter((t) => toolIdsUsed.has(t)).length
      correctTools = Math.min(10, matchedToolPairs * 3 + toolOverlap * 2)
    }
  }

  const extraTools = Math.max(0, usedTools.length - requiredPairs.length)
  let toolEfficiency = Math.max(0, 10 - extraTools * diff.EFFICIENCY_PENALTY)

  if (redHerringIds.length > 0) {
    const redHerringSet = new Set(redHerringIds)
    const wastedTools = usedToolEvidencePairs.filter(
      ([_, ev]) => redHerringSet.has(ev),
    ).length
    toolEfficiency = Math.max(0, toolEfficiency - wastedTools * 1.5)
  }

  const playerConnectionSet = new Set(
    evidenceConnections.map(([a, b]) => toSetKey(a, b)),
  )
  const matchedConnections = requiredConnections.filter(
    ([a, b]) => playerConnectionSet.has(toSetKey(a, b)),
  ).length
  // Any 3+ connections = full score. Connections reward effort, not perfect memorization
  const connections = Math.min(15, 5 * matchedConnections)

  const matchedKeywords = keywords.filter((kw) =>
    justification.toLowerCase().includes(kw.toLowerCase()),
  ).length
  const rawJustice = keywords.length === 0
    ? 10
    : Math.min(10, Math.round((matchedKeywords / Math.min(keywords.length, 3)) * 10))
  const justificationScore = Math.max(
    2,
    rawJustice - (justification.length < DETECTIVE_SCORING.JUSTIFICATION_MIN_LENGTH ? 2 : 0),
  )

  const timeBonus =
    timeMs < diff.TIME_FAST_MS ? 5
    : timeMs > diff.TIME_SLOW_MS ? 0
    : 0

  const total = Math.max(
    0,
    accuracy + correctTools + toolEfficiency + connections + justificationScore + timeBonus,
  )

  return {
    total,
    components: {
      accuracy,
      correctTools,
      toolEfficiency,
      connections,
      justification: justificationScore,
      timeBonus,
    },
    maxScore: 100,
    grade: computeGrade(total),
  }
}
