import { useEffect, useRef, useState, useCallback } from 'react'
import { useCaseStateStore } from './CaseState'
import { Button } from '@shared/Button'
import type { CutsceneFrame } from './CaseLoader'
import styles from './CutscenePlayer.module.css'

const CHAR_INTERVAL = 30
const SKIP_DELAY = 2000

interface CutscenePlayerProps {
  frames: CutsceneFrame[]
  caseTitle?: string
}

function CutsceneFramePlayer({
  text,
  duration,
  onComplete,
}: {
  text: string
  duration: number
  onComplete: () => void
}) {
  const [visibleChars, setVisibleChars] = useState(0)
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isDone = text.length === 0 || visibleChars >= text.length
  const cursorVisible = visibleChars < text.length

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleChars((prev) => prev + 1)
    }, CHAR_INTERVAL)
    return () => {
      clearInterval(interval)
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
    }
  }, [text])

  useEffect(() => {
    if (!isDone) return
    if (autoTimerRef.current !== null) return
    autoTimerRef.current = setTimeout(() => onComplete(), duration)
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
    }
  }, [isDone, duration, onComplete])

  return (
    <div className={styles.card} onClick={(e) => e.stopPropagation()}>
      <p className={styles.text} data-testid="cutscene-text">
        <span data-testid="cutscene-text-content">{text.slice(0, visibleChars)}</span>
        {cursorVisible && <span className={styles.cursor} data-testid="cursor">|</span>}
      </p>
    </div>
  )
}

export function CutscenePlayer({ frames, caseTitle }: CutscenePlayerProps) {
  const phase = useCaseStateStore((s) => s.phase)
  const frameIndex = useCaseStateStore((s) => s.introFrameIndex)
  const nextIntroFrame = useCaseStateStore((s) => s.nextIntroFrame)
  const autoAdvance = useCaseStateStore((s) => s.autoAdvance)

  const [skipReady, setSkipReady] = useState(false)
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isTransitioningRef = useRef(false)

  const currentFrame = frames[frameIndex]
  const isLastFrame = frameIndex >= frames.length - 1

  const handleFrameComplete = useCallback(() => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true
    if (isLastFrame || !currentFrame) {
      autoAdvance()
    } else {
      nextIntroFrame()
    }
  }, [isLastFrame, currentFrame, autoAdvance, nextIntroFrame])

  const handleFrameCompleteRef = useRef(handleFrameComplete)
  useEffect(() => {
    handleFrameCompleteRef.current = handleFrameComplete
  })

  function handleSkip() {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true
    autoAdvance()
  }

  useEffect(() => {
    isTransitioningRef.current = false
  }, [frameIndex])

  useEffect(() => {
    if (phase !== 'intro') return
    if (frames.length === 0 || !currentFrame) {
      autoAdvance()
    }
  }, [phase, frames.length, currentFrame, autoAdvance])

  useEffect(() => {
    if (skipTimerRef.current) clearTimeout(skipTimerRef.current)
    if (phase !== 'intro') return
    skipTimerRef.current = setTimeout(() => setSkipReady(true), SKIP_DELAY)
    return () => {
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current)
    }
  }, [phase, frameIndex])

  useEffect(() => {
    if (phase !== 'intro') return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handleFrameCompleteRef.current()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase])

  if (phase !== 'intro') return null
  if (frames.length === 0 || !currentFrame) return null

  return (
    <div
      className={styles.overlay}
      onClick={() => handleFrameCompleteRef.current()}
      role="dialog"
      aria-label="Cutscene"
      data-testid="cutscene-overlay"
    >
      {caseTitle && (
        <div className={styles.caseTitle} data-testid="cutscene-title">
          {caseTitle}
        </div>
      )}

      <CutsceneFramePlayer
        key={frameIndex}
        text={currentFrame.text}
        duration={currentFrame.duration}
        onComplete={handleFrameComplete}
      />

      {frames.length > 0 && (
        <div className={styles.progress} data-testid="progress">
          Frame {frameIndex + 1} / {frames.length}
        </div>
      )}

      {skipReady && (
        <div className={styles.skipArea} data-testid="skip-area">
          <Button variant="ghost" onClick={handleSkip} testId="skip-button">
            Skip
          </Button>
        </div>
      )}
    </div>
  )
}
