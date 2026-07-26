import { useState, useMemo, useCallback } from 'react';
import type { Intervention } from '@engine/interventions';
import { getEscalatedCost } from '@engine/interventions';
import { InterventionCard } from './InterventionCard';
import { DeployConfirmModal } from './DeployConfirmModal';
import { Button } from '@shared/Button';
import { useGameStore, useSimulationStore } from '@shared/stores';

const DISTRICT_NAMES = ['Foundry', 'Harborview', 'Uptown', 'Campus'];

export interface InterventionPaletteProps {
  interventions: Intervention[];
  budget: number;
  selectedDistrict: number | null;
  onDeploy: (interventionId: string, districtId?: number) => void;
}

export function InterventionPalette({
  interventions,
  budget,
  selectedDistrict,
  onDeploy,
}: InterventionPaletteProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cooldowns = useGameStore((s) => s.cooldowns);
  const useCounts = useGameStore((s) => s.interventionUseCounts);

  const sorted = useMemo(() => [...interventions].sort((a, b) => a.cost - b.cost), [interventions]);

  const selected = sorted.find((i) => i.id === selectedId);

  const districtLabel =
    selectedDistrict !== null
      ? (DISTRICT_NAMES[selectedDistrict] ?? `District ${selectedDistrict}`)
      : 'All';

  const handleCardSelect = useCallback(
    (intervention: Intervention) => {
      const remaining = cooldowns[intervention.id] ?? 0;
      if (remaining > 0) return;
      const useCount = useCounts[intervention.id] ?? 0;
      const actualCost = getEscalatedCost(intervention.cost, useCount);
      if (budget < actualCost) {
        setSelectedId(null);
        return;
      }
      setSelectedId(intervention.id);
    },
    [cooldowns, useCounts, budget],
  );

  const handleDeployClick = useCallback(() => {
    if (selectedId) {
      setConfirmOpen(true);
    }
  }, [selectedId]);

  const handleConfirm = useCallback(() => {
    if (selectedId) {
      onDeploy(selectedId, selectedDistrict ?? undefined);
    }
    setConfirmOpen(false);
    setSelectedId(null);
  }, [selectedId, selectedDistrict, onDeploy]);

  return (
    <div
      data-testid="intervention-palette"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#8892b0',
          padding: '8px 12px',
          marginBottom: '6px',
          borderBottom: '1px solid #2a3a5e',
        }}
      >
        Targeting: <strong style={{ color: '#ccd6f6' }}>{districtLabel}</strong>
        {selectedDistrict !== null && (
          <span
            style={{ color: '#2ECC71', fontSize: '12px', marginLeft: '8px', cursor: 'pointer' }}
            onClick={() => {}}
          >
            (click map to clear)
          </span>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {sorted.map((intervention) => {
          const cooldownRemaining = cooldowns[intervention.id] ?? 0;
          const isSelected = intervention.id === selectedId;
          const useCount = useCounts[intervention.id] ?? 0;
          const actualCost = getEscalatedCost(intervention.cost, useCount);
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
          );
        })}
      </div>
      <div
        data-testid="deploy-area"
        style={{ padding: '10px 0 4px', borderTop: '1px solid #2a3a5e', flexShrink: 0 }}
      >
        <Button
          disabled={!selectedId}
          onClick={handleDeployClick}
          testId="deploy-btn"
          variant="primary"
        >
          Deploy
        </Button>
      </div>
      <DeployConfirmModal
        intervention={
          selected
            ? { ...selected, cost: getEscalatedCost(selected.cost, useCounts[selected.id] ?? 0) }
            : null
        }
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        activeEffects={useSimulationStore.getState().activeEffects}
      />
    </div>
  );
}
