export interface CoherenceGaugeProps {
  value: number;
  max?: number;
}

export function CoherenceGauge(_props: CoherenceGaugeProps) {
  return <div data-testid="coherence-gauge" />;
}
