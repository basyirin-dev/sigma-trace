import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToolTutorialOverlay, type ToolTutorialOverlayProps } from './ToolTutorialOverlay'
import { TOOL_TUTORIALS } from './toolTutorials'

function renderOverlay(props?: Partial<ToolTutorialOverlayProps>) {
  const defaultProps: ToolTutorialOverlayProps = {
    toolId: 'spectrogram',
    toolName: 'Spectrogram',
    toolIcon: '\u266A',
    isOpen: true,
    onDismiss: vi.fn(),
    ...props,
  }
  return render(<ToolTutorialOverlay {...defaultProps} />)
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('ToolTutorialOverlay', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ToolTutorialOverlay
        toolId="spectrogram"
        toolName="Spectrogram"
        toolIcon="♪"
        isOpen={false}
        onDismiss={vi.fn()}
      />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders tool name', () => {
    renderOverlay({ toolName: 'Frame Stepper' })
    expect(screen.getByTestId('tutorial-tool-name')).toHaveTextContent('Frame Stepper')
  })

  it('renders the tip text for spectrogram', () => {
    renderOverlay({ toolId: 'spectrogram' })
    const tip = TOOL_TUTORIALS['spectrogram']!.tip
    expect(screen.getByText(tip)).toBeInTheDocument()
  })

  it('renders the tip text for frame-stepper', () => {
    renderOverlay({ toolId: 'frame-stepper', toolName: 'Frame Stepper' })
    const tip = TOOL_TUTORIALS['frame-stepper']!.tip
    expect(screen.getByText(tip)).toBeInTheDocument()
  })

  it('renders all indicators for a tool', () => {
    renderOverlay({ toolId: 'timeline-cross-referencer', toolName: 'Timeline Cross-Referencer' })
    const tutorial = TOOL_TUTORIALS['timeline-cross-referencer']!
    const indicators = screen.getByTestId('tutorial-indicators')
    expect(indicators.children.length).toBe(tutorial.indicators.length)
  })

  it('each indicator renders its text', () => {
    renderOverlay()
    const tutorial = TOOL_TUTORIALS['spectrogram']!
    for (let i = 0; i < tutorial.indicators.length; i++) {
      expect(screen.getByTestId(`tutorial-indicator-${i}`)).toHaveTextContent(tutorial.indicators[i]!)
    }
  })

  it('renders Got it button', () => {
    renderOverlay()
    expect(screen.getByTestId('got-it-btn')).toBeInTheDocument()
    expect(screen.getByText('Got it')).toBeInTheDocument()
  })

  it('fires onDismiss when Got it clicked', async () => {
    const onDismiss = vi.fn()
    renderOverlay({ onDismiss })
    await userEvent.click(screen.getByTestId('got-it-btn'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('fires onDismiss on Escape key', async () => {
    const onDismiss = vi.fn()
    renderOverlay({ onDismiss })
    await userEvent.keyboard('{Escape}')
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('renders the What to look for badge', () => {
    renderOverlay()
    expect(screen.getByText('What to look for')).toBeInTheDocument()
  })

  it('renders the Did you know prefix', () => {
    renderOverlay()
    expect(screen.getByText('Did you know?')).toBeInTheDocument()
  })
})

describe('TOOL_TUTORIALS', () => {
  it('has entries for all 6 tools', () => {
    const toolIds = ['spectrogram', 'frame-stepper', 'metadata-inspector', 'source-tracer', 'inconsistency-highlighter', 'timeline-cross-referencer']
    for (const id of toolIds) {
      expect(TOOL_TUTORIALS[id]).toBeDefined()
    }
  })

  it('each tutorial has tip and at least 1 indicator', () => {
    for (const [, tutorial] of Object.entries(TOOL_TUTORIALS)) {
      expect(tutorial.tip.length).toBeGreaterThan(0)
      expect(tutorial.indicators.length).toBeGreaterThanOrEqual(1)
      for (const item of tutorial.indicators) {
        expect(item.length).toBeGreaterThan(0)
      }
    }
  })
})
