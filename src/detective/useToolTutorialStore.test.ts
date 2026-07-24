import { describe, it, expect, beforeEach } from 'vitest'
import { useToolTutorialStore } from './useToolTutorialStore'

beforeEach(() => {
  useToolTutorialStore.getState().reset()
})

describe('useToolTutorialStore', () => {
  it('initializes with empty dismissed array', () => {
    const state = useToolTutorialStore.getState()
    expect(state.dismissed).toEqual([])
  })

  it('dismiss adds a tool ID to the dismissed array', () => {
    useToolTutorialStore.getState().dismiss('spectrogram')
    const state = useToolTutorialStore.getState()
    expect(state.dismissed).toContain('spectrogram')
  })

  it('dismiss does not duplicate tool IDs', () => {
    const store = useToolTutorialStore.getState()
    store.dismiss('spectrogram')
    store.dismiss('spectrogram')
    const state = useToolTutorialStore.getState()
    expect(state.dismissed.filter((id) => id === 'spectrogram').length).toBe(1)
  })

  it('dismiss multiple tools accumulates correctly', () => {
    const store = useToolTutorialStore.getState()
    store.dismiss('spectrogram')
    store.dismiss('frame-stepper')
    store.dismiss('metadata-inspector')
    const state = useToolTutorialStore.getState()
    expect(state.dismissed).toEqual(['spectrogram', 'frame-stepper', 'metadata-inspector'])
  })

  it('reset clears all dismissed tools', () => {
    const store = useToolTutorialStore.getState()
    store.dismiss('spectrogram')
    store.dismiss('frame-stepper')
    store.reset()
    const state = useToolTutorialStore.getState()
    expect(state.dismissed).toEqual([])
  })

  it('resetForTool removes single tool from dismissed', () => {
    const store = useToolTutorialStore.getState()
    store.dismiss('spectrogram')
    store.dismiss('frame-stepper')
    store.resetForTool('spectrogram')
    const state = useToolTutorialStore.getState()
    expect(state.dismissed).not.toContain('spectrogram')
    expect(state.dismissed).toContain('frame-stepper')
  })

  it('resetForTool with non-dismissed tool is a no-op', () => {
    useToolTutorialStore.getState().resetForTool('spectrogram')
    const state = useToolTutorialStore.getState()
    expect(state.dismissed).toEqual([])
  })
})
