import { useEffect, useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/Button'
import { Modal } from '@shared/Modal'
import { playMusic, stopMusic } from '@shared/useAudioManager'
import { hasSave, loadGame, clearSave, getSaveMeta, getSaveRecords } from '@shared/saveManager'
import { computeCompositeGrade, GRADE_COLORS } from '@shared/badgeUtils'
import styles from './TitleScreen.module.css'

const MINUTE = 60_000
const HOUR = 3_600_000

function formatTimeAgo(ts: number): string {
  const elapsed = Date.now() - ts
  if (elapsed < MINUTE) return 'just now'
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)} min ago`
  if (elapsed < 24 * HOUR) return `${Math.floor(elapsed / HOUR)}h ago`
  return `${Math.floor(elapsed / (24 * HOUR))}d ago`
}

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  alpha: number
  color: string
}

export function TitleScreen() {
  const navigate = useNavigate()
  const [showAbout, setShowAbout] = useState(false)
  const [showCredits, setShowCredits] = useState(false)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false)
  const [showCorruptSave, setShowCorruptSave] = useState(false)
  const [showRecords, setShowRecords] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])

  const saveMeta = useMemo(() => getSaveMeta(), [])
  const saveRecords = useMemo(() => getSaveRecords(), [])

  useEffect(() => {
    playMusic('title-bg.mp3')
    return () => stopMusic()
  }, [])

  useEffect(() => {
    const cvs = canvasRef.current!
    if (!cvs) return
    const ctx = cvs.getContext('2d')!
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight
    cvs.width = w * dpr
    cvs.height = h * dpr
    ctx.scale(dpr, dpr)

    let mouseX = 0
    let mouseY = 0

    const seed = 42
    let rng = seed
    function rand(): number {
      rng = (rng * 16807) % 2147483647
      return rng / 2147483647
    }

    const accentSquares: Array<{ x: number; y: number; size: number; color: string }> = []
    for (let i = 0; i < 18; i++) {
      accentSquares.push({
        x: rand() * cvs.width,
        y: rand() * cvs.height,
        size: 12 + Math.floor(rand() * 10),
        color: i % 3 === 0 ? 'rgba(0, 137, 123,' : 'rgba(255, 179, 0,',
      })
    }

    particlesRef.current = []
    for (let i = 0; i < 70; i++) {
      particlesRef.current.push({
        x: rand() * cvs.width,
        y: rand() * cvs.height,
        size: 1 + Math.floor(rand() * 2),
        speed: 0.2 + rand() * 0.4,
        alpha: 0.04 + rand() * 0.08,
        color: i % 2 === 0 ? '#ffffff' : '#FFB300',
      })
    }

    function drawPattern(dw: number, dh: number) {
      const ox = (mouseX / w - 0.5) * 12
      const oy = (mouseY / h - 0.5) * 8
      for (let row = 0; row < dh; row += 14) {
        for (let col = 0; col < dw; col += 14) {
          const isDiamond = ((row / 14 + col / 14) % 2) < 0.3
          const sz = 4 + ((row * 3 + col * 7) % 5)
          const colorIdx = (row * 5 + col * 3) % 3
          const color = colorIdx === 0
            ? `rgba(26, 35, 126, ${0.03 + (sz - 4) * 0.008})`
            : colorIdx === 1
              ? `rgba(0, 137, 123, ${0.04 + (sz - 4) * 0.006})`
              : `rgba(255, 179, 0, ${0.03 + (sz - 4) * 0.005})`

          ctx.fillStyle = color
          if (isDiamond) {
            ctx.save()
            ctx.translate(col + 7 + ox, row + 7 + oy)
            ctx.rotate(Math.PI / 4)
            ctx.fillRect(-sz / 2, -sz / 2, sz, sz)
            ctx.restore()
          } else {
            ctx.fillRect(col + ox, row + oy, sz, sz)
          }
        }
      }

      for (const sq of accentSquares) {
        ctx.fillStyle = sq.color + '0.12)'
        ctx.fillRect(sq.x + ox * 0.5, sq.y + oy * 0.5, sq.size, sq.size)
      }
    }

    function animate() {
      const cw = window.innerWidth
      const ch = window.innerHeight
      ctx.clearRect(0, 0, cw, ch)
      drawPattern(cw, ch)

      for (const p of particlesRef.current) {
        p.y -= p.speed
        if (p.y + p.size < 0) {
          p.y = ch + p.size
          p.x = rand() * cw
        }
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }
      ctx.globalAlpha = 1

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', onMouseMove)

    function onResize() {
      cvs.width = window.innerWidth
      cvs.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  function handleNewGame() {
    if (hasSave()) {
      setShowNewGameConfirm(true)
    } else {
      navigate('/strategy')
    }
  }

  function handleConfirmNewGame() {
    clearSave()
    setShowNewGameConfirm(false)
    navigate('/strategy')
  }

  function handleContinue() {
    const restored = loadGame()
    if (!restored) {
      setShowCorruptSave(true)
    } else {
      navigate('/strategy')
    }
  }

  function handleDeleteAndStart() {
    clearSave()
    setShowCorruptSave(false)
    navigate('/strategy')
  }

  return (
    <div className={styles.root}>
      <canvas
        ref={canvasRef}
        className={styles.bgCanvas}
        data-testid="bg-canvas"
      />

      <div className={styles.content}>
        <img
          src="/assets/logo/GIHA-Logo.svg"
          alt="GIHA Logo"
          className={styles.logo}
        />

        <p className={styles.subtitle}>
          A Two-Mode Game for Media &amp; Information Literacy
        </p>

        <div className={styles.buttons}>
          <Button onClick={handleNewGame}>New Game</Button>
          {hasSave() && (
            <Button variant="primary" onClick={handleContinue}>
              Continue{saveMeta ? ` (${formatTimeAgo(saveMeta.timestamp)})` : ''}
            </Button>
          )}
          {saveRecords && (saveRecords.earnedBadges.length > 0 || Object.keys(saveRecords.bestCaseResults).length > 0) && (
            <Button variant="ghost" onClick={() => setShowRecords(true)}>
              Records
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowHowToPlay(true)}>
            How to Play
          </Button>
          <Button variant="ghost" onClick={() => setShowAbout(true)}>
            About
          </Button>
          <Button variant="ghost" onClick={() => setShowCredits(true)}>
            Credits
          </Button>
        </div>

        <p className={styles.credit}>
          Inspired by the &#x3A3;-Model &mdash; a dynamical systems theory of information ecosystems
        </p>
      </div>

      {showNewGameConfirm && (
        <Modal
          title="Start New Game?"
          isOpen={showNewGameConfirm}
          onClose={() => setShowNewGameConfirm(false)}
        >
          <p>A saved game exists. Starting a new game will delete it.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setShowNewGameConfirm(false)}>Cancel</Button>
            <Button onClick={handleConfirmNewGame}>Start Fresh</Button>
          </div>
        </Modal>
      )}

      {showCorruptSave && (
        <Modal
          title="Save Data Error"
          isOpen={showCorruptSave}
          onClose={() => setShowCorruptSave(false)}
        >
          <p>Your save data could not be loaded. It may be from a different version or corrupted.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setShowCorruptSave(false)}>Cancel</Button>
            <Button onClick={handleDeleteAndStart}>Delete &amp; Start Fresh</Button>
          </div>
        </Modal>
      )}

      {showHowToPlay && (
        <Modal title="How to Play" isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)}>
          <p><strong>STRATEGY MODE</strong></p>
          <p style={{ marginTop: 6, marginBottom: 12 }}>
            Monitor &#x3A3; (coherence) and R&#x2080; (spread rate) in the HUD. Deploy interventions
            from your budget to reduce R&#x2080; and boost &#x3A3;. Keep &#x3A3; above 40 and R&#x2080; below 1.5
            to prevent city collapse.
          </p>
          <p><strong>DETECTIVE MODE</strong></p>
          <p style={{ marginTop: 6, marginBottom: 12 }}>
            Investigate evidence items using 6 forensic tools. Connect related evidence
            on the board to build your case. Submit your verdict with a written justification.
          </p>
          <p><strong>WIN CONDITION</strong></p>
          <p style={{ marginTop: 6 }}>
            Successfully solve all 3 disinformation cases while keeping the city of Veritas
            resilient to attacks.
          </p>
        </Modal>
      )}

      {showAbout && (
        <Modal title="About GIHA" isOpen={showAbout} onClose={() => setShowAbout(false)}>
          <p>
            GIHA is an interactive simulation game that puts you in the role of a
            digital forensics investigator at the Global Information Health Agency.
          </p>
          <p style={{ marginTop: 12 }}>
            Your mission: protect the city of Veritas from coordinated disinformation
            campaigns. Monitor information health metrics, deploy interventions, and
            investigate fabricated evidence &mdash; before the city falls into the sigma-trap.
          </p>
          <p style={{ marginTop: 12 }}>
            Switch between Strategy Mode (city-wide simulation) and Detective Mode
            (forensic case analysis) to combat disinformation on every front.
          </p>
          <p style={{ marginTop: 12, fontStyle: 'italic', color: '#888' }}>
            Built for the UNESCO Youth Hackathon 2026.
          </p>
        </Modal>
      )}

      {showCredits && (
        <Modal title="Credits" isOpen={showCredits} onClose={() => setShowCredits(false)}>
          <p><strong>GIHA &mdash; Global Information Health Agency</strong></p>
          <p style={{ marginTop: 8 }}>
            Created for the <strong>UNESCO Youth Hackathon 2026</strong>
          </p>
          <p style={{ marginTop: 12 }}>
            <strong>Team</strong><br />
            M1 &mdash; AI/Research: ODE engine, strategy simulation, interventions<br />
            M2 &mdash; Security/Dev: Scaffold, detective mode, forensics, CI/CD
          </p>
          <p style={{ marginTop: 12 }}>
            <strong>Tech Stack</strong><br />
            React 19, TypeScript 6, Vite 8, Canvas2D, Zustand, Vitest
          </p>
          <p style={{ marginTop: 12 }}>
            <strong>Assets</strong><br />
            Pixel Art Top Down Tileset &mdash; Cainos/Penusbmic (Unity Asset Store)<br />
            Industrial Tileset &mdash; stalkerfish.itch.io<br />
            Mini-World Sprites &mdash; lnsanity.itch.io<br />
            Pixel Crawler Free Pack &mdash; Anokolisa<br />
            32rogues Pack &mdash; Seth Boyles (2024)<br />
            Complete UI Essential Pack &mdash; Crusenho Agus Hennihuno (CC BY 4.0)<br />
            Dungeon Tileset II &mdash; 0x72<br />
            BoldPixels Font &mdash; YukiPixels (CC BY-SA 4.0)
          </p>
          <p style={{ marginTop: 12, color: '#888' }}>
            Hosted on Netlify. Open source.
          </p>
        </Modal>
      )}

      {showRecords && saveRecords && (() => {
        const compositeGrade = computeCompositeGrade(saveRecords.bestCaseResults, saveRecords.completedCases)
        const gradeColor = GRADE_COLORS[compositeGrade] ?? '#e74c3c'
        return (
          <Modal title="Records" isOpen={showRecords} onClose={() => setShowRecords(false)}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: gradeColor, fontFamily: 'monospace' }}>
                {compositeGrade}
              </div>
              <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>
                Best Composite Grade
              </div>
            </div>

            {saveRecords.earnedBadges.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: '#4ecdc4', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                  Badges Earned
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {saveRecords.earnedBadges.map((badgeId) => {
                    const labels: Record<string, { name: string; icon: string }> = {
                      'fact-checker': { name: 'Fact Checker', icon: '\uD83D\uDD0D' },
                      'deepfake-hunter': { name: 'Deepfake Hunter', icon: '\uD83C\uDFAC' },
                      'voice-of-truth': { name: 'Voice of Truth', icon: '\uD83D\uDCDE' },
                      'master-analyst': { name: 'Master Analyst', icon: '\uD83C\uDFC6' },
                    }
                    const b = labels[badgeId] ?? { name: badgeId, icon: '\uD83C\uDF1F' }
                    return (
                      <span key={badgeId} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px', background: 'rgba(78,205,196,0.1)',
                        border: '1px solid rgba(78,205,196,0.3)', borderRadius: 20,
                        fontSize: 12, fontFamily: 'monospace', color: '#4ecdc4',
                      }}>
                        <span>{b.icon}</span>
                        <span>{b.name}</span>
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {Object.keys(saveRecords.bestCaseResults).length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                  Best Case Grades
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['case-01', 'case-02', 'case-03'].map((caseId) => {
                    const grade = saveRecords.bestCaseResults[caseId]
                    const labels: Record<string, string> = { 'case-01': 'Case 1', 'case-02': 'Case 2', 'case-03': 'Case 3' }
                    return (
                      <div key={caseId} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '6px 10px', background: 'var(--color-surface-alt, #1a1a2e)',
                        border: '1px solid #333', borderRadius: 6,
                        fontFamily: 'monospace', fontSize: 13,
                      }}>
                        <span style={{ color: '#aaa' }}>{labels[caseId]}</span>
                        <span style={{ color: grade ? GRADE_COLORS[grade] ?? '#e74c3c' : '#555', fontWeight: 700 }}>
                          {grade ?? '\u2014'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </Modal>
        )
      })()}
    </div>
  )
}
