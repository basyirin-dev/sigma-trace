import { BaseTool } from './BaseTool'
import type { EvidenceItem } from '../EvidenceCard'
import type { CaseData } from '../CaseLoader'
import type { ToolResult } from './types'

export class MetadataInspectorTool extends BaseTool {
  constructor() {
    super({
      id: 'metadata-inspector',
      name: 'Metadata Inspector',
      icon: '\u2699',
      description: 'Inspect file metadata and EXIF for anomalies and tampering signs',
    })
  }

  eligibility(_evidence: EvidenceItem): boolean {
    return true
  }

  apply(evidence: EvidenceItem, caseData: CaseData): ToolResult {
    const raw = caseData.script.evidenceFindings[evidence.id]
    if (raw) {
      const sentences = raw.match(/[^.!?]+[.!?]+/g) ?? [raw]
      return this.makeResult(evidence.id, sentences.map((s) => s.trim()), 0.72)
    }
    return this.makeResult(evidence.id, [
      'Metadata analysis completed — cross-reference with known tampering signatures',
    ], 0.5)
  }
}
