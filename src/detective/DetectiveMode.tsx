import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCaseStateStore } from './CaseState'
import { useDetectiveStore } from './useDetectiveStore'
import { useToolTutorialStore } from './useToolTutorialStore'
import { ToolTutorialOverlay } from './ToolTutorialOverlay'
import { CutscenePlayer } from './CutscenePlayer'
import { EvidenceBoard } from './EvidenceBoard'
import { Toolbelt } from './Toolbelt'
import { VerdictPanel } from './VerdictPanel'
import { DebriefScreen } from './DebriefScreen'
import { Modal } from '@shared/Modal'
import { useGameStore, useWarningStore, usePlaytestStore } from '@shared/stores'
import { useAudioManager } from '@shared/useAudioManager'
import { calculateScore, GRADE_BUDGET, type PlayerActions } from './ScoringEngine'
import { DETECTIVE_OUTCOME } from '@engine/tuning'
import type { CaseData, CaseMeta } from './CaseLoader'
import type { Verdict } from '@engine/types'
import { FrameStepper } from './tools/FrameStepper.tsx'
import { Spectrogram } from './tools/Spectrogram'
import { MetadataInspector } from './tools/MetadataInspector'
import { SourceTracer } from './tools/SourceTracer'
import { TimelineCrossReferencer } from './tools/TimelineCrossReferencer'
import { InconsistencyHighlighter } from './tools/InconsistencyHighlighter'
import { TOOLS, getToolDef, TOOL_AFFINITY_MAP } from './tools/constants'
import {
  buildEvidenceFindings,
  buildCaseMetadata,
  buildSourceTraceEvents,
  buildSourceTraceSummary,
  buildTimelineEvents,
  timelineCrossReferenceSummary,
  buildInconsistencyFeedback,
} from './narrativeBuilders'
interface ToolModalState {
  toolId: string
  evidenceId: string
}

function renderToolModal(
  toolId: string,
  evidenceId: string,
  caseData: CaseData,
  caseId: string,
) {
  const evidence = caseData.evidence.find((e) => e.id === evidenceId)

  switch (toolId) {
    case 'frame-stepper': {
      const src = evidence?.src
      if (!src) return <div style={{ color: '#888' }}>No video source available</div>
      return <FrameStepper videoSrc={`/cases/${caseId}/${src}`} />
    }
    case 'spectrogram': {
      const src = evidence?.src
      if (!src) return <div style={{ color: '#888' }}>No audio source available</div>
      return <Spectrogram audioSrc={`/cases/${caseId}/${src}`} />
    }
    case 'metadata-inspector': {
      const metadata = buildCaseMetadata(caseId, evidenceId)
      if (Object.keys(metadata).length === 0) {
        return <div style={{ color: '#888' }}>No metadata available for this item</div>
      }
      return <MetadataInspector metadata={metadata} />
    }
    case 'source-tracer': {
      const events = buildSourceTraceEvents(caseId, evidenceId)
      const summary = buildSourceTraceSummary(caseId)
      return <SourceTracer assetSrc={''} events={events} summary={summary} />
    }
    case 'timeline-cross-referencer': {
      const events = buildTimelineEvents(caseId, evidenceId)
      return (
        <div>
          <TimelineCrossReferencer events={events} />
          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(255, 170, 0, 0.08)',
              borderRadius: '4px',
              borderLeft: '3px solid #f39c12',
              fontSize: '13px',
              color: '#f0c060',
              lineHeight: '1.5',
            }}
          >
            {timelineCrossReferenceSummary(caseId, events.length)}
          </div>
        </div>
      )
    }
    case 'inconsistency-highlighter': {
      const src = evidence?.src
      if (!src) return <div style={{ color: '#888' }}>No image source available</div>
      const feedback = buildInconsistencyFeedback(caseId, evidenceId)
      return (
        <InconsistencyHighlighter
          imageSrc={`/cases/${caseId}/${src}`}
          finding={feedback?.finding}
          annotations={feedback?.annotations}
        />
      )
    }
    default:
      return <div style={{ color: '#888' }}>Tool not available</div>
  }
}

function getToolModalTitle(toolId: string, evidenceId: string, caseData: CaseData): string {
  const toolDef = getToolDef(toolId)
  const evidence = caseData.evidence.find((e) => e.id === evidenceId)
  const evLabel = evidence?.label ?? evidenceId
  return `${toolDef?.label ?? toolId} \u2014 ${evLabel}`
}

function computeOutcome(caseMeta: CaseMeta, scoreTotal: number, grade: string) {
  const { outcome } = caseMeta
  const budgetBonus = GRADE_BUDGET[grade as keyof typeof GRADE_BUDGET] ?? 0

  if (scoreTotal >= DETECTIVE_OUTCOME.SUCCESS_THRESHOLD) {
    return { r0Delta: outcome.successR0Delta, sigmaDelta: outcome.successSigmaDelta, budgetBonus }
  }
  if (scoreTotal >= DETECTIVE_OUTCOME.PARTIAL_THRESHOLD) {
    return { r0Delta: outcome.partialR0Delta, sigmaDelta: outcome.partialSigmaDelta, budgetBonus }
  }
  return { r0Delta: outcome.failR0Delta, sigmaDelta: outcome.failSigmaDelta, budgetBonus: 0 }
}

export function DetectiveMode() {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()

  const phase = useCaseStateStore((s) => s.phase)
  const autoAdvance = useCaseStateStore((s) => s.autoAdvance)
  const resetPhase = useCaseStateStore((s) => s.reset)

  const caseData = useDetectiveStore((s) => s.caseData)
  const loading = useDetectiveStore((s) => s.loading)
  const connections = useDetectiveStore((s) => s.connections)
  const usedTools = useDetectiveStore((s) => s.usedTools)
  const usedToolEvidencePairs = useDetectiveStore((s) => s.usedToolEvidencePairs)
  const activeTool = useDetectiveStore((s) => s.activeTool)
  const startTime = useDetectiveStore((s) => s.startTime)
  const loadCase = useDetectiveStore((s) => s.loadCase)
  const connectEvidence = useDetectiveStore((s) => s.connectEvidence)
  const disconnectEvidence = useDetectiveStore((s) => s.disconnectEvidence)
  const applyTool = useDetectiveStore((s) => s.applyTool)
  const selectTool = useDetectiveStore((s) => s.selectTool)
  const submitVerdictStore = useDetectiveStore((s) => s.submitVerdict)
  const playerVerdict = useDetectiveStore((s) => s.playerVerdict)
  const miraOutcome = useDetectiveStore((s) => s.miraOutcome)
  const resetStore = useDetectiveStore((s) => s.reset)

  const gameSwitchMode = useGameStore((s) => s.switchMode)
  const gameFinishCase = useGameStore((s) => s.finishCase)
  const gameStoreRecordGrade = useGameStore((s) => s.recordCaseGrade)

  useAudioManager()

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (phase !== 'investigation' && phase !== 'evidence') return
      const idx = Number(e.key)
      if (idx >= 1 && idx <= TOOLS.length) {
        e.preventDefault()
        const toolId = TOOLS[idx - 1]!.id
        selectTool(activeTool === toolId ? null : toolId)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, activeTool, selectTool])

  const [toolModal, setToolModal] = useState<ToolModalState | null>(null)
  const [tutorialToolId, setTutorialToolId] = useState<string | null>(null)
  const tutorialDismissed = useToolTutorialStore((s) => s.dismissed)
  const dismissTutorial = useToolTutorialStore((s) => s.dismiss)
  const resetToolTutorial = useToolTutorialStore((s) => s.resetForTool)
  const [showTutorialHelp, setShowTutorialHelp] = useState(false)
  const [score, setScore] = useState<ReturnType<typeof calculateScore> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [debriefTime, setDebriefTime] = useState(0)
  const debriefTimeRef = useRef(0)

  useEffect(() => {
    if (!caseId) return
    resetStore()
    resetPhase()
    void loadCase(caseId)
  }, [caseId, loadCase, resetStore, resetPhase])

  useEffect(() => {
    if (!toolModal || !caseId) return
    if (caseId === 'case-01' && toolModal.toolId === 'metadata-inspector' && toolModal.evidenceId === 'evidence-01') {
      usePlaytestStore.getState().showMonologue('There it is. The tell.')
    }
    if (caseId === 'case-03' && toolModal.evidenceId === 'evidence-05') {
      usePlaytestStore.getState().showMonologue('Oh no. She\u2019s not a villain. She\u2019s a victim.')
    }
  }, [toolModal, caseId])

  const handleVerdictSubmit = useCallback(
    (verdict: Verdict, justification: string) => {
      if (!caseData || submitting) return
      setSubmitting(true)
      submitVerdictStore(verdict, justification)

      const playerActions: PlayerActions = {
        verdict,
        justification,
        usedTools: usedTools,
        usedToolEvidencePairs,
        evidenceConnections: connections,
      }

      const elapsed = startTime > 0 ? Date.now() - startTime : 0
      const redHerringIds = caseData.evidence.filter((e) => e.isRedHerring).map((e) => e.id)
      const computed = calculateScore(caseData.meta, playerActions, elapsed, redHerringIds)
      setScore(computed)
      debriefTimeRef.current = elapsed
      setDebriefTime(elapsed)
      setSubmitting(false)
      // Small delay to let React process state updates before phase transition
      setTimeout(() => autoAdvance(), 50)
    },
    [caseData, submitting, usedTools, usedToolEvidencePairs, connections, startTime, submitVerdictStore, autoAdvance],
  )

  const handleReturnToCity = useCallback(() => {
    if (!score || !caseData || !caseId) return
    const outcome = computeOutcome(caseData.meta, score.total, score.grade)
    gameStoreRecordGrade(caseId, score.grade)
    gameFinishCase(outcome.r0Delta, outcome.sigmaDelta, outcome.budgetBonus)
    resetStore()
    resetPhase()
    gameSwitchMode('strategy')
    navigate('/transition', {
      state: {
        direction: 'to-strategy',
        caseTitle: caseData.meta.title,
        verdict: score.grade === 'F' ? (playerVerdict ?? 'uncertain') : caseData.meta.correctVerdict,
        r0Delta: outcome.r0Delta,
        sigmaDelta: outcome.sigmaDelta,
        budgetBonus: outcome.budgetBonus,
      },
    })
  }, [score, caseData, caseId, playerVerdict, gameFinishCase, gameStoreRecordGrade, resetStore, resetPhase, gameSwitchMode, navigate])

  const handleToolApply = useCallback(
    (evidenceId: string, toolId: string) => {
      if (!caseData) return
      const evidence = caseData.evidence.find((e) => e.id === evidenceId)
      if (!evidence) return
      const isDismissed = tutorialDismissed.includes(toolId)
      if (!isDismissed && activeTool === toolId) {
        setTutorialToolId(toolId)
      }
      const allowedTypes = TOOL_AFFINITY_MAP[toolId]
      if (allowedTypes && !allowedTypes.includes(evidence.type)) {
        useWarningStore.getState().addWarning(`${toolId} doesn't work on ${evidence.type} evidence. Try a different tool.`)
        return
      }
      applyTool(toolId, evidenceId)
      setToolModal({ toolId, evidenceId })
    },
    [applyTool, caseData, activeTool, tutorialDismissed],
  )

  if (loading || !caseData) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      background: 'var(--color-bg-detective)',
        color: '#888',
        fontFamily: 'monospace',
        fontSize: '18px',
      }}
      >
        Loading case...
      </div>
    )
  }

  const evidenceFindings = buildEvidenceFindings(caseData.script)

  return (
    <div style={{
      background: '#0a0a1a',
      minHeight: '100vh',
      color: '#ddd',
      fontFamily: 'monospace',
      position: 'relative',
      overflow: 'hidden',
    }}
    >
      <CutscenePlayer
        frames={caseData.script.introCutscene}
        caseTitle={caseData.meta.title}
      />

      {(phase === 'investigation' || phase === 'evidence') && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Toolbelt
            activeTool={activeTool}
            usedTools={usedTools}
            onSelectTool={(toolId) => selectTool(toolId)}
            onRequestTutorialHelp={() => setShowTutorialHelp(true)}
          />
          <div style={{ flex: 1, overflow: 'auto' }}>
            <EvidenceBoard
              evidenceItems={caseData.evidence}
              boardData={caseData.board}
              connections={connections}
              onConnect={(a, b) => connectEvidence(a, b)}
              onDisconnect={(a, b) => disconnectEvidence(a, b)}
              onInspect={(evidenceId, toolId) => handleToolApply(evidenceId, toolId)}
              activeTool={activeTool}
              evidenceFindings={evidenceFindings}
              onToolApply={(evidenceId, toolId) => handleToolApply(evidenceId, toolId)}
            />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '12px 16px',
            borderTop: '1px solid #333',
            background: 'rgba(22, 33, 62, 0.95)',
          }}>
            <button
              onClick={() => {
                const store = useCaseStateStore.getState()
                const currentPhase = store.phase
                // Auto-advance through intermediate phases to reach verdict
                const phaseOrder: readonly string[] = ['intro', 'investigation', 'evidence', 'verdict', 'debrief']
                const currentIdx = phaseOrder.indexOf(currentPhase)
                const targetIdx = phaseOrder.indexOf('verdict')
                const advances = targetIdx - currentIdx
                for (let i = 0; i < advances; i++) {
                  store.autoAdvance()
                }
              }}
              style={{
                padding: '12px 32px',
                background: 'rgba(46, 204, 113, 0.2)',
                border: '2px solid #2ecc71',
                borderRadius: 6,
                fontFamily: 'monospace',
                fontSize: 16,
                fontWeight: 700,
                color: '#2ecc71',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              Submit Verdict
            </button>
          </div>
        </div>
      )}

      {phase === 'verdict' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '24px',
        }}
        >
          <VerdictPanel
            caseTitle={caseData.meta.title}
            onSubmit={handleVerdictSubmit}
            disabled={submitting}
            loading={submitting}
          />
        </div>
      )}

      {phase === 'debrief' && score && (
        <DebriefScreen
          caseTitle={caseData.meta.title}
          correctVerdict={caseData.meta.correctVerdict}
          playerVerdict={playerVerdict ?? 'uncertain'}
          conclusionText={caseData.script.conclusionText}
          conclusionTextExposed={caseData.script.conclusionTextExposed}
          conclusionTextProtected={caseData.script.conclusionTextProtected}
          miraOutcome={miraOutcome}
          milLesson={caseData.script.milLesson}
          score={score}
          budgetBonus={GRADE_BUDGET[score.grade] ?? 0}
          onReturn={handleReturnToCity}
          timeElapsed={debriefTime}
        />
      )}

      {toolModal && (
        <Modal
          title={getToolModalTitle(toolModal.toolId, toolModal.evidenceId, caseData)}
          isOpen
          onClose={() => setToolModal(null)}
          variant="default"
        >
          {renderToolModal(toolModal.toolId, toolModal.evidenceId, caseData, caseId ?? 'case-01')}
        </Modal>
      )}
      {tutorialToolId && (() => {
        const toolDef = getToolDef(tutorialToolId)
        return (
          <ToolTutorialOverlay
            toolId={tutorialToolId}
            toolName={toolDef?.label ?? tutorialToolId}
            toolIcon={toolDef?.icon ?? '?'}
            isOpen
            onDismiss={() => { dismissTutorial(tutorialToolId); setTutorialToolId(null) }}
          />
        )
      })()}
      {showTutorialHelp && (
        <Modal title="Tool Tutorials" isOpen onClose={() => setShowTutorialHelp(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 320 }}>
            {TOOLS.map((tool) => {
              const isDismissed = tutorialDismissed.includes(tool.id)
              return (
                <div
                  key={tool.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 12, padding: '8px 12px', background: 'rgba(255,255,255,0.03)',
                    borderRadius: 4, border: '1px solid #333',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{tool.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 14, color: '#e0e0e0' }}>
                        {tool.label}
                      </div>
                      <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                        {isDismissed ? 'Tutorial completed' : 'Not yet seen'}
                      </div>
                    </div>
                  </div>
                  <button
                    style={{
                      padding: '4px 12px', background: 'rgba(255,179,0,0.1)',
                      border: '1px solid rgba(255,179,0,0.4)', borderRadius: 4,
                      color: '#FFB300', fontFamily: 'var(--font-pixel)', fontSize: 12,
                      cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                    onClick={() => {
                      resetToolTutorial(tool.id)
                      setTutorialToolId(tool.id)
                      setShowTutorialHelp(false)
                    }}
                    data-testid={`replay-tutorial-${tool.id}`}
                  >
                    Replay Tutorial
                  </button>
                </div>
              )
            })}
          </div>
        </Modal>
      )}
    </div>
  )
}
