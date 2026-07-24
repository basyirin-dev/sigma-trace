import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EvidenceCard, type EvidenceItem } from './EvidenceCard'

const baseItem: EvidenceItem = {
  id: 'ev-01',
  type: 'video',
  label: 'Resignation Video',
  description: '30-second clip of Mayor Chen saying she resigns. 1080p video.',
  isRedHerring: false,
}

const types: EvidenceItem['type'][] = ['video', 'audio', 'image', 'text', 'metadata']

function renderCard(overrides?: Partial<Parameters<typeof EvidenceCard>[0]>) {
  return render(
    <EvidenceCard
      evidence={baseItem}
      selected={false}
      onSelect={vi.fn()}
      {...overrides}
    />,
  )
}

describe('EvidenceCard', () => {
  it('renders type badge with correct label and icon for video', () => {
    renderCard()
    expect(screen.getByTestId('type-badge')).toHaveTextContent('▶VIDEO')
  })

  it('renders type badge for each evidence type', () => {
    for (const type of types) {
      const item = { ...baseItem, type, label: `${type} item` }
      const { unmount } = render(
        <EvidenceCard evidence={item} selected={false} onSelect={vi.fn()} />,
      )
      const badge = screen.getByTestId('type-badge')
      const typeLabel = type === 'metadata' ? 'META' : type.toUpperCase()
      expect(badge).toHaveTextContent(typeLabel)
      unmount()
    }
  })

  it('shows distinct preview area per type', () => {
    const previewTestIds: Record<EvidenceItem['type'], string> = {
      video: 'preview-video',
      audio: 'preview-audio',
      image: 'preview-image',
      text: 'preview-text',
      metadata: 'preview-metadata',
    }

    for (const type of types) {
      const item = { ...baseItem, type }
      const { unmount } = render(
        <EvidenceCard evidence={item} selected={false} onSelect={vi.fn()} />,
      )
      expect(screen.getByTestId(previewTestIds[type])).toBeInTheDocument()
      unmount()
    }
  })

  it('shows NEW badge initially', () => {
    renderCard()
    expect(screen.getByTestId('badge-new')).toBeInTheDocument()
  })

  it('hides NEW badge after first click', () => {
    renderCard()
    const card = screen.getByTestId('evidence-card')
    fireEvent.click(card)
    expect(screen.queryByTestId('badge-new')).not.toBeInTheDocument()
  })

  it('shows REVEALED badge when isRevealed is true', () => {
    renderCard({ isRevealed: true })
    expect(screen.getByTestId('badge-revealed')).toBeInTheDocument()
  })

  it('hides REVEALED badge when isRevealed is false', () => {
    renderCard({ isRevealed: false })
    expect(screen.queryByTestId('badge-revealed')).not.toBeInTheDocument()
  })

  it('shows RED HERRING badge when red herring and showRedHerringBadge true', () => {
    renderCard({
      evidence: { ...baseItem, isRedHerring: true },
      showRedHerringBadge: true,
    })
    expect(screen.getByTestId('badge-red-herring')).toBeInTheDocument()
  })

  it('hides RED HERRING badge when showRedHerringBadge is false', () => {
    renderCard({
      evidence: { ...baseItem, isRedHerring: true },
      showRedHerringBadge: false,
    })
    expect(screen.queryByTestId('badge-red-herring')).not.toBeInTheDocument()
  })

  it('click flips the card (data-flipped toggles)', () => {
    renderCard()
    const card = screen.getByTestId('evidence-card')
    expect(card.getAttribute('data-flipped')).toBe('false')
    fireEvent.click(card)
    expect(card.getAttribute('data-flipped')).toBe('true')
    fireEvent.click(card)
    expect(card.getAttribute('data-flipped')).toBe('false')
  })

  it('back face contains description text', () => {
    renderCard()
    fireEvent.click(screen.getByTestId('evidence-card'))
    expect(screen.getByTestId('card-back')).toHaveTextContent(
      '30-second clip of Mayor Chen saying she resigns. 1080p video.',
    )
  })

  it('back face shows evidenceDetails when isRevealed is true', () => {
    const details = 'Detailed finding from tool analysis.'
    renderCard({ isRevealed: true, evidenceDetails: details })
    fireEvent.click(screen.getByTestId('evidence-card'))
    expect(screen.getByTestId('back-details')).toHaveTextContent(details)
  })

  it('hides back details when isRevealed is false', () => {
    renderCard({ isRevealed: false, evidenceDetails: 'hidden detail' })
    fireEvent.click(screen.getByTestId('evidence-card'))
    expect(screen.queryByTestId('back-details')).not.toBeInTheDocument()
  })

  it('connect handle is on both faces', () => {
    renderCard()
    expect(screen.getAllByTestId('connect-handle-front')).toHaveLength(1)
    expect(screen.getAllByTestId('connect-handle-back')).toHaveLength(1)
  })

  it('cards have draggable and data-evidence-id attributes', () => {
    renderCard()
    const card = screen.getByTestId('evidence-card')
    expect(card.getAttribute('draggable')).toBe('true')
    expect(card.getAttribute('data-evidence-id')).toBe('ev-01')
  })

  it('fires onSelect on first examination', () => {
    const onSelect = vi.fn()
    renderCard({ onSelect })
    const card = screen.getByTestId('evidence-card')
    fireEvent.click(card)
    expect(onSelect).toHaveBeenCalledTimes(1)
    fireEvent.click(card)
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
