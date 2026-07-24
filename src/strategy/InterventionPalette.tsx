import { useState, useMemo } from 'react'
import type { Intervention } from '@engine/interventions'
import { getEscalatedCost } from '@engine/interventions'
import { InterventionCard } from './InterventionCard'
import { DeployConfirmModal } from './DeployConfirmModal'
import { Button } from '@shared/Button'
import { useGameStore, useSimulationStore } from '@shared/stores'

const DISTRICT_NAMES = ['Foundry', 'Harborview', 'Uptown', 'Campus']

export interface InterventionPaletteProps {
  interventions: Intervention[]
  budget: number
  selectedDistrict: number | null
  onDeploy: (interventionId: string, districtId?: number) => void
}

export function InterventionPalette({
  interventions,
  budget,
  selectedDistrict,
  onDeploy,
}: InterventionPaletteProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const cooldowns = useGameStore((s) => s.cooldowns)
  const useCounts = useGameStore((s) => s.interventionUseCounts)

  const sorted = useMemo(
    () => [...interventions].sort((a, b) => a.cost - b.cost),
    [interventions],
  )

  const selected = sorted.find((i) => i.id === selectedId)

  const districtLabel = selectedDistrict !== null
    ? DISTRICT_NAMES[selectedDistrict] ?? `District ${selectedDistrict}`
    : 'All'

  const handleCardSelect = (intervention: Intervention) => {
    const remaining = cooldowns[intervention.id] ?? 0
    if (remaining > 0) return
    const useCount = useCounts[intervention.id] ?? 0
    const actualCost = getEscalatedCost(intervention.cost, useCount)
    if (budget < actualCost) {
      setSelectedId(null)
      return
    }
    setSelectedId(intervention.id)
  }

  const handleDeployClick = () => {
    if (selectedId) {
      setConfirmOpen(true)
    }
  }

  const handleConfirm = () => {
    if (selectedId) {
      onDeploy(selectedId, selectedDistrict ?? undefined)
    }
    setConfirmOpen(false)
    setSelectedId(null)
  }

  return (
    <div data-testid="intervention-palette">
      <div style={{
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#8892b0',
        padding: '4px 8px',
        marginBottom: '4px',
        borderBottom: '1px solid #333',
      }}>
        Targeting: <strong style={{color: '#ccd6f6'}}>{districtLabel}</strong>
        {selectedDistrict !== null && (
          <span style={{color: '#2ECC71', fontSize: '9px', marginLeft: '8px', cursor: 'pointer'}}
            onClick={() => {}}>
            (click map to clear)
          </span>
        )}
      </div>
      {sorted.map((intervention) => {
        const cooldownRemaining = cooldowns[intervention.id] ?? 0
        const isSelected = intervention.id === selectedId
        const useCount = useCounts[intervention.id] ?? 0
        const actualCost = getEscalatedCost(intervention.cost, useCount)
        return (
          <div key={intervention.id} data-selected={isSelected}>
            <InterventionCard
              intervention={{ ...intervention, cost: actualCost }}
              affordable={budget >= actualCost}
              cooldownRemaining={cooldownRemaining}
              selected={isSelected}
              onDeploy={() => handleCardSelect(intervention)}
              baseCost={intervention.cost}
              useCount={useCount}
            />
          </div>
        )
      })}
      <Button
        disabled={!selectedId}
        onClick={handleDeployClick}
        testId="deploy-btn"
      >
        Deploy
      </Button>
      <DeployConfirmModal
        intervention={selected ? { ...selected, cost: getEscalatedCost(selected.cost, useCounts[selected.id] ?? 0) } : null}
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        activeEffects={useSimulationStore.getState().activeEffects}
      />
    </div>
  )
}
