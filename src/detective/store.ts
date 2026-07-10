import type { EvidenceItem } from './EvidenceCard';

export type CaseProgress = 'intro' | 'investigation' | 'evidence' | 'verdict' | 'debrief';

export interface DetectiveState {
  currentCase: string | null;
  progress: CaseProgress;
  evidence: EvidenceItem[];
  connections: [string, string][];
  usedTools: string[];
  startTime: number;
}

export const initialDetectiveState: DetectiveState = {
  currentCase: null,
  progress: 'intro',
  evidence: [],
  connections: [],
  usedTools: [],
  startTime: 0,
};
