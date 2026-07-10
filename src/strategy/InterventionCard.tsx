import type { Intervention } from '@engine/interventions';

export interface InterventionCardProps {
  intervention: Intervention;
  affordable: boolean;
  onDeploy: () => void;
}

export function InterventionCard(_props: InterventionCardProps) {
  return <div data-testid="intervention-card" />;
}
