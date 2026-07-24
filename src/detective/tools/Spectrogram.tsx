import { useRef, useState, useEffect, useCallback } from 'react'

export interface SpectrogramProps {
  audioSrc: string
}

const FFT_SIZE = 256
const FREQ_BANDS = 32

export function Spectrogram({ audioSrc }: SpectrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animRef = useRef<number>(0)
  const [playing, setPlaying] = useState(false)
  const [finding, setFinding] = useState<string | null>(null)

  const initAudio = useCallback(() => {
    if (ctxRef.current) return
    const audio = audioRef.current
    if (!audio) return

    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = FFT_SIZE

    const source = ctx.createMediaElementSource(audio)
    source.connect(analyser)
    analyser.connect(ctx.destination)

    ctxRef.current = ctx
    analyserRef.current = analyser
  }, [])

  const drawRef = useRef<() => void>(() => {})

  useEffect(() => {
    drawRef.current = () => {
      const analyser = analyserRef.current
      const canvas = canvasRef.current
      if (!analyser || !canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = canvas.width / FREQ_BANDS
      const step = Math.floor(bufferLength / FREQ_BANDS)

      for (let i = 0; i < FREQ_BANDS; i++) {
        let sum = 0
        for (let j = 0; j < step; j++) {
          sum += dataArray[i * step + j] ?? 0
        }
        const avg = sum / step
        const h = (avg / 255) * canvas.height

        const isSuspicious = i >= 8 && i <= 16
        ctx.fillStyle = isSuspicious
          ? `rgba(255, ${Math.round(170 - avg)}, 0, ${0.4 + avg / 510})`
          : `rgba(${Math.round(100 + avg * 0.4)}, ${Math.round(200 - avg * 0.4)}, 255, ${0.3 + avg / 510})`

        ctx.fillRect(i * barWidth, canvas.height - h, barWidth - 1, h)
      }

      ctx.fillStyle = 'rgba(255,68,68,0.6)'
      ctx.fillRect(8 * barWidth, 0, 9 * barWidth, canvas.height)
      ctx.fillStyle = '#ff4444'
      ctx.font = '11px monospace'
      ctx.fillText('AI ARTIFACT ZONE', 8 * barWidth + 4, 14)

      animRef.current = requestAnimationFrame(() => drawRef.current?.())
    }
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    initAudio()

    const audioCtx = ctxRef.current
    if (audioCtx?.state === 'suspended') {
      void audioCtx.resume()
    }

    if (audio.paused) {
      void audio.play()
      setPlaying(true)
      animRef.current = requestAnimationFrame(() => drawRef.current?.())
    } else {
      audio.pause()
      setPlaying(false)
      cancelAnimationFrame(animRef.current)
    }
  }, [initAudio])

  useEffect(() => {
    const audio = audioRef.current
    return () => {
      cancelAnimationFrame(animRef.current)
      if (audio) {
        audio.pause()
      }
    }
  }, [])

  const handleAnalysis = useCallback(() => {
    setFinding('The 2-4kHz frequency range shows unusually consistent energy distribution with periodic troughs — a signature of AI-generated speech. Human voices have natural micro-variations in this range that the synthesis model failed to replicate.')
  }, [])

  return (
    <div data-testid="tool-spectrogram" style={{ padding: '16px' }}>
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setPlaying(false)}
        preload="auto"
      />

      <canvas
        ref={canvasRef}
        width={600}
        height={240}
        data-testid="spec-canvas"
        style={{
          width: '100%',
          height: '240px',
          background: '#0a0a1a',
          borderRadius: '8px',
          display: 'block',
        }}
      />

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button onClick={togglePlay} data-testid="spec-play" style={btnStyle}>
          {playing ? '⏹ Stop' : '▶ Analyze Audio'}
        </button>
        <button onClick={handleAnalysis} data-testid="spec-analyze" style={btnStyle}>
          Run Analysis
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#666' }}>
        <span>0 Hz</span>
        <span style={{ color: '#ff4444' }}>2 kHz — AI Artifact Zone — 4 kHz</span>
        <span>8 kHz</span>
      </div>

      {finding && (
        <div
          data-testid="spec-finding"
          style={{
            marginTop: '12px',
            padding: '12px',
            background: 'rgba(46, 204, 113, 0.15)',
            borderLeft: '3px solid #2ecc71',
            borderRadius: '4px',
            color: '#2ecc71',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          🔍 {finding}
        </div>
      )}
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  background: '#2a2a4a',
  color: '#fff',
  border: '1px solid #4a4a8a',
  borderRadius: '6px',
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: '14px',
}
