import { describe, it, expect, beforeEach } from 'vitest'
import { useCaseStateStore } from './CaseState'

beforeEach(() => {
  useCaseStateStore.getState().reset()
})

describe('useCaseStateStore', () => {
  it('initializes to intro with frame index 0', () => {
    const state = useCaseStateStore.getState()
    expect(state.phase).toBe('intro')
    expect(state.introFrameIndex).toBe(0)
  })

  it('autoAdvance walks through all 5 states intro→investigation→evidence→verdict→debrief', () => {
    const store = useCaseStateStore.getState

    store().autoAdvance()
    expect(store().phase).toBe('investigation')

    store().autoAdvance()
    expect(store().phase).toBe('evidence')

    store().autoAdvance()
    expect(store().phase).toBe('verdict')

    store().autoAdvance()
    expect(store().phase).toBe('debrief')
  })

  it('autoAdvance at debrief is a no-op', () => {
    const store = useCaseStateStore.getState
    store().autoAdvance()
    store().autoAdvance()
    store().autoAdvance()
    store().autoAdvance()
    expect(store().phase).toBe('debrief')

    store().autoAdvance()
    expect(store().phase).toBe('debrief')
  })

  it('advanceTo succeeds for each valid forward transition', () => {
    const store = useCaseStateStore.getState

    store().advanceTo('investigation')
    expect(store().phase).toBe('investigation')

    store().advanceTo('evidence')
    expect(store().phase).toBe('evidence')

    store().advanceTo('verdict')
    expect(store().phase).toBe('verdict')

    store().advanceTo('debrief')
    expect(store().phase).toBe('debrief')
  })

  it('advanceTo skips are silently rejected', () => {
    const store = useCaseStateStore.getState

    store().advanceTo('verdict')
    expect(store().phase).toBe('intro')

    store().advanceTo('evidence')
    expect(store().phase).toBe('intro')

    store().advanceTo('debrief')
    expect(store().phase).toBe('intro')
  })

  it('advanceTo backward is silently rejected', () => {
    const store = useCaseStateStore.getState
    store().advanceTo('investigation')

    store().advanceTo('intro')
    expect(store().phase).toBe('investigation')
  })

  it('advanceTo from debrief to anything is rejected', () => {
    const store = useCaseStateStore.getState
    store().advanceTo('investigation')
    store().advanceTo('evidence')
    store().advanceTo('verdict')
    store().advanceTo('debrief')

    store().advanceTo('intro')
    expect(store().phase).toBe('debrief')

    store().advanceTo('investigation')
    expect(store().phase).toBe('debrief')

    store().advanceTo('evidence')
    expect(store().phase).toBe('debrief')

    store().advanceTo('verdict')
    expect(store().phase).toBe('debrief')
  })

  it('advanceTo resets introFrameIndex to 0', () => {
    const store = useCaseStateStore.getState
    store().nextIntroFrame()
    store().nextIntroFrame()
    expect(store().introFrameIndex).toBe(2)

    store().advanceTo('investigation')
    expect(store().introFrameIndex).toBe(0)
  })

  it('nextIntroFrame increments the frame index', () => {
    const store = useCaseStateStore.getState

    store().nextIntroFrame()
    expect(store().introFrameIndex).toBe(1)

    store().nextIntroFrame()
    expect(store().introFrameIndex).toBe(2)
  })

  it('reset returns to initial state', () => {
    const store = useCaseStateStore.getState
    store().advanceTo('investigation')
    store().nextIntroFrame()

    store().reset()
    expect(store().phase).toBe('intro')
    expect(store().introFrameIndex).toBe(0)
  })
})
