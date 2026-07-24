import { describe, it, expect } from 'vitest'
import { stepFrame, FPS, MOUTH_ZONE, EYE_LEFT_ZONE, EYE_RIGHT_ZONE, DEFAULT_WIDTH, DEFAULT_HEIGHT } from './FrameStepper'

describe('FrameStepper constants', () => {
  it('has defined frame rate', () => {
    expect(FPS).toBe(30)
  })

  it('has defined zones for facial regions', () => {
    expect(MOUTH_ZONE).toBeDefined()
    expect(EYE_LEFT_ZONE).toBeDefined()
    expect(EYE_RIGHT_ZONE).toBeDefined()
  })

  it('has default dimensions', () => {
    expect(DEFAULT_WIDTH).toBe(640)
    expect(DEFAULT_HEIGHT).toBe(360)
  })
})

describe('stepFrame', () => {
  function createMockVideo(currentTime = 30, duration = 60): HTMLVideoElement {
    return {
      currentTime,
      duration,
      pause: () => {},
    } as unknown as HTMLVideoElement
  }

  it('advances forward by 1 frame', () => {
    const video = createMockVideo(30, 60)
    const result = stepFrame(video, 1, 30)
    expect(result.totalFrames).toBe(1800)
  })

  it('reverses by 1 frame', () => {
    const video = createMockVideo(30, 60)
    const result = stepFrame(video, -1, 30)
    expect(result.totalFrames).toBe(1800)
  })

  it('pauses the video', () => {
    let paused = false
    const video = createMockVideo(30, 60)
    video.pause = () => { paused = true }
    stepFrame(video, 1, 30)
    expect(paused).toBe(true)
  })
})
