import { useState, useEffect, useRef } from 'react'
import { preloadAssets } from './assetLoader'
import styles from './LoadingScreen.module.css'

const MIN_DISPLAY_MS = 2000

const TIPS = [
  'You are an investigator at the Global Information Health Agency. Your mission: protect the city of Veritas from coordinated disinformation attacks before its citizens fall into the sigma-trap.',
  'The σ in GIHA\'s sigma model measures societal coherence in information ecosystems.',
  'Deepfake videos often have lip-sync mismatches detectable frame-by-frame at 30fps.',
  'Metadata like timestamps, GPS, and software signatures reveal where content was really created.',
  'Disinformation spreads like a virus — R₀ measures how fast it propagates through a population.',
  'Always cross-reference evidence using multiple forensic tools before reaching a verdict.',
  'Bot networks can amplify fabricated content 50× faster than authentic organic sharing.',
]

export interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [tipIndex, setTipIndex] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    const minTimer = new Promise<void>((resolve) => setTimeout(resolve, MIN_DISPLAY_MS))
    Promise.all([preloadAssets(), minTimer]).then(() => {
      if (!cancelled && !doneRef.current) {
        doneRef.current = true
        onComplete()
      }
    })
    return () => { cancelled = true }
  }, [onComplete])

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length)
    }, 4000)
    return () => clearInterval(tipTimer)
  }, [])

  return (
    <div className={styles.screen} data-testid="loading-screen">
      <img
        src="/assets/logo/GIHA-Logo.svg"
        alt="GIHA Logo"
        className={styles.logo}
        data-testid="loading-logo"
      />
      <div className={styles.progressTrack} data-testid="loading-track">
        <div className={styles.progressBar} data-testid="loading-bar" />
      </div>
      <div className={styles.tipBox} data-testid="loading-tip">
        <div className={styles.tipPrefix}>Did you know?</div>
        <p className={styles.tipText} data-testid="tip-text">{TIPS[tipIndex]}</p>
      </div>
    </div>
  )
}
