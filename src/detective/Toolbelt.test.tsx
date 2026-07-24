import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Toolbelt } from './Toolbelt'

describe('Toolbelt', () => {
  const toolIds = [
    'spectrogram',
    'frame-stepper',
    'metadata-inspector',
    'source-tracer',
    'inconsistency-highlighter',
    'timeline-cross-referencer',
  ]

  it('renders 6 tool buttons', () => {
    render(<Toolbelt activeTool={null} usedTools={[]} onSelectTool={vi.fn()} />)
    for (const id of toolIds) {
      expect(screen.getByTestId(`tool-btn-${id}`)).toBeInTheDocument()
    }
  })

  it('clicking unused tool calls onSelectTool with that id', () => {
    const onSelectTool = vi.fn()
    render(<Toolbelt activeTool={null} usedTools={[]} onSelectTool={onSelectTool} />)
    fireEvent.click(screen.getByTestId('tool-btn-spectrogram'))
    expect(onSelectTool).toHaveBeenCalledWith('spectrogram')
  })

  it('clicking active tool deselects (calls onSelectTool null)', () => {
    const onSelectTool = vi.fn()
    render(
      <Toolbelt activeTool="spectrogram" usedTools={[]} onSelectTool={onSelectTool} />,
    )
    fireEvent.click(screen.getByTestId('tool-btn-spectrogram'))
    expect(onSelectTool).toHaveBeenCalledWith(null)
  })

  it('clicking a different tool switches selection', () => {
    const onSelectTool = vi.fn()
    render(
      <Toolbelt activeTool="spectrogram" usedTools={[]} onSelectTool={onSelectTool} />,
    )
    fireEvent.click(screen.getByTestId('tool-btn-frame-stepper'))
    expect(onSelectTool).toHaveBeenCalledWith('frame-stepper')
  })

  it('used tools show checkmark badge', () => {
    render(
      <Toolbelt
        activeTool={null}
        usedTools={['spectrogram', 'source-tracer']}
        onSelectTool={vi.fn()}
      />,
    )
    expect(screen.getByTestId('tool-btn-spectrogram').getAttribute('data-used')).toBe('true')
    expect(screen.getByTestId('tool-btn-source-tracer').getAttribute('data-used')).toBe('true')
    expect(screen.getByTestId('tool-btn-frame-stepper').getAttribute('data-used')).toBe('false')
  })

  it('active tool has data-active attribute', () => {
    render(
      <Toolbelt activeTool="spectrogram" usedTools={[]} onSelectTool={vi.fn()} />,
    )
    expect(screen.getByTestId('tool-btn-spectrogram').getAttribute('data-active')).toBe('true')
    expect(screen.getByTestId('tool-btn-frame-stepper').getAttribute('data-active')).toBe('false')
  })
})
