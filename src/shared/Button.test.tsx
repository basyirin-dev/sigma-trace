import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'
import styles from './Button.module.css'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('applies variant class', () => {
    const { container } = render(<Button variant="danger">Danger</Button>)
    expect(container.firstElementChild).toHaveClass(styles.danger!)
  })

  it('renders disabled state', async () => {
    const handler = vi.fn()
    render(
      <Button disabled onClick={handler}>
        Disabled
      </Button>,
    )
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    await userEvent.click(btn)
    expect(handler).not.toHaveBeenCalled()
  })

  it('renders loading state', () => {
    render(<Button loading>Loading</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('fires onClick when clicked', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Click me</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('applies className', () => {
    const { container } = render(
      <Button className="custom-class">Styled</Button>,
    )
    expect(container.firstElementChild).toHaveClass('custom-class')
  })
})
