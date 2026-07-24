import type { CaseData } from './CaseLoader'
import type { TraceEvent } from './tools/SourceTracer'
import type { Annotation } from './tools/InconsistencyHighlighter'

export interface InconsistencyFeedback {
  finding: string
  annotations: Annotation[]
}

export function buildEvidenceFindings(script: CaseData['script']): Record<string, string> {
  return { ...script.evidenceFindings }
}

export function buildCaseMetadata(caseId: string, evidenceId: string): Record<string, string> {
  const meta: Record<string, Record<string, Record<string, string>>> = {
    'case-01': {
      'evidence-03': {
        'File Name': 'mayor_resignation_viral.mp4',
        'Creation Time': '2:47 AM',
        'Software': 'Vegas Pro 21.0',
        'Device': 'Unknown (VM fingerprint)',
        'Duration': '30.2s',
        'Resolution': '1920x1080',
        'Codec': 'H.264 \u2014 AI upscale layer detected',
      },
      'evidence-06': {
        'Upload IP': '185.220.101.47',
        'VPN Provider': 'Anonymous VPN (flagged)',
        'Data Center': 'DigitalOcean \u2014 Frankfurt',
        'Shell Company': 'VeraTech Solutions LLC',
        'Registered': 'Overseas jurisdiction (confidential)',
        'Upload Method': 'Direct HTTP POST \u2014 no referrer header',
      },
    },
    'case-02': {
      'evidence-03': {
        'Caller ID': '+1 (555) 0198 \u2014 Spoofed',
        'Actual Origin': 'VoIP: VeraTech Solutions LLC',
        'Route Path': 'Malaysia \u2192 Panama \u2192 Germany \u2192 Veritas',
        'Call Duration': '22 seconds',
        'Timestamp': '3:14 AM (local)',
        'Encryption': 'Standard VoIP (OPUS codec)',
        'Registration': 'Number not registered to any carrier (VoIP-only)',
      },
      'evidence-06': {
        'Account': 'Numbered account #8842',
        'Account Type': 'Offshore holding (anonymous)',
        'Sender': 'VeraTech Solutions LLC',
        'Amount': '$5,000 USD',
        'Memo': '\u201CHarborview deployment \u2014 phase 2\u201D',
        'Transaction Date': '3 days before first scam call',
        'Account Beneficiary': 'Unknown (escrow holding)',
      },
    },
    'case-03': {
      'evidence-03': {
        'Camera': 'Canon EOS 5D Mark IV',
        'Lens': 'EF 24-70mm f/2.8L II USM',
        'Focal Length': '35mm',
        'Aperture': 'f/5.6',
        'Shutter Speed': '1/250s',
        'Timestamp': '11:47 AM',
        'GPS Coordinates': '48.8566\u00b0 N, 2.3522\u00b0 E',
        'GPS Location': 'City 2,000km from Veritas',
        'Photographer': 'pixel_journalist \u2014 linked to disinformation network',
        'Copyright': 'None (stripped from original)',
      },
      'evidence-06': {
        'Platform': 'Veritas Social Feed',
        'Total Shares': '50,000+ in 3 hours',
        'Expected Organic Rate': '200-500 shares/hour',
        'Actual Rate': '16,667 shares/hour',
        'Bot IP Cluster': 'VeraTech Solutions data centers',
        'Bot Share Ratio': '78% of all shares',
        'Geographic Spread': '85% from outside Veritas (abnormal)',
        'Growth Curve': '\u201CExplosive\u201D \u2014 matches known bot patterns',
      },
    },
  }

  return meta[caseId]?.[evidenceId] ?? {}
}

export function buildSourceTraceEvents(caseId: string, _evidenceId: string): TraceEvent[] {
  if (caseId === 'case-03') {
    return [
      { time: '2 years ago', label: 'Photo Captured', detail: 'Original photo of labor protest taken in European city \u2014 camera: Canon 5D Mk IV', suspicious: false },
      { time: '2 years ago', label: 'Posted to Photography Forum', detail: 'Photographer uploads to forum under username \u201Cpixel_journalist\u201D \u2014 no connections to Veritas', suspicious: false },
      { time: '1 week ago', label: 'Scraped from Forum', detail: 'Bot scrapes high-res photo from forum \u2014 original metadata intact', suspicious: true },
      { time: '6 days ago', label: 'Metadata Stripped', detail: 'Original EXIF removed, fake coordinates injected, caption rewritten', suspicious: true },
      { time: '6 hours ago', label: 'Uploaded with False Caption', detail: 'Posted to Veritas social feed with caption \u201CThis is Veritas now. Fight back.\u201D', suspicious: true },
      { time: '3 hours ago', label: 'Bot Amplification Begins', detail: '78% of shares from VeraTech-controlled IPs \u2014 50,000 shares in 3h', suspicious: true },
      { time: 'Now', label: 'GIHA Investigation', detail: 'Photo flagged by automated system \u2014 lighting mismatch detected against Veritas latitude', suspicious: false },
    ]
  }
  if (caseId === 'case-02') {
    return [
      { time: '3 days ago', label: 'Account Opened', detail: 'Numbered account #8842 opened at offshore bank with $0 balance', suspicious: true },
      { time: '3 days ago', label: 'Payment Received', detail: '$5,000 wired from VeraTech Solutions LLC \u2014 memo: \u201CHarborview deployment \u2014 phase 2\u201D', suspicious: true },
      { time: '2 days ago', label: 'VoIP Numbers Registered', detail: '12 VoIP numbers registered through anonymous proxy in Malaysia', suspicious: true },
      { time: '2 days ago', label: 'Browser Game Domain Purchased', detail: 'Domain \u201Cfunvoicechanger.net\u201D registered via privacy proxy', suspicious: true },
      { time: '1 day ago', label: 'Audio Capture Script Deployed', detail: 'Browser game deployed on domain \u2014 captures 3s of microphone input', suspicious: true },
      { time: 'Today', label: 'First Scam Call', detail: 'Mrs. Kowalski receives cloned voicemail at 3:14 AM', suspicious: true },
      { time: 'Today', label: 'GIHA Alert', detail: 'Pattern matching detects voice scam M.O. across 12 reports', suspicious: false },
    ]
  }

  return [
    { time: '2:47 AM', label: 'File Created', detail: 'Vegas Pro project saved \u2014 metadata timestamp', suspicious: true },
    { time: '3:12 AM', label: 'Upload Initiated', detail: 'VPN connection established \u2014 IP: 185.220.101.x (data center range)', suspicious: true },
    { time: '3:14 AM', label: 'File Uploaded', detail: 'Video uploaded to anonymous file host \u2014 23 MB, single seed', suspicious: true },
    { time: '3:18 AM', label: 'First Share', detail: 'Posted to Veritas social feed \u2014 account created 48h ago', suspicious: true },
    { time: '3:45 AM', label: 'Bot Amplification Begins', detail: 'Bot amplification detected \u2014 78% shares from coordinated IPs', suspicious: true },
    { time: '4:00 AM', label: 'GIHA Intercept', detail: 'Flagged by automated disinformation detection system', suspicious: false },
    { time: '7:00 AM', label: 'Current Time', detail: '1,500+ shares, 15,000 reactions \u2014 city in crisis', suspicious: false },
  ]
}

export function buildSourceTraceSummary(caseId: string): string {
  if (caseId === 'case-03') {
    return 'The photo was taken 2 years ago during an unrelated labor protest in a city 2,000km northeast of Veritas \u2014 confirmed by GPS coordinates embedded in the original file. The photographer (pixel_journalist) is a known contributor to the photography forum where the photo was scraped. A VeraTech-operated bot network amplified the reposted, misattributed version to 50,000 shares in 3 hours \u2014 the same bot infrastructure that amplified Cases 1 and 2. This is a coordinated misattribution campaign, not a genuine citizen report.'
  }
  if (caseId === 'case-02') {
    return 'The financial trail is clear: VeraTech Solutions funded the Harborview voice scam operation with a $5,000 payment to an offshore numbered account. The same shell company that financed the deepfake in Case 1. The browser game domain, VoIP numbers, and capture infrastructure were all purchased within a 48-hour window. This was a coordinated, funded operation, not a lone scammer.'
  }

  return 'The upload timeline reveals an impossible creation-to-publish window of 25 minutes \u2014 far too fast for authentic content. The VPN IP traces to a data center range linked to VeraTech Solutions, the same shell company funding the voice scam operation. Origin: 185.220.101.x (data center).'
}

export function buildTimelineEvents(caseId: string, _evidenceId: string): { time: string; label: string }[] {
  if (caseId === 'case-03') {
    return [
      { time: '2 years ago', label: 'Photo captured in European city during labor protest' },
      { time: '2 years ago', label: 'Photographer uploads to forum (pixel_journalist)' },
      { time: '1 week ago', label: 'Photo scraped from forum by automated tool' },
      { time: '6 days ago', label: 'EXIF stripped, fake GPS injected, caption rewritten' },
      { time: '6 hours ago', label: 'Uploaded to Veritas feed as \u201Cbreaking news\u201D' },
      { time: '3 hours ago', label: 'Bot amplification: 50,000 shares via VeraTech IPs' },
      { time: 'Now', label: 'GIHA investigation initiated \u2014 lighting mismatch detected' },
    ]
  }
  if (caseId === 'case-02') {
    return [
      { time: '3:12 AM', label: 'Grandson clicks browser game link \u2014 3 seconds of audio captured' },
      { time: '3:13 AM', label: 'AI voice clone generated from sample (ElevenLabs-style synthesis)' },
      { time: '3:14 AM', label: 'VoIP call placed from VeraTech server in Malaysia' },
      { time: '3:14 AM', label: 'Call routed: Malaysia \u2192 Panama \u2192 Germany \u2192 Veritas' },
      { time: '3:14:01 AM', label: 'Call terminates in Harborview (Mrs. Kowalski)' },
      { time: '3:14:02 AM', label: 'Voicemail recorded on first ring (scammer reads cloned lines)' },
    ]
  }

  return [
    { time: '2:47 AM', label: 'File created in Vegas Pro' },
    { time: '3:12 AM', label: 'VPN connection established (VeraTech IP range)' },
    { time: '3:14 AM', label: 'File uploaded to anonymous host' },
    { time: '3:18 AM', label: 'First share on Veritas social feed' },
    { time: '3:45 AM', label: 'Bot amplification begins \u2014 78% from coordinated IPs' },
    { time: '4:00 AM', label: 'GIHA intercepts and flags content' },
  ]
}

export function timelineCrossReferenceSummary(caseId: string, eventsCount: number): string {
  if (caseId === 'case-03') {
    const suspicious = 4
    return `Timeline cross-reference complete. ${suspicious} of ${eventsCount} events flagged. The photo existed 2 years before its claimed capture date. 50,000 shares in 3 hours is impossible organically \u2014 average organic rate is 200-500/hour. The metadata strip + repost pattern (\u201Cforum scrape\u201D \u2192 \u201Cstripped EXIF\u201D \u2192 \u201Cfalse caption\u201D) is a known disinformation workflow.`
  }
  if (caseId === 'case-02') {
    const suspicious = 3
    return `Timeline cross-reference complete. ${suspicious} of ${eventsCount} events flagged. The call routing is physically impossible: the data shows the call traversing 3 countries (Malaysia \u2192 Panama \u2192 Germany \u2192 Veritas) in under 1 second. Each routing hop typically adds 50-200ms latency. A 4-hop international route cannot complete in <1 second. Additionally, the AI clone generation window (3:13) to call placement (3:14) is unrealistic \u2014 voice cloning takes at least 60 seconds with current technology.`
  }

  const suspicious = 5
  return `Timeline cross-reference complete. ${suspicious} of ${eventsCount} events flagged. The 25-minute creation-to-publish window is inconsistent with authentic video production. Normal video editing and export takes 30-60 minutes minimum.`
}

export function buildInconsistencyFeedback(caseId: string, evidenceId: string): InconsistencyFeedback | null {
  if (caseId === 'case-03' && evidenceId === 'evidence-02') {
    return {
      finding: 'Sun position analysis complete. The photo shows the sun at 40\u00b0 elevation from the northeast (calculated from shadow fall direction and object height ratios). At Veritas\u2019s latitude (37\u00b0 N) on this date and time, the sun should be at 25\u00b0 elevation from the southeast. This 15\u00b0 discrepancy is definitive proof the photo was not taken in Veritas. The calculated sun position is consistent with a location approximately 2,000km north-northeast of Veritas \u2014 matching the GPS coordinates embedded in the photo.',
      annotations: [
        { x: 240, y: 60, width: 50, height: 50, label: 'Actual Sun (40\u00b0 NE)' },
        { x: 140, y: 100, width: 50, height: 50, label: 'Expected Sun (25\u00b0 SE)' },
      ],
    }
  }
  if (caseId === 'case-03' && evidenceId === 'evidence-01') {
    return {
      finding: 'Architectural analysis complete. The storefront signs visible in the upper-right quadrant are in a European-style script with measurements in metric units (meters) \u2014 inconsistent with Veritas\u2019s North American building codes and Imperial measurement standards. The roofline architecture matches Central European construction styles (stepped gable), not coastal North American (flat or sloped). This is consistent with the GPS location embedded in the file metadata.',
      annotations: [
        { x: 480, y: 40, width: 120, height: 60, label: 'European architecture' },
        { x: 520, y: 120, width: 100, height: 30, label: 'Metric signage' },
      ],
    }
  }
  return null
}
