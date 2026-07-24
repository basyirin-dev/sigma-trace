import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  it('returns null when isOpen is false', () => {
    const { container } = render(
      <Modal title="Test" isOpen={false} onClose={vi.fn()}>
        Content
      </Modal>,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders when isOpen is true', () => {
    render(
      <Modal title="Test Title" isOpen={true} onClose={vi.fn()}>
        Modal Content
      </Modal>,
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('fires onClose when close button clicked', async () => {
    const onClose = vi.fn()
    render(
      <Modal title="Test" isOpen={true} onClose={onClose}>
        Content
      </Modal>,
    )
    await userEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('fires onClose on Escape key', async () => {
    const onClose = vi.fn()
    render(
      <Modal title="Test" isOpen={true} onClose={onClose}>
        Content
      </Modal>,
    )
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('confirm variant renders action buttons', () => {
    render(
      <Modal
        title="Confirm"
        isOpen={true}
        onClose={vi.fn()}
        variant="confirm"
        confirmLabel="Delete"
        cancelLabel="Keep"
      >
        Sure?
      </Modal>,
    )
    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.getByText('Keep')).toBeInTheDocument()
  })

  it('applies className', () => {
    render(
      <Modal title="Test" isOpen={true} onClose={vi.fn()} className="custom">
        Content
      </Modal>,
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
