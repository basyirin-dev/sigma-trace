import { describe, it, expect } from 'vitest'
import { calculateScore, type PlayerActions } from './ScoringEngine'
import type { CaseMeta } from './CaseLoader'

const case01: CaseMeta = {
  id: 'case-01',
  title: 'The Viral Mayor',
  brief: '',
  milLesson: '',
  correctVerdict: 'manipulated',
  difficulty: 'normal',
  solution: {
    requiredConnections: [
      ['evidence-01', 'evidence-02'],
      ['evidence-01', 'evidence-03'],
      ['evidence-03', 'evidence-05'],
      ['evidence-03', 'evidence-06'],
    ],
    requiredToolEvidencePairs: [
      ['spectrogram', 'evidence-02'],
      ['frame-stepper', 'evidence-01'],
      ['metadata-inspector', 'evidence-06'],
    ],
    justificationKeywords: ['lip-sync', 'audio artifact', 'synthetic', 'deepfake', 'shell company'],
  },
  outcome: {
    successR0Delta: -0.3,
    successSigmaDelta: 8,
    failR0Delta: 0.4,
    failSigmaDelta: -5,
    partialR0Delta: -0.1,
    partialSigmaDelta: 1,
  },
}

function perfectActions(): PlayerActions {
  return {
    verdict: 'manipulated',
    justification:
      'The video shows clear lip-sync mismatch and audio artifacts. The synthetic voice pattern in the spectrogram confirms this is a deepfake. The upload server traces to a shell company network.',
    usedTools: ['spectrogram', 'frame-stepper', 'metadata-inspector'],
    usedToolEvidencePairs: [
      ['spectrogram', 'evidence-02'],
      ['frame-stepper', 'evidence-01'],
      ['metadata-inspector', 'evidence-06'],
    ],
    evidenceConnections: [
      ['evidence-01', 'evidence-02'],
      ['evidence-01', 'evidence-03'],
      ['evidence-03', 'evidence-05'],
      ['evidence-03', 'evidence-06'],
    ],
  }
}

function check(
  actions: PlayerActions,
  timeMs: number,
  expected: Partial<{
    total: number
    accuracy: number
    correctTools: number
    toolEfficiency: number
    connections: number
    justification: number
    timeBonus: number
    grade: string
  }>,
) {
  const result = calculateScore(case01, actions, timeMs)
  if (expected.total !== undefined) expect(result.total).toBe(expected.total)
  if (expected.accuracy !== undefined) expect(result.components.accuracy).toBe(expected.accuracy)
  if (expected.correctTools !== undefined) expect(result.components.correctTools).toBe(expected.correctTools)
  if (expected.toolEfficiency !== undefined) expect(result.components.toolEfficiency).toBe(expected.toolEfficiency)
  if (expected.connections !== undefined) expect(result.components.connections).toBe(expected.connections)
  if (expected.justification !== undefined) expect(result.components.justification).toBe(expected.justification)
  if (expected.timeBonus !== undefined) expect(result.components.timeBonus).toBe(expected.timeBonus)
  if (expected.grade !== undefined) expect(result.grade).toBe(expected.grade)
}

describe('calculateScore', () => {
  it('perfect solution returns 100 points, grade S', () => {
    check(perfectActions(), 120_000, {
      total: 100,
      accuracy: 50,
      correctTools: 10,
      toolEfficiency: 10,
      connections: 15,
      justification: 10,
      timeBonus: 5,
      grade: 'S',
    })
  })

  it('wrong verdict returns partial accuracy, grade B', () => {
    check({ ...perfectActions(), verdict: 'real' }, 120_000, {
      total: 60,
      accuracy: 10,
      grade: 'B',
    })
  })

  it('uncertain verdict returns 75 points, grade S', () => {
    check({ ...perfectActions(), verdict: 'uncertain' }, 120_000, {
      total: 80,
      accuracy: 30,
      grade: 'S',
    })
  })

  it('extra tools reduce efficiency: 4 tools used (1 extra), 0 connections, 0 keywords', () => {
    check(
      {
        ...perfectActions(),
        verdict: 'manipulated',
        usedTools: ['a', 'b', 'c', 'd'],
        usedToolEvidencePairs: [],
        evidenceConnections: [],
        justification: '',
      },
      120_000,
      {
        total: 62,
        accuracy: 50,
        correctTools: 0,
        toolEfficiency: 5,
        connections: 0,
        justification: 2,
        timeBonus: 5,
        grade: 'B',
      },
    )
  })

  it('partial tool-evidence matches: 1 of 3 pairs, 1 of 4 connections, 3 of 5 keywords', () => {
    check(
      {
        verdict: 'manipulated',
        justification:
          'lip-sync and audio artifact are clearly visible in this video evidence example. Additional analysis confirms the presence of synthetic elements throughout the file.',
        usedTools: ['spectrogram'],
        usedToolEvidencePairs: [['spectrogram', 'evidence-02']],
        evidenceConnections: [['evidence-01', 'evidence-02']],
      },
      200_000,
      {
        total: 80,
        accuracy: 50,
        correctTools: 5,
        toolEfficiency: 10,
        connections: 5,
        justification: 10,
        timeBonus: 0,
        grade: 'S',
      },
    )
  })

  it('short justification (< 50 chars) gets mild penalty: 4 of 5 keywords', () => {
    check(
      {
        ...perfectActions(),
        justification: 'lip-sync audio artifact synthetic deepfake.',
      },
      120_000,
      {
        total: 98,
        accuracy: 50,
        correctTools: 10,
        toolEfficiency: 10,
        connections: 15,
        justification: 8,
        timeBonus: 5,
        grade: 'S',
      },
    )
  })

  it('all zero: wrong verdict, no tools, no connections, empty text, over 5 min', () => {
    check(
      {
        verdict: 'real',
        justification: '',
        usedTools: [],
        usedToolEvidencePairs: [],
        evidenceConnections: [],
      },
      400_000,
      {
        total: 22,
        accuracy: 10,
        correctTools: 0,
        toolEfficiency: 10,
        connections: 0,
        justification: 2,
        timeBonus: 0,
        grade: 'F',
      },
    )
  })

  it('perfect but time over 5 min (timeBonus = 0)', () => {
    check(perfectActions(), 400_000, {
      total: 95,
      timeBonus: 0,
      grade: 'S',
    })
  })

  it('time bonus boundary: exactly 180s = 0, exactly 300s = 0', () => {
    const at180 = calculateScore(case01, perfectActions(), 180_000)
    expect(at180.components.timeBonus).toBe(0)
    expect(at180.total).toBe(95)

    const at300 = calculateScore(case01, perfectActions(), 300_000)
    expect(at300.components.timeBonus).toBe(0)
    expect(at300.total).toBe(95)
  })

  it('short justification + no keywords = minimum 2 justification', () => {
    check(
      {
        ...perfectActions(),
        justification: 'Too short.',
      },
      120_000,
      {
        justification: 2,
        grade: 'S',
      },
    )
  })
})
