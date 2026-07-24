import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToolResultModal, type ToolResultModalProps } from './ToolResultModal'
import type { ToolResult } from './tools/types'

function makeResult(overrides?: Partial<ToolResult>): ToolResult {
  return {
    findings: ['The 2-4kHz range shows AI speech artifacts', 'Human voice micro-variations absent'],
    confidence: 0.78,
    evidenceId: 'evidence-01',
    timestamp: Date.now(),
    ...overrides,
  }
}

function renderModal(props?: Partial<ToolResultModalProps>) {
  const defaultProps: ToolResultModalProps = {
    toolName: 'Spectrogram',
    toolIcon: '\u266A',
    evidenceLabel: 'Audio Evidence',
    result: makeResult(),
    isOpen: true,
    onClose: vi.fn(),
    analyzeDelayMs: 0,
    ...props,
  }
  return render(<ToolResultModal {...defaultProps} />)
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('ToolResultModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ToolResultModal
      toolName="Test"
      toolIcon="♪"
      evidenceLabel="Test"
      result={makeResult()}
      isOpen={false}
      onClose={vi.fn()}
    />)
    expect(container.innerHTML).toBe('')
  })

  it('renders tool name and icon in the header', () => {
    renderModal({ toolName: 'Frame Stepper', toolIcon: '\u25B6' })
    expect(screen.getByTestId('tool-name')).toHaveTextContent('Frame Stepper')
    expect(screen.getByTestId('tool-icon')).toHaveTextContent('\u25B6')
  })

  it('renders evidence label in the header', () => {
    renderModal({ evidenceLabel: 'Mayor Video Evidence' })
    expect(screen.getByTestId('evidence-label')).toHaveTextContent('Mayor Video Evidence')
  })

  it('renders confidence percentage text', () => {
    renderModal({ result: makeResult({ confidence: 0.85 }) })
    expect(screen.getByTestId('confidence-section')).toHaveTextContent('85%')
  })

  it('renders confidence bar with animated width', async () => {
    renderModal({ result: makeResult({ confidence: 0.78 }), analyzeDelayMs: 0 })
    const bar = screen.getByTestId('confidence-bar')
    expect(bar).toBeInTheDocument()
    await waitFor(() => {
      expect(bar.style.width).toBe('78%')
    })
  })

  it('renders correct number of finding cards', () => {
    const findings = ['Finding one', 'Finding two', 'Finding three']
    renderModal({ result: makeResult({ findings }) })
    for (let i = 0; i < findings.length; i++) {
      expect(screen.getByTestId(`finding-card-${i}`)).toBeInTheDocument()
    }
  })

  it('each card renders the finding text', () => {
    const findings = ['First analysis result', 'Second analysis result']
    renderModal({ result: makeResult({ findings }) })
    expect(screen.getByText('First analysis result')).toBeInTheDocument()
    expect(screen.getByText('Second analysis result')).toBeInTheDocument()
  })

  it('shows empty message when findings array is empty', () => {
    renderModal({ result: makeResult({ findings: [] }) })
    expect(screen.getByTestId('no-findings')).toBeInTheDocument()
    expect(screen.getByText('No findings generated')).toBeInTheDocument()
  })

  it('fires onClose when close button clicked', async () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    await userEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('fires onClose on Escape key', async () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

})
