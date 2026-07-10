import type { Intervention } from '@engine/interventions';

export interface InterventionPaletteProps {
  interventions: Intervention[];
  budget: number;
  onDeploy: (interventionId: string) => void;
}

export function InterventionPalette(_props: InterventionPaletteProps) {
  return <div data-testid="intervention-palette" />;
}
