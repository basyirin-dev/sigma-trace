export type EvidenceType = 'video' | 'audio' | 'image' | 'text' | 'metadata';

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  label: string;
  description: string;
  isRedHerring: boolean;
}

export interface EvidenceCardProps {
  evidence: EvidenceItem;
  selected: boolean;
  onSelect: () => void;
}

export function EvidenceCard(_props: EvidenceCardProps) {
  return <div data-testid="evidence-card" />;
}
