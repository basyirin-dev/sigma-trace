import { describe, it, expect } from 'vitest'
import type { Tool } from './types'
import type { CaseData } from '../CaseLoader'
import { SpectrogramTool } from './SpectrogramTool'
import { FrameStepperTool } from './FrameStepperTool'
import { MetadataInspectorTool } from './MetadataInspectorTool'
import { SourceTracerTool } from './SourceTracerTool'
import { InconsistencyHighlighterTool } from './InconsistencyHighlighterTool'
import { TimelineCrossReferencerTool } from './TimelineCrossReferencerTool'

function makeBaseEvidence(overrides?: Partial<ToolTestEvidence>): ToolTestEvidence {
  return {
    id: 'evidence-01',
    type: 'audio',
    label: 'Test Evidence',
    description: 'A test evidence item',
    isRedHerring: false,
    ...overrides,
  }
}

type ToolTestEvidence = Parameters<Tool['eligibility']>[0]

type ToolConstructor = new () => Tool

const ALL_TOOL_CLASSES: { name: string; Class: ToolConstructor; eligibleTypes: string[] }[] = [
  { name: 'SpectrogramTool', Class: SpectrogramTool, eligibleTypes: ['audio'] },
  { name: 'FrameStepperTool', Class: FrameStepperTool, eligibleTypes: ['video'] },
  { name: 'MetadataInspectorTool', Class: MetadataInspectorTool, eligibleTypes: ['video', 'audio', 'image', 'text', 'metadata'] },
  { name: 'SourceTracerTool', Class: SourceTracerTool, eligibleTypes: ['video', 'audio', 'image', 'text', 'metadata'] },
  { name: 'InconsistencyHighlighterTool', Class: InconsistencyHighlighterTool, eligibleTypes: ['image'] },
  { name: 'TimelineCrossReferencerTool', Class: TimelineCrossReferencerTool, eligibleTypes: ['video', 'audio', 'image', 'text', 'metadata'] },
]

const ALL_EVIDENCE_TYPES: ToolTestEvidence['type'][] = [
  'video', 'audio', 'image', 'text', 'metadata',
]

function makeFakeCaseData(): CaseData {
  return {
    meta: {
      id: 'test',
      title: 'Test Case',
      brief: 'A test case',
      milLesson: 'Test lesson',
      correctVerdict: 'manipulated',
      difficulty: 'normal',
      solution: {
        requiredConnections: [],
        requiredToolEvidencePairs: [],
        justificationKeywords: [],
      },
      outcome: {
        successR0Delta: -0.5,
        successSigmaDelta: 0.3,
        failR0Delta: 0.2,
        failSigmaDelta: -0.1,
        partialR0Delta: -0.2,
        partialSigmaDelta: 0.1,
      },
    },
    script: {
      introCutscene: [],
      evidenceFindings: {},
      toolHints: {},
      conclusionText: 'Test conclusion',
      milLesson: 'Test lesson',
    },
    evidence: [],
    board: { nodes: [], requiredConnections: [], hintConnections: [] },
  }
}

describe('Tool interface implementation', () => {
  describe.each(ALL_TOOL_CLASSES)('$name', ({ Class, eligibleTypes }) => {
    it('can be instantiated', () => {
      const instance = new Class()
      expect(instance).toBeInstanceOf(Class)
    })

    it('has all required Tool properties', () => {
      const instance = new Class()
      expect(instance).toHaveProperty('id')
      expect(instance).toHaveProperty('name')
      expect(instance).toHaveProperty('icon')
      expect(instance).toHaveProperty('description')
      expect(typeof instance.id).toBe('string')
      expect(typeof instance.name).toBe('string')
      expect(typeof instance.icon).toBe('string')
      expect(typeof instance.description).toBe('string')
      expect(instance.id.length).toBeGreaterThan(0)
      expect(instance.name.length).toBeGreaterThan(0)
    })

    it('has eligibility as a function returning boolean', () => {
      const instance = new Class()
      expect(typeof instance.eligibility).toBe('function')
      const result = instance.eligibility(makeBaseEvidence())
      expect(typeof result).toBe('boolean')
    })

    it('returns true for eligible evidence types', () => {
      const instance = new Class()
      for (const type of ALL_EVIDENCE_TYPES) {
        const ev = makeBaseEvidence({ type })
        if (eligibleTypes.includes(type)) {
          expect(instance.eligibility(ev)).toBe(true)
        }
      }
    })

    it('returns false for ineligible evidence types', () => {
      const instance = new Class()
      for (const type of ALL_EVIDENCE_TYPES) {
        const ev = makeBaseEvidence({ type })
        if (!eligibleTypes.includes(type)) {
          expect(instance.eligibility(ev)).toBe(false)
        }
      }
    })

    it('has apply as a function', () => {
      const instance = new Class()
      expect(typeof instance.apply).toBe('function')
    })

    it('apply returns a valid ToolResult shape', () => {
      const instance = new Class()
      const eligibleType = eligibleTypes[0] as ToolTestEvidence['type']
      const ev = makeBaseEvidence({ type: eligibleType })
      const caseDataParam = makeFakeCaseData()
      const result = instance.apply(ev, caseDataParam )

      expect(result).toHaveProperty('findings')
      expect(result).toHaveProperty('confidence')
      expect(result).toHaveProperty('evidenceId')
      expect(result).toHaveProperty('timestamp')

      expect(Array.isArray(result.findings)).toBe(true)
      expect(result.findings.length).toBeGreaterThan(0)
      expect(typeof result.confidence).toBe('number')
      expect(typeof result.evidenceId).toBe('string')
      expect(typeof result.timestamp).toBe('number')

      expect(result.evidenceId).toBe(ev.id)
    })

    it('confidence is clamped between 0 and 1', () => {
      const instance = new Class()
      const eligibleType = eligibleTypes[0] as ToolTestEvidence['type']
      const ev = makeBaseEvidence({ type: eligibleType })
      const caseDataParam = makeFakeCaseData()
      const result = instance.apply(ev, caseDataParam )

      expect(result.confidence).toBeGreaterThanOrEqual(0)
      expect(result.confidence).toBeLessThanOrEqual(1)
    })

    it('timestamp is set from Date.now() (within 30s)', () => {
      const instance = new Class()
      const eligibleType = eligibleTypes[0] as ToolTestEvidence['type']
      const ev = makeBaseEvidence({ type: eligibleType })
      const caseDataParam = makeFakeCaseData()
      const before = Date.now()
      const result = instance.apply(ev, caseDataParam )
      const after = Date.now()

      expect(result.timestamp).toBeGreaterThanOrEqual(before - 100)
      expect(result.timestamp).toBeLessThanOrEqual(after + 100)
    })
  })

  describe('type-restricted tools throw on wrong evidence type', () => {
    const restrictedCases: { name: string; Class: ToolConstructor; expectedTypes: string[] }[] = [
      { name: 'SpectrogramTool', Class: SpectrogramTool, expectedTypes: ['audio'] },
      { name: 'FrameStepperTool', Class: FrameStepperTool, expectedTypes: ['video'] },
      { name: 'InconsistencyHighlighterTool', Class: InconsistencyHighlighterTool, expectedTypes: ['image'] },
    ]

    describe.each(restrictedCases)('$name', ({ Class, expectedTypes }) => {
      it.each(ALL_EVIDENCE_TYPES.filter((t) => !expectedTypes.includes(t)))(
        'throws for type "%s"',
        (type) => {
          const instance = new Class()
          const ev = makeBaseEvidence({ type })
          const caseDataParam = makeFakeCaseData()
          expect(() =>
            instance.apply(ev, caseDataParam ),
          ).toThrow(`requires evidence of type ${expectedTypes.join(' | ')}`)
        },
      )
    })
  })
})

describe('BaseTool shared validation', () => {
  it('makeResult clamps confidence to [0, 1]', () => {
    const tool = new SpectrogramTool()
    const ev = makeBaseEvidence({ type: 'audio' })

    const high = tool.apply(ev, makeFakeCaseData() )
    expect(high.confidence).toBeLessThanOrEqual(1)
  })

  it('findings is a non-empty array', () => {
    const tool = new SpectrogramTool()
    const ev = makeBaseEvidence({ type: 'audio' })
    const result = tool.apply(ev, makeFakeCaseData() )
    expect(result.findings.length).toBeGreaterThan(0)
  })
})
