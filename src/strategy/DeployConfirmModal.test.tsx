import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeployConfirmModal } from './DeployConfirmModal'
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

const milSchool: Intervention = {
  id: 'mil-school',
  name: 'School MIL Program',
  cost: 80,
  cooldown: 60,
  effect: { r0Delta: 0, sigmaDelta: 2, durationTicks: 60 },
  description: 'Curriculum-based media literacy education',
  category: 'sigma-boost',
}

describe('DeployConfirmModal', () => {
  it('returns null when isOpen is false', () => {
    const { container } = render(
      <DeployConfirmModal
        intervention={factCheck}
        isOpen={false}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('returns null when intervention is null', () => {
    const { container } = render(
      <DeployConfirmModal
        intervention={null}
        isOpen={true}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('shows intervention name and cost', () => {
    render(
      <DeployConfirmModal
        intervention={factCheck}
        isOpen={true}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )
    expect(screen.getByText('Deploy Fact-Check Bureau?')).toBeInTheDocument()
    expect(screen.getByText('Cost: $50')).toBeInTheDocument()
  })

  it('shows R₀ reduction effect preview', () => {
    render(
      <DeployConfirmModal
        intervention={factCheck}
        isOpen={true}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )
    expect(
      screen.getByText('Estimated R₀ reduction: -0.2 for 15 ticks'),
    ).toBeInTheDocument()
  })

  it('shows Σ boost effect preview', () => {
    render(
      <DeployConfirmModal
        intervention={milSchool}
        isOpen={true}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )
    expect(
      screen.getByText('Estimated Σ boost: +2 for 60 ticks'),
    ).toBeInTheDocument()
  })

  it('renders Cancel and Deploy buttons', () => {
    render(
      <DeployConfirmModal
        intervention={factCheck}
        isOpen={true}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Deploy')).toBeInTheDocument()
  })

  it('calls onCancel when Cancel button clicked', async () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    render(
      <DeployConfirmModal
        intervention={factCheck}
        isOpen={true}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )
    await userEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('calls onConfirm when Deploy button clicked', async () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    render(
      <DeployConfirmModal
        intervention={factCheck}
        isOpen={true}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )
    await userEvent.click(screen.getByText('Deploy'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('calls onCancel on Escape key', async () => {
    const onCancel = vi.fn()
    render(
      <DeployConfirmModal
        intervention={factCheck}
        isOpen={true}
        onCancel={onCancel}
        onConfirm={vi.fn()}
      />,
    )
    await userEvent.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
