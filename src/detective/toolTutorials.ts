export interface ToolTutorialContent {
  tip: string
  indicators: string[]
}

export const TOOL_TUTORIALS: Record<string, ToolTutorialContent> = {
  'spectrogram': {
    tip: 'AI-generated voices often have unnaturally uniform frequency distribution because they lack the natural micro-variations of human speech in the 2-4kHz range',
    indicators: [
      'Red overlay marks the 2-4kHz AI artifact zone — AI speech shows consistent energy here',
      'Natural voices produce irregular spikes and valleys across frequency bands',
      'Synthetic audio has periodic troughs where the model fails to replicate natural variation',
    ],
  },
  'frame-stepper': {
    tip: 'Deepfake videos commonly exhibit lip-sync mismatches where mouth movements and audio are offset by 1-3 frames across the seam boundary',
    indicators: [
      'Step through frames 120-150 to spot the lip-sync mismatch region',
      'Edge detection overlay reveals blending artifacts around the mouth and eyes',
      'Inconsistent edge density in facial regions indicates compositing',
    ],
  },
  'metadata-inspector': {
    tip: 'File metadata contains creation timestamps, software signatures, and GPS coordinates that reveal manipulation history — even when the visual content appears authentic',
    indicators: [
      'Late-night timestamps (2-5 AM) correlate with automated fabrication workflows',
      'Editing software like Photoshop or Vegas Pro indicates post-processing',
      'Zeroed or stripped GPS coordinates suggest intentional location obfuscation',
    ],
  },
  'source-tracer': {
    tip: 'Disinformation campaigns commonly funnel content through multiple fake accounts and bot networks operating within seconds of each other to manufacture legitimacy',
    indicators: [
      'Multiple origin accounts at the same timestamp indicate coordinated bot posting',
      'A clean single-source path shows one original creator followed by organic shares',
      'Impossible propagation speed — authentic content spreads over hours, not seconds',
    ],
  },
  'inconsistency-highlighter': {
    tip: 'Composited images contain gradient direction mismatches at seam boundaries where two pictures were joined — the eye may not see them but gradient analysis reveals them',
    indicators: [
      'Red heatmap zones show where gradient direction changes abruptly between neighboring pixels',
      'Natural photographs have consistent gradient flow across the entire image',
      'Lighting direction should be uniform across all quadrants — mismatches indicate compositing',
    ],
  },
  'timeline-cross-referencer': {
    tip: 'Fabricated evidence often has contradictory timestamps that reveal impossible creation-to-publication windows — video editing alone typically requires 30+ minutes',
    indicators: [
      'Create-to-upload gaps under 30 minutes flagged as high-severity conflicts',
      'Events timestamped 2-5 AM marked as suspicious late-night activity windows',
      'Cross-reference detected conflicts with evidence metadata for full verification',
    ],
  },
}
