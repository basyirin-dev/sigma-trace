export interface VerdictPanelProps {
  onSubmit: (verdict: 'real' | 'manipulated' | 'uncertain', justification: string) => void;
  disabled: boolean;
}

export function VerdictPanel(_props: VerdictPanelProps) {
  return <div data-testid="verdict-panel" />;
}
