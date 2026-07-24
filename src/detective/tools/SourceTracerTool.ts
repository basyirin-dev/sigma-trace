import { BaseTool } from './BaseTool'
import type { EvidenceItem } from '../EvidenceCard'
import type { CaseData } from '../CaseLoader'
import type { ToolResult } from './types'

export class SourceTracerTool extends BaseTool {
  constructor() {
    super({
      id: 'source-tracer',
      name: 'Source Tracer',
      icon: '\u25CB',
      description: 'Trace the provenance and distribution path of digital evidence',
    })
  }

  eligibility(_evidence: EvidenceItem): boolean {
    return true
  }

  apply(evidence: EvidenceItem, caseData: CaseData): ToolResult {
    const raw = caseData.script.evidenceFindings[evidence.id]
    if (raw) {
      const sentences = raw.match(/[^.!?]+[.!?]+/g) ?? [raw]
      return this.makeResult(evidence.id, sentences.map((s) => s.trim()), 0.68)
    }
    return this.makeResult(evidence.id, [
      'Provenance trace completed — cross-reference timeline for origin anomalies',
    ], 0.6)
  }
}
