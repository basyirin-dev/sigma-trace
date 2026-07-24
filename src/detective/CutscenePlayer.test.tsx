import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { CutscenePlayer } from './CutscenePlayer'
import { useCaseStateStore } from './CaseState'
import type { CutsceneFrame } from './CaseLoader'

const CHAR_INTERVAL = 30
const SKIP_DELAY = 2000

const twoFrames: CutsceneFrame[] = [
  { text: 'Hello world', duration: 5000 },
  { text: 'Second frame', duration: 4000 },
]

const fourFrames: CutsceneFrame[] = [
  { text: 'Frame one text', duration: 500 },
  { text: 'Frame two text', duration: 500 },
  { text: 'Frame three text', duration: 500 },
  { text: 'Frame four text', duration: 500 },
]

beforeEach(() => {
  useCaseStateStore.getState().reset()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

function typewriterTime(text: string) {
  return text.length * CHAR_INTERVAL
}

describe('CutscenePlayer', () => {
  it('returns null when frames array is empty', () => {
    const { container } = render(<CutscenePlayer frames={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders case title when provided', () => {
    render(<CutscenePlayer frames={twoFrames} caseTitle="The Viral Mayor" />)
    expect(screen.getByTestId('cutscene-title')).toHaveTextContent('The Viral Mayor')
  })

  it('renders first frame text with typewriter partially revealed', () => {
    render(<CutscenePlayer frames={twoFrames} />)
    const textContent = () => screen.getByTestId('cutscene-text-content').textContent
    expect(textContent()).toBe('')

    act(() => {
      vi.advanceTimersByTime(CHAR_INTERVAL * 5)
    })
    expect(textContent()).toBe('Hello')
  })

  it('typewriter reveals all characters over time', () => {
    render(<CutscenePlayer frames={twoFrames} />)

    act(() => {
      vi.advanceTimersByTime(typewriterTime('Hello world'))
    })
    expect(screen.getByTestId('cutscene-text-content').textContent).toBe('Hello world')
  })

  it('cursor is visible during typing and hidden after', () => {
    render(<CutscenePlayer frames={twoFrames} />)
    expect(screen.getByTestId('cursor')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(typewriterTime('Hello world'))
    })
    expect(screen.queryByTestId('cursor')).not.toBeInTheDocument()
  })

  it('shows frame progress indicator', () => {
    render(<CutscenePlayer frames={twoFrames} />)
    expect(screen.getByTestId('progress')).toHaveTextContent('Frame 1 / 2')
  })

  it('progress updates on frame advance', () => {
    render(<CutscenePlayer frames={twoFrames} />)
    act(() => {
      vi.advanceTimersByTime(typewriterTime('Hello world'))
    })
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('progress')).toHaveTextContent('Frame 2 / 2')
  })

  it('click advances to next frame', () => {
    render(<CutscenePlayer frames={twoFrames} />)
    act(() => {
      vi.advanceTimersByTime(typewriterTime('Hello world'))
    })

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(useCaseStateStore.getState().introFrameIndex).toBe(1)
  })

  it('skip button appears after 2 seconds', () => {
    render(<CutscenePlayer frames={twoFrames} />)
    expect(screen.queryByTestId('skip-area')).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(SKIP_DELAY)
    })
    expect(screen.getByTestId('skip-area')).toBeInTheDocument()
  })

  it('click on skip transitions to investigation', () => {
    render(<CutscenePlayer frames={twoFrames} />)

    act(() => {
      vi.advanceTimersByTime(SKIP_DELAY)
    })
    act(() => {
      screen.getByTestId('skip-button').click()
    })

    expect(screen.queryByTestId('cutscene-overlay')).not.toBeInTheDocument()
    expect(useCaseStateStore.getState().phase).toBe('investigation')
  })

  it('last frame auto-advances to investigation', () => {
    render(<CutscenePlayer frames={twoFrames} />)

    act(() => {
      vi.advanceTimersByTime(typewriterTime('Hello world'))
    })
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(useCaseStateStore.getState().introFrameIndex).toBe(1)

    act(() => {
      vi.advanceTimersByTime(typewriterTime('Second frame'))
    })
    act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(screen.queryByTestId('cutscene-overlay')).not.toBeInTheDocument()
    expect(useCaseStateStore.getState().phase).toBe('investigation')
  })

  it('advances via keyboard Enter key', () => {
    render(<CutscenePlayer frames={twoFrames} />)
    act(() => {
      vi.advanceTimersByTime(typewriterTime('Hello world'))
    })

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    })

    expect(useCaseStateStore.getState().introFrameIndex).toBe(1)
  })

  it('advances via keyboard Space key', () => {
    render(<CutscenePlayer frames={twoFrames} />)
    act(() => {
      vi.advanceTimersByTime(typewriterTime('Hello world'))
    })

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
    })

    expect(useCaseStateStore.getState().introFrameIndex).toBe(1)
  })

  it('renders all 4 frames for a 4-frame cutscene then transitions', () => {
    render(<CutscenePlayer frames={fourFrames} />)

    for (let i = 0; i < fourFrames.length; i++) {
      const frame = fourFrames[i]!
      act(() => {
        vi.advanceTimersByTime(typewriterTime(frame.text))
      })
      expect(screen.getByTestId('cutscene-text').textContent).toBe(frame.text)
      expect(screen.getByTestId('progress')).toHaveTextContent(
        `Frame ${i + 1} / ${fourFrames.length}`,
      )
      act(() => {
        vi.advanceTimersByTime(frame.duration)
      })
    }

    expect(screen.queryByTestId('cutscene-overlay')).not.toBeInTheDocument()
    expect(useCaseStateStore.getState().phase).toBe('investigation')
  })

  it('handles single-frame cutscene', () => {
    const single: CutsceneFrame[] = [{ text: 'Only frame', duration: 2000 }]
    render(<CutscenePlayer frames={single} />)

    act(() => {
      vi.advanceTimersByTime(typewriterTime('Only frame'))
    })
    expect(screen.getByTestId('cutscene-text').textContent).toBe('Only frame')

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.queryByTestId('cutscene-overlay')).not.toBeInTheDocument()
    expect(useCaseStateStore.getState().phase).toBe('investigation')
  })
})
