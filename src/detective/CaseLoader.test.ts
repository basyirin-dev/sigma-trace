import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadCase, loadCaseMeta, loadCaseScript, CaseLoadError } from './CaseLoader'
import { useWarningStore } from '@shared/stores'
import type { CaseMeta, CaseScript, EvidenceBoardData } from './CaseLoader'

const metaData: CaseMeta = {
  id: 'case-01',
  title: 'The Viral Mayor',
  brief: 'A video of Mayor Chen appears to show her resigning.',
  milLesson: 'Deepfake detection through multi-modal analysis',
  correctVerdict: 'manipulated',
  difficulty: 'normal',
  solution: {
    requiredConnections: [['evidence-01', 'evidence-02']],
    requiredToolEvidencePairs: [['spectrogram', 'evidence-02']],
    justificationKeywords: ['deepfake', 'synthetic'],
  },
  outcome: {
    successR0Delta: -0.3,
    successSigmaDelta: 5,
    failR0Delta: 0.4,
    failSigmaDelta: -5,
    partialR0Delta: -0.1,
    partialSigmaDelta: 1,
  },
}

const scriptData: CaseScript = {
  introCutscene: [
    { text: 'A video just went viral.', duration: 5000 },
    { text: 'The city is in chaos.', duration: 4000 },
  ],
  evidenceFindings: { 'evidence-01': 'The video has micro-mismatches.' },
  toolHints: { spectrogram: 'Visualizes audio frequency spectrum.' },
  conclusionText: 'The video was a deepfake.',
  milLesson: 'Always verify through multiple analyses.',
}

const evidenceData = {
  items: [
    {
      id: 'evidence-01',
      type: 'video' as const,
      label: 'Resignation Video',
      description: '30-second clip.',
      isRedHerring: false,
    },
  ],
}

const boardData: EvidenceBoardData = {
  nodes: [
    { id: 'evidence-01', x: 0.25, y: 0.2, label: 'Resignation Video' },
  ],
  requiredConnections: [['evidence-01', 'evidence-02']],
  hintConnections: [],
}

function okResponse(data: unknown): Response {
  return { ok: true, status: 200, json: async () => data } as Response
}

function notFoundResponse(): Response {
  return { ok: false, status: 404, statusText: 'Not Found', json: async () => ({}) } as Response
}

let fetchSpy: ReturnType<typeof vi.spyOn>

function mockFetch(handler: (url: string) => Response | Promise<Response>) {
  fetchSpy.mockImplementation(async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : (input as Request).url
    return handler(url)
  })
}

function defaultHandler(url: string): Response | Promise<Response> {
  if (url.includes('metadata.json')) return okResponse(metaData)
  if (url.includes('script.json')) return okResponse(scriptData)
  if (url.includes('evidence-items.json')) return okResponse(evidenceData)
  if (url.includes('evidence-board.json')) return okResponse(boardData)
  return notFoundResponse()
}

beforeEach(() => {
  fetchSpy = vi.spyOn(window, 'fetch')
  mockFetch(defaultHandler)
  vi.spyOn(useWarningStore.getState(), 'addWarning')
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('loadCase', () => {
  it('returns CaseData for case-01 with all 4 pieces', async () => {
    const result = await loadCase('case-01')
    expect(result).not.toBeNull()
    expect(result!.meta.id).toBe('case-01')
    expect(result!.meta.title).toBe('The Viral Mayor')
    expect(result!.script.conclusionText).toBe('The video was a deepfake.')
    expect(result!.evidence).toHaveLength(1)
    expect(result!.evidence[0]!.id).toBe('evidence-01')
    expect(result!.board.nodes).toHaveLength(1)
  })

  it('returns CaseData for case-02 with all 4 pieces', async () => {
    const result = await loadCase('case-02')
    expect(result).not.toBeNull()
    expect(result!.script.introCutscene).toHaveLength(2)
  })

  it('returns CaseData for case-03 with all 4 pieces', async () => {
    const result = await loadCase('case-03')
    expect(result).not.toBeNull()
    expect(result!.script.introCutscene).toHaveLength(2)
  })

  it('fires all 4 fetches in parallel', async () => {
    fetchSpy.mockClear()
    await loadCase('case-01')
    const callUrls = fetchSpy.mock.calls.map((c: unknown[]) => String(c[0]))
    expect(callUrls.filter((u: string) => u.includes('/cases/'))).toHaveLength(4)
  })

  it('returns null and warns on 404 for metadata.json', async () => {
    mockFetch((url) => {
      if (url.includes('metadata.json')) return notFoundResponse()
      return okResponse(scriptData)
    })
    const result = await loadCase('case-99')
    expect(result).toBeNull()
    expect(useWarningStore.getState().addWarning).toHaveBeenCalled()
  })

  it('returns null on 404 for script.json', async () => {
    mockFetch((url) => {
      if (url.includes('script.json')) return notFoundResponse()
      return okResponse(metaData)
    })
    const result = await loadCase('case-99')
    expect(result).toBeNull()
  })

  it('returns null when metadata missing correctVerdict', async () => {
    const rest = { ...metaData }
    delete (rest as Record<string, unknown>).correctVerdict
    mockFetch((url) => {
      if (url.includes('metadata.json')) return okResponse(rest)
      return notFoundResponse()
    })
    const result = await loadCase('case-01')
    expect(result).toBeNull()
  })

  it('returns null for invalid verdict value', async () => {
    mockFetch((url) => {
      if (url.includes('metadata.json')) return okResponse({ ...metaData, correctVerdict: 'maybe' })
      if (url.includes('script.json')) return okResponse(scriptData)
      if (url.includes('evidence-items.json')) return okResponse(evidenceData)
      if (url.includes('evidence-board.json')) return okResponse(boardData)
      return notFoundResponse()
    })
    const result = await loadCase('case-01')
    expect(result).toBeNull()
  })

  it('returns null for invalid evidence type', async () => {
    const badEvidence = { items: [{ ...evidenceData.items[0], type: 'document' }] }
    mockFetch((url) => {
      if (url.includes('evidence-items.json')) return okResponse(badEvidence)
      return okResponse(metaData)
    })
    const result = await loadCase('case-01')
    expect(result).toBeNull()
  })

  it('returns null for cutscene frame missing duration', async () => {
    const badScript = {
      ...scriptData,
      introCutscene: [{ text: 'Only text, no duration' }],
    }
    mockFetch((url) => {
      if (url.includes('script.json')) return okResponse(badScript)
      return okResponse(metaData)
    })
    const result = await loadCase('case-01')
    expect(result).toBeNull()
  })

  it('returns null for board with invalid node (missing x)', async () => {
    const badBoard = { nodes: [{ id: 'ev-01', y: 0.5, label: 'test' }], requiredConnections: [], hintConnections: [] }
    mockFetch((url) => {
      if (url.includes('evidence-board.json')) return okResponse(badBoard)
      return okResponse(metaData)
    })
    const result = await loadCase('case-01')
    expect(result).toBeNull()
  })
})

describe('loadCaseMeta', () => {
  it('loads and validates metadata', async () => {
    const meta = await loadCaseMeta('case-01')
    expect(meta.title).toBe('The Viral Mayor')
  })

  it('throws CaseLoadError on bad metadata', async () => {
    mockFetch(async () => notFoundResponse())
    await expect(loadCaseMeta('bad')).rejects.toThrow(CaseLoadError)
  })
})

describe('loadCaseScript', () => {
  it('loads and validates script', async () => {
    const script = await loadCaseScript('case-01')
    expect(script.conclusionText).toBe('The video was a deepfake.')
  })

  it('throws CaseLoadError on missing duration', async () => {
    mockFetch((url) => {
      if (url.includes('script.json')) return okResponse({ ...scriptData, introCutscene: [{}] })
      return notFoundResponse()
    })
    await expect(loadCaseScript('bad')).rejects.toThrow(CaseLoadError)
  })
})
