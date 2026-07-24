import { Modal } from '@shared/Modal'
import type { Intervention } from '@engine/interventions'
import type { ActiveEffect } from '@engine/types'

export interface DeployConfirmModalProps {
  intervention: Intervention | null
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
  activeEffects?: ActiveEffect[]
}

export function DeployConfirmModal({
  intervention,
  isOpen,
  onCancel,
  onConfirm,
  activeEffects,
}: DeployConfirmModalProps) {
  if (!intervention) return null

  const effectLines: string[] = []
  const { effect } = intervention
  if (effect.r0Delta < 0) {
    effectLines.push(
      `Estimated R₀ reduction: ${effect.r0Delta} for ${effect.durationTicks} ticks`,
    )
  }
  if (effect.sigmaDelta > 0) {
    effectLines.push(
      `Estimated Σ boost: +${effect.sigmaDelta} for ${effect.durationTicks} ticks`,
    )
  }
  effectLines.push(`Cooldown: ${intervention.cooldown} ticks`)

  const alreadyActive = activeEffects?.find((e) => e.interventionId === intervention.id)

  return (
    <Modal
      title={`Deploy ${intervention.name}?`}
      isOpen={isOpen}
      onClose={onCancel}
      variant="confirm"
      confirmLabel="Deploy"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
    >
      <p>Cost: ${intervention.cost}</p>
      {effectLines.map((line) => (
        <p key={line}>{line}</p>
      ))}
      {alreadyActive && (
        <p style={{ color: '#F1C40F', fontSize: '12px', marginTop: '8px' }}>
          Already active: {alreadyActive.remainingTicks} ticks remaining
        </p>
      )}
    </Modal>
  )
}
