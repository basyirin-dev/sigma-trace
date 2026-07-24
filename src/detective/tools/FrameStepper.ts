export const FPS = 30
export const DEFAULT_WIDTH = 640
export const DEFAULT_HEIGHT = 360
export const EDGE_THRESHOLD = 100
export const ANOMALY_MAGNITUDE_THRESHOLD = 128
export const ANOMALY_DENSITY_THRESHOLD = 0.15

export const MOUTH_ZONE = { x: 0.30, y: 0.45, w: 0.40, h: 0.25 } as const
export const EYE_LEFT_ZONE = { x: 0.15, y: 0.15, w: 0.25, h: 0.20 } as const
export const EYE_RIGHT_ZONE = { x: 0.60, y: 0.15, w: 0.25, h: 0.20 } as const

export interface AnomalyRegion {
  x: number
  y: number
  width: number
  height: number
  label: string
  confidence: number
}

export interface StepResult {
  currentFrame: number
  totalFrames: number
}

export function stepFrame(
  video: HTMLVideoElement,
  direction: -1 | 1,
  fps: number = FPS,
): StepResult {
  video.pause()

  const stepSec = direction * (1 / fps)
  const newTime = Math.max(0, Math.min(video.duration, video.currentTime + stepSec))
  video.currentTime = newTime

  return {
    currentFrame: Math.floor(video.currentTime * fps),
    totalFrames: Math.floor(video.duration * fps),
  }
}
