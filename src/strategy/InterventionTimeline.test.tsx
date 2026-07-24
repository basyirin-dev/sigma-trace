import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InterventionTimeline } from './InterventionTimeline'
import type { DeploymentEntry } from '@shared/stores'

describe('InterventionTimeline', () => {
  it('shows empty state when no entries', () => {
    render(<InterventionTimeline entries={[]} />)
    expect(screen.getByText('No interventions deployed')).toBeInTheDocument()
  })

  it('renders intervention name and tick for each entry', () => {
    const entries: DeploymentEntry[] = [
      { interventionId: 'fact-check', tick: 5, r0AtDeploy: 0.6, sigmaAtDeploy: 78 },
    ]
    render(<InterventionTimeline entries={entries} />)
    expect(screen.getByText('Fact-Check Bureau')).toBeInTheDocument()
    expect(screen.getByText(/T5/)).toBeInTheDocument()
  })

  it('shows cost and effect text', () => {
    const entries: DeploymentEntry[] = [
      { interventionId: 'fact-check', tick: 5, r0AtDeploy: 0.6, sigmaAtDeploy: 78 },
    ]
    render(<InterventionTimeline entries={entries} />)
    expect(screen.getByText(/\$50/)).toBeInTheDocument()
    expect(screen.getByText(/R₀-0\.2/)).toBeInTheDocument()
  })

  it('renders entries in the order they appear in the array', () => {
    const entries: DeploymentEntry[] = [
      { interventionId: 'fact-check', tick: 5, r0AtDeploy: 0.6, sigmaAtDeploy: 78 },
      { interventionId: 'mil-school', tick: 12, r0AtDeploy: 0.8, sigmaAtDeploy: 70 },
      { interventionId: 'algorithm-audit', tick: 20, r0AtDeploy: 1.5, sigmaAtDeploy: 55 },
    ]
    render(<InterventionTimeline entries={entries} />)

    const names = screen.getAllByTestId('timeline-entry')
    expect(names).toHaveLength(3)
    expect(names[0]!.textContent).toContain('Fact-Check Bureau')
    expect(names[1]!.textContent).toContain('School MIL Program')
    expect(names[2]!.textContent).toContain('Algorithm Audit')
  })

  it('shows Preventive label for low R₀ entries', () => {
    const entries: DeploymentEntry[] = [
      { interventionId: 'fact-check', tick: 5, r0AtDeploy: 0.6, sigmaAtDeploy: 78 },
    ]
    render(<InterventionTimeline entries={entries} />)
    expect(screen.getByText('Preventive')).toBeInTheDocument()
  })

  it('shows Urgent label for high R₀ entries', () => {
    const entries: DeploymentEntry[] = [
      { interventionId: 'fact-check', tick: 5, r0AtDeploy: 1.5, sigmaAtDeploy: 40 },
    ]
    render(<InterventionTimeline entries={entries} />)
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('renders header with intervention log title', () => {
    render(<InterventionTimeline entries={[]} />)
    expect(screen.getByText('Intervention Log')).toBeInTheDocument()
  })

  it('renders timeline with test id', () => {
    render(<InterventionTimeline entries={[]} />)
    expect(screen.getByTestId('intervention-timeline')).toBeInTheDocument()
  })
})
