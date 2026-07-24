import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudioStore, useGameStore, useSimulationStore } from './stores'
import { clearSave } from './saveManager'
import { Modal } from './Modal'
import styles from './SettingsPanel.module.css'

export interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const navigate = useNavigate()
  const musicVolume = useAudioStore((s) => s.musicVolume)
  const sfxVolume = useAudioStore((s) => s.sfxVolume)
  const muted = useAudioStore((s) => s.muted)
  const showFps = useAudioStore((s) => s.showFps)
  const setMusicVolume = useAudioStore((s) => s.setMusicVolume)
  const setSfxVolume = useAudioStore((s) => s.setSfxVolume)
  const toggleMute = useAudioStore((s) => s.toggleMute)
  const toggleFps = useAudioStore((s) => s.toggleFps)

  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)

  const handleReset = () => {
    useGameStore.getState().reset()
    useSimulationStore.getState().resetSimulation()
    clearSave()
    setShowResetConfirm(false)
    onClose()
  }

  const handleRestartStrategy = () => {
    useGameStore.getState().resetStrategyOnly()
    useSimulationStore.getState().resetSimulation()
    setShowRestartConfirm(false)
    onClose()
  }

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void document.documentElement.requestFullscreen()
    }
  }

  const handleMainMenu = () => {
    setShowExitConfirm(true)
  }

  return (
    <Modal title="Settings" isOpen={isOpen} onClose={onClose}>
      <div className={styles.panel} data-testid="settings-panel">
        <div className={styles.row}>
          <label className={styles.label}>Main Menu</label>
          <button
            className={styles.actionBtn}
            onClick={handleMainMenu}
            data-testid="main-menu-btn"
          >
            Go to Title Screen
          </button>
        </div>

        <div className={styles.divider} />
        <div className={styles.row}>
          <label className={styles.label}>Music Volume</label>
          <div className={styles.sliderRow}>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(musicVolume * 100)}
              onChange={(e) => setMusicVolume(Number(e.target.value) / 100)}
              className={styles.slider}
              data-testid="music-slider"
            />
            <span className={styles.value}>{Math.round(musicVolume * 100)}%</span>
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>SFX Volume</label>
          <div className={styles.sliderRow}>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(sfxVolume * 100)}
              onChange={(e) => setSfxVolume(Number(e.target.value) / 100)}
              className={styles.slider}
              data-testid="sfx-slider"
            />
            <span className={styles.value}>{Math.round(sfxVolume * 100)}%</span>
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Mute All Audio</label>
          <input
            type="checkbox"
            checked={muted}
            onChange={toggleMute}
            data-testid="mute-checkbox"
          />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Show FPS Counter</label>
          <input
            type="checkbox"
            checked={showFps}
            onChange={toggleFps}
            data-testid="fps-checkbox"
          />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Display</label>
          <button
            className={styles.actionBtn}
            onClick={handleFullscreen}
            data-testid="fullscreen-btn"
          >
            Toggle Fullscreen
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.row}>
          <label className={styles.label}>Replay Tutorial</label>
          <button
            className={styles.actionBtn}
            onClick={() => {
              useGameStore.getState().resetStrategyTutorial()
              onClose()
            }}
            data-testid="replay-tutorial-btn"
          >
            Replay Strategy Tutorial
          </button>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Restart Strategy</label>
          <button
            className={styles.actionBtn}
            onClick={() => setShowRestartConfirm(true)}
            data-testid="restart-strategy-btn"
          >
            Restart Strategy
          </button>
        </div>

        <div className={styles.row}>
          <label className={styles.labelDanger}>Reset Progress</label>
          <button
            className={styles.dangerBtn}
            onClick={() => setShowResetConfirm(true)}
            data-testid="reset-btn"
          >
            Reset All Progress
          </button>
        </div>

        {showExitConfirm && (
          <Modal
            title="Leave to Title Screen?"
            isOpen={showExitConfirm}
            onClose={() => setShowExitConfirm(false)}
            variant="confirm"
            confirmLabel="Leave"
            cancelLabel="Stay"
            onConfirm={() => { setShowExitConfirm(false); onClose(); navigate('/', { replace: true }) }}
          >
            <p>Unsaved progress will be lost. Are you sure?</p>
          </Modal>
        )}
        {showRestartConfirm && (
          <Modal
            title="Restart Strategy Mode?"
            isOpen={showRestartConfirm}
            onClose={() => setShowRestartConfirm(false)}
            variant="confirm"
            confirmLabel="Restart"
            cancelLabel="Cancel"
            onConfirm={handleRestartStrategy}
          >
            <p>This will reset the city state but preserve detective progress. Are you sure?</p>
          </Modal>
        )}
        {showResetConfirm && (
          <Modal
            title="Confirm Reset"
            isOpen={showResetConfirm}
            onClose={() => setShowResetConfirm(false)}
            variant="confirm"
            confirmLabel="Reset"
            cancelLabel="Cancel"
            onConfirm={handleReset}
          >
            This will erase all case progress and strategy state. Are you sure?
          </Modal>
        )}
      </div>
    </Modal>
  )
}
