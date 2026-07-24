import type { EvidenceItem } from '../EvidenceCard'
import type { CaseData } from '../CaseLoader'

export interface ToolResult {
  findings: string[]
  confidence: number
  evidenceId: string
  timestamp: number
}

export interface Tool {
  id: string
  name: string
  icon: string
  description: string
  eligibility: (evidence: EvidenceItem) => boolean
  apply: (evidence: EvidenceItem, caseData: CaseData) => ToolResult
}
