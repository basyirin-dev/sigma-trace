import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HUD } from './HUD'
import styles from './HUD.module.css'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('HUD', () => {
  it('renders all stat values', () => {
    render(<HUD sigma={72} r0={1.3} budget={350} phase="calm" />, { wrapper: Wrapper })
    expect(screen.getByText('72.0')).toBeInTheDocument()
    expect(screen.getByText('1.30')).toBeInTheDocument()
    expect(screen.getByText('$350')).toBeInTheDocument()
  })

  it('renders calm phase label', () => {
    render(<HUD sigma={72} r0={1.3} budget={350} phase="calm" />, { wrapper: Wrapper })
    expect(screen.getByText('Calm')).toBeInTheDocument()
  })

  it('renders trap phase label', () => {
    render(<HUD sigma={72} r0={1.3} budget={350} phase="trap" />, { wrapper: Wrapper })
    expect(screen.getByText('SIGMA TRAP')).toBeInTheDocument()
  })

  it('applies className', () => {
    const { container } = render(
      <HUD sigma={72} r0={1.3} budget={350} phase="calm" className="custom" />,
      { wrapper: Wrapper },
    )
    expect(container.firstElementChild).toHaveClass('custom')
  })

  it('adds budgetLow class when lowBudget is true', () => {
    render(<HUD sigma={72} r0={1.3} budget={20} phase="calm" lowBudget />, { wrapper: Wrapper })
    const budgetSpan = screen.getByText('$20')
    expect(budgetSpan).toHaveClass(styles.budgetLow ?? 'budgetLow')
  })

  it('does not add budgetLow class when lowBudget is false', () => {
    render(<HUD sigma={72} r0={1.3} budget={350} phase="calm" lowBudget={false} />, { wrapper: Wrapper })
    const budgetSpan = screen.getByText('$350')
    expect(budgetSpan).not.toHaveClass(styles.budgetLow ?? 'budgetLow')
  })

  it('does not add budgetLow class by default', () => {
    render(<HUD sigma={72} r0={1.3} budget={350} phase="calm" />, { wrapper: Wrapper })
    const budgetSpan = screen.getByText('$350')
    expect(budgetSpan).not.toHaveClass(styles.budgetLow ?? 'budgetLow')
  })
})
