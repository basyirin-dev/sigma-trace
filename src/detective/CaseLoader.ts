import type { EvidenceItem } from './EvidenceCard';
import { useWarningStore } from '@shared/stores';

export interface CaseMeta {
  id: string;
  title: string;
  brief: string;
  milLesson: string;
  correctVerdict: 'real' | 'manipulated' | 'uncertain';
  difficulty: 'easy' | 'normal' | 'hard';
  solution: {
    requiredConnections: [string, string][];
    requiredToolEvidencePairs: [string, string][];
    justificationKeywords: string[];
    optionalToolEvidencePairs?: [string, string][];
  };
  outcome: {
    successR0Delta: number;
    successSigmaDelta: number;
    failR0Delta: number;
    failSigmaDelta: number;
    partialR0Delta: number;
    partialSigmaDelta: number;
  };
}

export interface CutsceneFrame {
  text: string;
  duration: number;
}

export interface CaseScript {
  introCutscene: CutsceneFrame[];
  evidenceFindings: Record<string, string>;
  toolHints: Record<string, string>;
  conclusionText: string;
  conclusionTextExposed?: string;
  conclusionTextProtected?: string;
  milLesson: string;
}

export interface EvidenceBoardData {
  nodes: {
    id: string;
    x: number;
    y: number;
    label: string;
  }[];
  requiredConnections: [string, string][];
  hintConnections: [string, string][];
  miraConnections?: [string, string][];
}

export interface CaseData {
  meta: CaseMeta;
  script: CaseScript;
  evidence: EvidenceItem[];
  board: EvidenceBoardData;
}

const VALID_EVIDENCE_TYPES = ['video', 'audio', 'image', 'text', 'metadata'] as const;
const VALID_VERDICTS = ['real', 'manipulated', 'uncertain'] as const;

export class CaseLoadError extends Error {
  constructor(caseId: string, file: string, reason: string) {
    super(`Case "${caseId}" — ${file}: ${reason}`);
    this.name = 'CaseLoadError';
  }
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isStr(v: unknown): v is string {
  return typeof v === 'string';
}

function isNum(v: unknown): v is number {
  return typeof v === 'number' && !Number.isNaN(v);
}

function isStrTupleArray(v: unknown): v is [string, string][] {
  if (!Array.isArray(v)) return false;
  return v.every(
    (e) =>
      Array.isArray(e) && e.length === 2 && isStr(e[0]) && isStr(e[1]),
  );
}

function validateMeta(raw: unknown, caseId: string): CaseMeta {
  if (!isObject(raw)) throw new CaseLoadError(caseId, 'metadata.json', 'not an object');

  const checks: [string, boolean][] = [
    ['id', isStr(raw.id)],
    ['title', isStr(raw.title)],
    ['brief', isStr(raw.brief)],
    ['milLesson', isStr(raw.milLesson)],
    ['correctVerdict', VALID_VERDICTS.includes(raw.correctVerdict as typeof VALID_VERDICTS[number])],
    ['difficulty', ['easy', 'normal', 'hard'].includes(raw.difficulty as string)],
    ['solution', isObject(raw.solution)],
    ['solution.requiredConnections', isStrTupleArray((raw.solution as Record<string, unknown>)?.requiredConnections)],
    ['solution.requiredToolEvidencePairs', isStrTupleArray((raw.solution as Record<string, unknown>)?.requiredToolEvidencePairs)],
    ['solution.justificationKeywords', Array.isArray((raw.solution as Record<string, unknown>)?.justificationKeywords)],
    ['outcome', isObject(raw.outcome)],
  ];

  for (const [field, ok] of checks) {
    if (!ok) throw new CaseLoadError(caseId, 'metadata.json', `invalid or missing '${field}'`);
  }

  const sol = raw.solution as Record<string, unknown>;
  const out = raw.outcome as Record<string, unknown>;
  const outcomeFields: [string, unknown][] = [
    ['successR0Delta', out.successR0Delta],
    ['successSigmaDelta', out.successSigmaDelta],
    ['failR0Delta', out.failR0Delta],
    ['failSigmaDelta', out.failSigmaDelta],
    ['partialR0Delta', out.partialR0Delta],
    ['partialSigmaDelta', out.partialSigmaDelta],
  ];

  for (const [field, val] of outcomeFields) {
    if (!isNum(val)) throw new CaseLoadError(caseId, 'metadata.json', `invalid or missing 'outcome.${field}'`);
  }

  if (!Array.isArray(sol.justificationKeywords) || !sol.justificationKeywords.every(isStr)) {
    throw new CaseLoadError(caseId, 'metadata.json', "invalid or missing 'solution.justificationKeywords'");
  }

  return raw as unknown as CaseMeta;
}

function validateScript(raw: unknown, caseId: string): CaseScript {
  if (!isObject(raw)) throw new CaseLoadError(caseId, 'script.json', 'not an object');

  const requiredFields: [string, boolean][] = [
    ['introCutscene', Array.isArray(raw.introCutscene)],
    ['evidenceFindings', isObject(raw.evidenceFindings)],
    ['toolHints', isObject(raw.toolHints)],
    ['conclusionText', isStr(raw.conclusionText)],
    ['milLesson', isStr(raw.milLesson)],
  ];

  for (const [field, ok] of requiredFields) {
    if (!ok) throw new CaseLoadError(caseId, 'script.json', `invalid or missing '${field}'`);
  }

  const frames = raw.introCutscene as unknown[];
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i] as Record<string, unknown>;
    if (!isStr(f.text) || !isNum(f.duration)) {
      throw new CaseLoadError(caseId, 'script.json', `introCutscene[${i}]: expected {text: string, duration: number}`);
    }
  }

  const findings = raw.evidenceFindings as Record<string, unknown>;
  for (const key of Object.keys(findings)) {
    if (!isStr(findings[key])) {
      throw new CaseLoadError(caseId, 'script.json', `evidenceFindings["${key}"]: expected string`);
    }
  }

  const hints = raw.toolHints as Record<string, unknown>;
  for (const key of Object.keys(hints)) {
    if (!isStr(hints[key])) {
      throw new CaseLoadError(caseId, 'script.json', `toolHints["${key}"]: expected string`);
    }
  }

  return raw as unknown as CaseScript;
}

function validateEvidence(raw: unknown, caseId: string): EvidenceItem[] {
  if (!isObject(raw) || !Array.isArray(raw.items)) {
    throw new CaseLoadError(caseId, 'evidence-items.json', 'expected {items: [...]}');
  }

  const items = raw.items as unknown[];
  for (let i = 0; i < items.length; i++) {
    const item = items[i] as Record<string, unknown>;
    if (
      !isStr(item.id) ||
      !isStr(item.label) ||
      !isStr(item.description) ||
      typeof item.isRedHerring !== 'boolean' ||
      !VALID_EVIDENCE_TYPES.includes(item.type as typeof VALID_EVIDENCE_TYPES[number])
    ) {
      throw new CaseLoadError(
        caseId,
        'evidence-items.json',
        `items[${i}]: expected {id, type, label, description, isRedHerring}`,
      );
    }
  }

  return items as EvidenceItem[];
}

function validateBoard(raw: unknown, caseId: string): EvidenceBoardData {
  if (!isObject(raw) || !Array.isArray(raw.nodes)) {
    throw new CaseLoadError(caseId, 'evidence-board.json', 'expected {nodes: [...]}');
  }

  const nodes = raw.nodes as unknown[];
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i] as Record<string, unknown>;
    if (!isStr(n.id) || !isNum(n.x) || !isNum(n.y) || !isStr(n.label)) {
      throw new CaseLoadError(
        caseId,
        'evidence-board.json',
        `nodes[${i}]: expected {id, x, y, label}`,
      );
    }
  }

  const cast = raw as unknown as EvidenceBoardData;
  for (const key of ['requiredConnections', 'hintConnections'] as const) {
    if (!isStrTupleArray(cast[key])) {
      throw new CaseLoadError(caseId, 'evidence-board.json', `invalid or missing '${key}'`);
    }
  }

  return cast;
}

async function fetchJSON<T>(caseId: string, file: string, validator: (d: unknown, id: string) => T): Promise<T> {
  const res = await fetch(`/cases/${caseId}/${file}`);
  if (!res.ok) {
    throw new CaseLoadError(caseId, file, `HTTP ${res.status} ${res.statusText}`);
  }
  const data: unknown = await res.json();
  return validator(data, caseId);
}

export async function loadCase(caseId: string): Promise<CaseData | null> {
  try {
    const [meta, script, evidence, board] = await Promise.all([
      fetchJSON(caseId, 'metadata.json', validateMeta),
      fetchJSON(caseId, 'script.json', validateScript),
      fetchJSON(caseId, 'evidence-items.json', validateEvidence),
      fetchJSON(caseId, 'evidence-board.json', validateBoard),
    ]);

    return { meta, script, evidence, board };
  } catch (err) {
    console.error('[GIHA CaseLoader]', caseId, err)
    const msg = err instanceof CaseLoadError
      ? `Failed to load case: "${caseId}". Returning to city overview.`
      : `Unexpected error loading case "${caseId}". Returning to city overview.`;

    useWarningStore.getState().addWarning(msg);
    return null;
  }
}

export async function loadCaseMeta(caseId: string): Promise<CaseMeta> {
  return fetchJSON(caseId, 'metadata.json', validateMeta);
}

export async function loadCaseScript(caseId: string): Promise<CaseScript> {
  return fetchJSON(caseId, 'script.json', validateScript);
}

export async function loadCaseEvidence(caseId: string): Promise<EvidenceItem[]> {
  return fetchJSON(caseId, 'evidence-items.json', validateEvidence);
}

export async function loadEvidenceBoard(caseId: string): Promise<EvidenceBoardData> {
  return fetchJSON(caseId, 'evidence-board.json', validateBoard);
}
