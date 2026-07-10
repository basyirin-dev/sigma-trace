export interface CaseMeta {
  id: string;
  title: string;
  brief: string;
  milLesson: string;
  correctVerdict: 'real' | 'manipulated' | 'uncertain';
  solution: {
    requiredConnections: [string, string][];
    requiredToolEvidencePairs: [string, string][];
    justificationKeywords: string[];
  };
  outcome: {
    successR0Delta: number;
    successSigmaDelta: number;
    failR0Delta: number;
    failSigmaDelta: number;
  };
}

export interface CutsceneFrame {
  text: string;
  duration: number;
}

export interface CaseScript {
  introCutscene: CutsceneFrame[];
  conclusionText: string;
}

export async function loadCaseMeta(caseId: string): Promise<CaseMeta> {
  const res = await fetch(`/cases/${caseId}/metadata.json`);
  return res.json();
}

export async function loadCaseScript(caseId: string): Promise<CaseScript> {
  const res = await fetch(`/cases/${caseId}/script.json`);
  return res.json();
}
