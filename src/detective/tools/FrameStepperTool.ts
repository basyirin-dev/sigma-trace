import { BaseTool } from './BaseTool'
import type { EvidenceItem } from '../EvidenceCard'
import type { CaseData } from '../CaseLoader'
import type { ToolResult } from './types'

export class FrameStepperTool extends BaseTool {
  constructor() {
    super({
      id: 'frame-stepper',
      name: 'Frame Stepper',
      icon: '\u25B6',
      description: 'Step through video frames to detect lip-sync and temporal inconsistencies',
    })
  }

  eligibility(evidence: EvidenceItem): boolean {
    return evidence.type === 'video'
  }

  apply(evidence: EvidenceItem, caseData: CaseData): ToolResult {
    this.ensureEvidenceType(evidence, 'video')
    const raw = caseData.script.evidenceFindings[evidence.id]
    if (raw) {
      const sentences = raw.match(/[^.!?]+[.!?]+/g) ?? [raw]
      return this.makeResult(evidence.id, sentences.map((s) => s.trim()), 0.78)
    }
    return this.makeResult(evidence.id, [
      'Lip-sync mismatch detected at frames 120-150: audio and video tracks offset by approximately 3 frames',
      'Consistent with AI-generated deepfake assembly pipeline',
    ], 0.78)
  }
}
