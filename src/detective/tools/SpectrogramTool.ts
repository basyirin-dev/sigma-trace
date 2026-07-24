import { BaseTool } from './BaseTool'
import type { EvidenceItem } from '../EvidenceCard'
import type { CaseData } from '../CaseLoader'
import type { ToolResult } from './types'

export class SpectrogramTool extends BaseTool {
  constructor() {
    super({
      id: 'spectrogram',
      name: 'Spectrogram',
      icon: '\u266A',
      description: 'Analyze audio frequency spectrum for AI-generated artifacts',
    })
  }

  eligibility(evidence: EvidenceItem): boolean {
    return evidence.type === 'audio'
  }

  apply(evidence: EvidenceItem, caseData: CaseData): ToolResult {
    this.ensureEvidenceType(evidence, 'audio')
    const raw = caseData.script.evidenceFindings[evidence.id]
    if (raw) {
      const sentences = raw.match(/[^.!?]+[.!?]+/g) ?? [raw]
      return this.makeResult(evidence.id, sentences.map((s) => s.trim()), 0.82)
    }
    return this.makeResult(evidence.id, [
      'The 2-4kHz frequency range shows unusually consistent energy distribution with periodic troughs — a signature of AI-generated speech',
      'Human voices have natural micro-variations in this range that the synthesis model failed to replicate',
    ], 0.85)
  }
}
