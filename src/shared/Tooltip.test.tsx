import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('renders children', () => {
    render(
      <Tooltip content="tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    )
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="tooltip text" delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    )

    await user.hover(screen.getByText('Hover me'))

    expect(await screen.findByText('tooltip text')).toBeInTheDocument()
  })

  it('hides tooltip on mouse leave', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="tooltip text" delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    )

    const trigger = screen.getByText('Hover me')
    await user.hover(trigger)
    expect(await screen.findByText('tooltip text')).toBeInTheDocument()

    await user.unhover(trigger)
    expect(screen.queryByText('tooltip text')).not.toBeInTheDocument()
  })

  it('applies className', () => {
    const { container } = render(
      <Tooltip content="tooltip text" className="custom-class">
        <button>Hover me</button>
      </Tooltip>,
    )
    expect(container.firstElementChild).toHaveClass('custom-class')
  })
})
