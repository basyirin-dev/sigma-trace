import { BaseTool } from './BaseTool'
import type { EvidenceItem } from '../EvidenceCard'
import type { CaseData } from '../CaseLoader'
import type { ToolResult } from './types'

export class TimelineCrossReferencerTool extends BaseTool {
  constructor() {
    super({
      id: 'timeline-cross-referencer',
      name: 'Timeline Cross-Referencer',
      icon: '\u2195',
      description: 'Cross-reference event timelines to detect temporal inconsistencies',
    })
  }

  eligibility(_evidence: EvidenceItem): boolean {
    return true
  }

  apply(evidence: EvidenceItem, caseData: CaseData): ToolResult {
    const raw = caseData.script.evidenceFindings[evidence.id]
    if (raw) {
      const sentences = raw.match(/[^.!?]+[.!?]+/g) ?? [raw]
      return this.makeResult(evidence.id, sentences.map((s) => s.trim()), 0.62)
    }
    return this.makeResult(evidence.id, [
      'Timeline cross-reference completed — suspicious events flagged for review',
    ], 0.55)
  }
}
