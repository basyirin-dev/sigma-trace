export interface EvidenceBoardProps {
  evidenceIds: string[];
  connections: [string, string][];
  onConnect: (evidenceIdA: string, evidenceIdB: string) => void;
}

export function EvidenceBoard(_props: EvidenceBoardProps) {
  return <div data-testid="evidence-board" />;
}
