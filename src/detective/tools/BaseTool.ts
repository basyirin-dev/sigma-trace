import type { Tool, ToolResult } from './types'
import type { EvidenceItem } from '../EvidenceCard'
import type { CaseData } from '../CaseLoader'

export abstract class BaseTool implements Tool {
  readonly id: string
  readonly name: string
  readonly icon: string
  readonly description: string

  constructor(config: { id: string; name: string; icon: string; description: string }) {
    this.id = config.id
    this.name = config.name
    this.icon = config.icon
    this.description = config.description
  }

  abstract eligibility(evidence: EvidenceItem): boolean

  abstract apply(evidence: EvidenceItem, caseData: CaseData): ToolResult

  protected ensureEvidenceType(evidence: EvidenceItem, ...types: EvidenceItem['type'][]): void {
    if (!types.includes(evidence.type)) {
      throw new Error(
        `Tool "${this.id}" requires evidence of type ${types.join(' | ')}, got "${evidence.type}"`,
      )
    }
  }

  protected makeResult(evidenceId: string, findings: string[], confidence: number): ToolResult {
    return {
      findings,
      confidence: Math.min(1, Math.max(0, confidence)),
      evidenceId,
      timestamp: Date.now(),
    }
  }
}
