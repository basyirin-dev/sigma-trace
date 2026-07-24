import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './StrategyTutorial.module.css'

interface TutorialStep {
  title: string
  text: string
  highlight?: string
}

const STEPS: TutorialStep[] = [
  {
    title: 'Welcome to Veritas',
    text: 'You are the GIHA director. Your mission: keep the city resilient against disinformation. Monitor Σ (Media Literacy) and R₀ (Spread Rate) in the HUD at the top of the screen.',
    highlight: 'hud',
  },
  {
    title: 'Deploy Interventions',
    text: 'Use your budget to deploy interventions from the sidebar. Each intervention reduces R₀ or boosts Σ for a limited time. Choose wisely — budget is finite.',
    highlight: 'sidebar',
  },
  {
    title: 'Unlock Cases',
    text: 'As you maintain Σ above 40 and survive long enough, new detective cases unlock at the top of the screen. Each case reveals a different disinformation attack.',
    highlight: 'cases',
  },
  {
    title: 'Complete Cases',
    text: 'Solving detective cases rewards your strategy mode with budget bonuses and permanent buffs. Grade S or A for maximum rewards. Good luck, Director.',
    highlight: '',
  },
]

export interface StrategyTutorialProps {
  onDismiss: () => void
}

export function StrategyTutorial({ onDismiss }: StrategyTutorialProps) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]!
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [step])

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    } else {
      onDismiss()
    }
  }

  const modal = (
    <div className={styles.backdrop}>
      <div className={styles.card} data-testid="tutorial-card">
        <div className={styles.stepIndicator}>
          {step + 1} / {STEPS.length}
        </div>
        <div className={styles.title}>{current.title}</div>
        <p className={styles.text}>{current.text}</p>
        <button
          ref={step === STEPS.length - 1 ? closeRef : undefined}
          className={styles.nextBtn}
          onClick={handleNext}
          data-testid="tutorial-next-btn"
        >
          {step < STEPS.length - 1 ? 'Next' : 'Got it'}
        </button>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
