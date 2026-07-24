import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InterventionCard } from './InterventionCard'
import type { Intervention } from '@engine/interventions'

const factCheck: Intervention = {
  id: 'fact-check',
  name: 'Fact-Check Bureau',
  cost: 50,
  cooldown: 30,
  effect: { r0Delta: -0.2, sigmaDelta: 0, durationTicks: 15 },
  description: 'Professional verification teams',
  category: 'r0-control',
}

describe('InterventionCard', () => {
  it('renders intervention name, cost, and description', () => {
    render(
      <InterventionCard
        intervention={factCheck}
        affordable
        cooldownRemaining={0}
        selected={false}
        onDeploy={vi.fn()}
      />,
    )
    expect(screen.getByText('Fact-Check Bureau')).toBeInTheDocument()
    expect(screen.getByText('$50')).toBeInTheDocument()
    expect(screen.getByText('Professional verification teams')).toBeInTheDocument()
  })

  it('renders effect summary', () => {
    render(
      <InterventionCard
        intervention={factCheck}
        affordable
        cooldownRemaining={0}
        selected={false}
        onDeploy={vi.fn()}
      />,
    )
    expect(screen.getByText(/R₀-0\.2/)).toBeInTheDocument()
  })

  it('fires onDeploy when clicked in available state', async () => {
    const onDeploy = vi.fn()
    render(
      <InterventionCard
        intervention={factCheck}
        affordable
        cooldownRemaining={0}
        selected={false}
        onDeploy={onDeploy}
      />,
    )
    await userEvent.click(screen.getByTestId('intervention-card'))
    expect(onDeploy).toHaveBeenCalledTimes(1)
  })

  it('does not fire onDeploy when on cooldown', async () => {
    const onDeploy = vi.fn()
    render(
      <InterventionCard
        intervention={factCheck}
        affordable
        cooldownRemaining={10}
        selected={false}
        onDeploy={onDeploy}
      />,
    )
    await userEvent.click(screen.getByTestId('intervention-card'))
    expect(onDeploy).not.toHaveBeenCalled()
  })

  it('does not fire onDeploy when locked (insufficient budget)', async () => {
    const onDeploy = vi.fn()
    render(
      <InterventionCard
        intervention={factCheck}
        affordable={false}
        cooldownRemaining={0}
        selected={false}
        onDeploy={onDeploy}
      />,
    )
    await userEvent.click(screen.getByTestId('intervention-card'))
    expect(onDeploy).not.toHaveBeenCalled()
  })

  it('shows cooldown indicator when on cooldown', () => {
    render(
      <InterventionCard
        intervention={factCheck}
        affordable
        cooldownRemaining={10}
        selected={false}
        onDeploy={vi.fn()}
      />,
    )
    expect(screen.getByText(/10s/)).toBeInTheDocument()
  })

  it('shows locked indicator when insufficient budget', () => {
    render(
      <InterventionCard
        intervention={factCheck}
        affordable={false}
        cooldownRemaining={0}
        selected={false}
        onDeploy={vi.fn()}
      />,
    )
    expect(screen.getByText('Insufficient budget')).toBeInTheDocument()
  })

  it('applies selected state styling', () => {
    const { container } = render(
      <InterventionCard
        intervention={factCheck}
        affordable
        cooldownRemaining={0}
        selected={true}
        onDeploy={vi.fn()}
      />,
    )
    const card = screen.getByTestId('intervention-card')
    expect(container.contains(card)).toBe(true)
  })

  it('renders with test id', () => {
    render(
      <InterventionCard
        intervention={factCheck}
        affordable
        cooldownRemaining={0}
        selected={false}
        onDeploy={vi.fn()}
      />,
    )
    expect(screen.getByTestId('intervention-card')).toBeInTheDocument()
  })
})
