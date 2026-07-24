import { BaseTool } from './BaseTool'
import type { EvidenceItem } from '../EvidenceCard'
import type { CaseData } from '../CaseLoader'
import type { ToolResult } from './types'

export class InconsistencyHighlighterTool extends BaseTool {
  constructor() {
    super({
      id: 'inconsistency-highlighter',
      name: 'Inconsistency Highlighter',
      icon: '\u26A1',
      description: 'Detect visual anomalies in images: lighting, shadows, compression artifacts',
    })
  }

  eligibility(evidence: EvidenceItem): boolean {
    return evidence.type === 'image'
  }

  apply(evidence: EvidenceItem, caseData: CaseData): ToolResult {
    this.ensureEvidenceType(evidence, 'image')
    const raw = caseData.script.evidenceFindings[evidence.id]
    if (raw) {
      const sentences = raw.match(/[^.!?]+[.!?]+/g) ?? [raw]
      return this.makeResult(evidence.id, sentences.map((s) => s.trim()), 0.82)
    }
    return this.makeResult(evidence.id, [
      'Lighting mismatch detected: sun position analysis shows 15\u00B0 elevation discrepancy',
      'Shadow direction inconsistent with claimed geographic location',
    ], 0.82)
  }
}
