import type { Mock } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { TitleScreen } from './TitleScreen'

const { mockHasSave, mockLoadGame, mockClearSave, mockGetSaveMeta, mockGetSaveRecords } = vi.hoisted(() => ({
  mockHasSave: vi.fn() as Mock,
  mockLoadGame: vi.fn() as Mock,
  mockClearSave: vi.fn() as Mock,
  mockGetSaveMeta: vi.fn() as Mock,
  mockGetSaveRecords: vi.fn() as Mock,
}))

vi.mock('@shared/saveManager', () => ({
  hasSave: mockHasSave,
  loadGame: mockLoadGame,
  clearSave: mockClearSave,
  getSaveMeta: mockGetSaveMeta,
  getSaveRecords: mockGetSaveRecords,
}))

function renderTitle() {
  return render(
    <BrowserRouter>
      <TitleScreen />
    </BrowserRouter>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('TitleScreen', () => {
  it('renders the GIHA logo', () => {
    renderTitle()
    const logo = screen.getByAltText('GIHA Logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders New Game, How to Play, and About buttons', () => {
    renderTitle()
    expect(screen.getByText('New Game')).toBeInTheDocument()
    expect(screen.getByText('How to Play')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('does not show Continue button when no save exists', () => {
    mockHasSave.mockReturnValue(false)
    renderTitle()
    expect(screen.queryByText(/Continue/)).not.toBeInTheDocument()
  })

  it('shows Continue button when save exists', () => {
    mockHasSave.mockReturnValue(true)
    mockGetSaveMeta.mockReturnValue({ timestamp: Date.now() })
    renderTitle()
    expect(screen.getByText(/Continue/)).toBeInTheDocument()
  })

  it('shows Continue button with time ago when save exists', () => {
    mockHasSave.mockReturnValue(true)
    mockGetSaveMeta.mockReturnValue({ timestamp: Date.now() - 3 * 60_000 })
    renderTitle()
    expect(screen.getByText(/Continue \(3 min ago\)/)).toBeInTheDocument()
  })

  it('shows New Game confirmation modal when save exists and New Game clicked', async () => {
    const user = userEvent.setup()
    mockHasSave.mockReturnValue(true)
    renderTitle()
    await user.click(screen.getByText('New Game'))
    expect(screen.getByText('Start New Game?')).toBeInTheDocument()
    expect(screen.getByText(/saved game exists/)).toBeInTheDocument()
  })

  it('does not show confirmation modal when no save and New Game clicked', async () => {
    const user = userEvent.setup()
    mockHasSave.mockReturnValue(false)
    renderTitle()
    await user.click(screen.getByText('New Game'))
    expect(screen.queryByText('Start New Game?')).not.toBeInTheDocument()
  })

  it('calls clearSave and navigates on confirm new game', async () => {
    const user = userEvent.setup()
    mockHasSave.mockReturnValue(true)
    renderTitle()
    await user.click(screen.getByText('New Game'))
    await user.click(screen.getByText('Start Fresh'))
    expect(mockClearSave).toHaveBeenCalledOnce()
    expect(screen.queryByText('Start New Game?')).not.toBeInTheDocument()
  })

  it('shows corrupt save modal when Continue fails', async () => {
    const user = userEvent.setup()
    mockHasSave.mockReturnValue(true)
    mockLoadGame.mockReturnValue(false)
    renderTitle()
    await user.click(screen.getByText(/Continue/))
    expect(screen.getByText('Save Data Error')).toBeInTheDocument()
    expect(screen.getByText(/could not be loaded/)).toBeInTheDocument()
  })

  it('Delete & Start Fresh clears save and navigates', async () => {
    const user = userEvent.setup()
    mockHasSave.mockReturnValue(true)
    mockLoadGame.mockReturnValue(false)
    renderTitle()
    await user.click(screen.getByText(/Continue/))
    await user.click(screen.getByText(/Delete & Start Fresh/))
    expect(mockClearSave).toHaveBeenCalledOnce()
  })

  it('closes New Game confirmation on Cancel', async () => {
    const user = userEvent.setup()
    mockHasSave.mockReturnValue(true)
    renderTitle()
    await user.click(screen.getByText('New Game'))
    expect(screen.getByText('Start New Game?')).toBeInTheDocument()
    await user.click(screen.getByText('Cancel'))
    expect(screen.queryByText('Start New Game?')).not.toBeInTheDocument()
  })

  it('shows Records button when save has badges', () => {
    mockHasSave.mockReturnValue(true)
    mockGetSaveMeta.mockReturnValue({ timestamp: Date.now() })
    mockGetSaveRecords.mockReturnValue({
      earnedBadges: ['fact-checker'],
      bestCaseResults: { 'case-01': 'S' },
      completedCases: 1,
      timestamp: Date.now(),
    })
    renderTitle()
    expect(screen.getByText('Records')).toBeInTheDocument()
  })

  it('does not show Records button when save has no badges or results', () => {
    mockHasSave.mockReturnValue(true)
    mockGetSaveMeta.mockReturnValue({ timestamp: Date.now() })
    mockGetSaveRecords.mockReturnValue({
      earnedBadges: [],
      bestCaseResults: {},
      completedCases: 0,
      timestamp: Date.now(),
    })
    renderTitle()
    expect(screen.queryByText('Records')).not.toBeInTheDocument()
  })

  it('opens Records modal and shows badge', async () => {
    const user = userEvent.setup()
    mockHasSave.mockReturnValue(true)
    mockGetSaveMeta.mockReturnValue({ timestamp: Date.now() })
    mockGetSaveRecords.mockReturnValue({
      earnedBadges: ['fact-checker'],
      bestCaseResults: { 'case-01': 'S' },
      completedCases: 1,
      timestamp: Date.now(),
    })
    renderTitle()
    await user.click(screen.getByText('Records'))
    expect(screen.getByText('Best Composite Grade')).toBeInTheDocument()
    expect(screen.getByText('Badges Earned')).toBeInTheDocument()
    expect(screen.getByText('Best Case Grades')).toBeInTheDocument()
  })

  it('opens How to Play modal', async () => {
    const user = userEvent.setup()
    renderTitle()
    await user.click(screen.getByText('How to Play'))
    expect(screen.getByText('STRATEGY MODE')).toBeInTheDocument()
  })

  it('opens About modal on About click', async () => {
    const user = userEvent.setup()
    renderTitle()
    await user.click(screen.getByText('About'))
    expect(screen.getByText('About GIHA')).toBeInTheDocument()
  })

  it('closes About modal on close button click', async () => {
    const user = userEvent.setup()
    renderTitle()
    await user.click(screen.getByText('About'))
    expect(screen.getByText('About GIHA')).toBeInTheDocument()
    await user.click(screen.getByLabelText('Close'))
    expect(screen.queryByText('About GIHA')).not.toBeInTheDocument()
  })

  it('renders background canvas', () => {
    renderTitle()
    const canvas = screen.getByTestId('bg-canvas')
    expect(canvas).toBeInTheDocument()
  })
})
