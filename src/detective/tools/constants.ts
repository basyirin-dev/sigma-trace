import type { EvidenceType } from '../EvidenceCard'

export interface ToolDef {
  id: string
  label: string
  icon: string
  affinity: EvidenceType[]
  tooltip: string
}

export const TOOLS: ToolDef[] = [
  {
    id: 'spectrogram',
    label: 'Spectrogram',
    icon: '\u266A',
    affinity: ['audio'],
    tooltip: 'Visualizes audio frequency spectrum to detect synthetic voice patterns and audio artifacts',
  },
  {
    id: 'frame-stepper',
    label: 'Frame Step',
    icon: '\u25B6',
    affinity: ['video'],
    tooltip: 'Advances through video frame-by-frame to detect lip-sync mismatches and editing artifacts',
  },
  {
    id: 'metadata-inspector',
    label: 'Metadata',
    icon: '\u2699',
    affinity: ['video', 'audio', 'image', 'text', 'metadata'],
    tooltip: 'Examines file metadata, timestamps, GPS coordinates, and software signatures for inconsistencies',
  },
  {
    id: 'source-tracer',
    label: 'Source',
    icon: '\u25CB',
    affinity: ['image', 'video', 'text'],
    tooltip: 'Traces the origin and propagation path of content through networks, documents, and platforms',
  },
  {
    id: 'inconsistency-highlighter',
    label: 'Inconsist.',
    icon: '\u26A1',
    affinity: ['image', 'video'],
    tooltip: 'Highlights visual and contextual inconsistencies in images and video frames',
  },
  {
    id: 'timeline-cross-referencer',
    label: 'Timeline',
    icon: '\u2195',
    affinity: ['video', 'audio', 'image', 'text', 'metadata'],
    tooltip: 'Cross-references timestamps and events to detect impossible creation-to-publication windows',
  },
]

export function getToolDef(id: string): ToolDef | undefined {
  return TOOLS.find((t) => t.id === id)
}

export const TOOL_AFFINITY_MAP = Object.fromEntries(
  TOOLS.map((t) => [t.id, t.affinity]),
) as Record<string, EvidenceType[]>
