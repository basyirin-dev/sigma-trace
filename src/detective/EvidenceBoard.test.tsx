import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { EvidenceBoard } from './EvidenceBoard'
import type { EvidenceItem } from './EvidenceCard'
import type { EvidenceBoardData } from './CaseLoader'

const mockItems: EvidenceItem[] = [
  { id: 'ev-01', type: 'video', label: 'Resignation Video', description: '', isRedHerring: false },
  { id: 'ev-02', type: 'audio', label: 'Spectrogram Data', description: '', isRedHerring: false },
  { id: 'ev-03', type: 'metadata', label: 'File Metadata', description: '', isRedHerring: false },
]

const mockBoardData: EvidenceBoardData = {
  nodes: [
    { id: 'ev-01', x: 0.25, y: 0.2, label: 'Resignation Video' },
    { id: 'ev-02', x: 0.55, y: 0.1, label: 'Spectrogram Data' },
    { id: 'ev-03', x: 0.65, y: 0.35, label: 'File Metadata' },
  ],
  requiredConnections: [['ev-01', 'ev-02']],
  hintConnections: [],
}

beforeEach(() => {
  vi.clearAllMocks().useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  cleanup()
})

function renderBoard(overrides?: Partial<Parameters<typeof EvidenceBoard>[0]>) {
  const handlers = {
    onConnect: vi.fn(),
    onDisconnect: vi.fn(),
    onInspect: vi.fn(),
  }
  const result = render(
    <EvidenceBoard
      evidenceItems={mockItems}
      boardData={mockBoardData}
      connections={[]}
      {...handlers}
      {...overrides}
    />,
  )
  return { ...handlers, ...result }
}

describe('EvidenceBoard', () => {
  it('renders all cards with correct testids', () => {
    renderBoard()
    const cards = screen.getAllByTestId('evidence-card')
    expect(cards).toHaveLength(3)
  })

  it('positions cards at board data coordinates', () => {
    renderBoard()
    const cards = screen.getAllByTestId('evidence-card')
    const style0 = cards[0]!.getAttribute('style')
    expect(style0).toContain('left: 25%')
    expect(style0).toContain('top: 20%')

    const style2 = cards[2]!.getAttribute('style')
    expect(style2).toContain('left: 65%')
    expect(style2).toContain('top: 35%')
  })

  it('cards are draggable with data-evidence-id', () => {
    renderBoard()
    const cards = screen.getAllByTestId('evidence-card')
    expect(cards[0]!.getAttribute('draggable')).toBe('true')
    expect(cards[0]!.getAttribute('data-evidence-id')).toBe('ev-01')
    expect(cards[1]!.getAttribute('draggable')).toBe('true')
    expect(cards[2]!.getAttribute('data-evidence-id')).toBe('ev-03')
  })

  it('each card shows type badge and label', () => {
    renderBoard()
    const badges = screen.getAllByTestId('type-badge')
    expect(badges).toHaveLength(3)
    const cards = screen.getAllByTestId('evidence-card')
    expect(cards[0]?.getAttribute('data-evidence-id')).toBe('ev-01')
    expect(cards[1]?.getAttribute('data-evidence-id')).toBe('ev-02')
    expect(cards[2]?.getAttribute('data-evidence-id')).toBe('ev-03')
  })

  it('each card has connect handles on both faces', () => {
    renderBoard()
    const frontHandles = screen.getAllByTestId('connect-handle-front')
    const backHandles = screen.getAllByTestId('connect-handle-back')
    expect(frontHandles).toHaveLength(3)
    expect(backHandles).toHaveLength(3)
  })

  it('renders SVG connection lines for provided connections', () => {
    renderBoard({ connections: [['ev-01', 'ev-02']] })
    const line = screen.getByTestId('connection-ev-01-ev-02')
    expect(line).toBeInTheDocument()
    expect(line.tagName).toBe('line')
  })

  it('renders no lines when connections are empty', () => {
    renderBoard({ connections: [] })
    expect(screen.queryByTestId(/^connection-/)).not.toBeInTheDocument()
  })

  it('mousedown on connect handle shows preview line', () => {
    renderBoard()
    const handle = screen.getAllByTestId('connect-handle-front')[0]!
    fireEvent.mouseDown(handle)
    expect(screen.getByTestId('preview-line')).toBeInTheDocument()
  })

  it('releasing on another card fires onConnect', () => {
    const { onConnect } = renderBoard()
    const handle0 = screen.getAllByTestId('connect-handle-front')[0]!

    fireEvent.mouseDown(handle0)

    const card1 = screen.getAllByTestId('evidence-card')[1]!
    fireEvent.mouseEnter(card1)
    fireEvent.mouseUp(window)

    expect(onConnect).toHaveBeenCalledWith('ev-01', 'ev-02')
  })

  it('releasing on empty space does NOT fire onConnect', () => {
    const { onConnect } = renderBoard()
    const handle0 = screen.getAllByTestId('connect-handle-front')[0]!

    fireEvent.mouseDown(handle0)
    fireEvent.mouseUp(window)

    expect(onConnect).not.toHaveBeenCalled()
  })

  it('clicking a connection line fires onDisconnect', () => {
    const { onDisconnect } = renderBoard({ connections: [['ev-01', 'ev-02']] })
    const line = screen.getByTestId('connection-ev-01-ev-02')
    fireEvent.click(line)
    expect(onDisconnect).toHaveBeenCalledWith('ev-01', 'ev-02')
  })

  it('right-click on card opens context menu with 6 tool options', () => {
    renderBoard()
    const card = screen.getAllByTestId('evidence-card')[0]!
    fireEvent.contextMenu(card)

    const toolIds = [
      'menu-tool-spectrogram',
      'menu-tool-frame-stepper',
      'menu-tool-metadata-inspector',
      'menu-tool-source-tracer',
      'menu-tool-inconsistency-highlighter',
      'menu-tool-timeline-cross-referencer',
    ]
    for (const id of toolIds) {
      expect(screen.getByTestId(id)).toBeInTheDocument()
    }
  })

  it('context menu shows evidence label as header', () => {
    renderBoard()
    const card = screen.getAllByTestId('evidence-card')[0]!
    fireEvent.contextMenu(card)
    expect(screen.getByTestId('menu-header')).toHaveTextContent('Resignation Video')
  })

  it('selecting a tool fires onInspect and closes menu', () => {
    const { onInspect } = renderBoard()
    const card = screen.getAllByTestId('evidence-card')[0]!
    fireEvent.contextMenu(card)

    const toolBtn = screen.getByTestId('menu-tool-spectrogram')
    fireEvent.click(toolBtn)

    expect(onInspect).toHaveBeenCalledWith('ev-01', 'spectrogram')
    expect(screen.queryByTestId('menu-header')).not.toBeInTheDocument()
  })

  it('clicking backdrop closes context menu', () => {
    renderBoard()
    const card = screen.getAllByTestId('evidence-card')[0]!
    fireEvent.contextMenu(card)
    expect(screen.getByTestId('menu-header')).toBeInTheDocument()

    const backdrop = document.querySelector('[class*="menuBackdrop"]')!
    fireEvent.click(backdrop)
    expect(screen.queryByTestId('menu-header')).not.toBeInTheDocument()
  })
})
