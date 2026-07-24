export interface TraceEvent {
  time: string
  label: string
  detail: string
  suspicious?: boolean
}

export interface SourceTracerProps {
  assetSrc: string
  events?: TraceEvent[]
  summary?: string
}

const DEFAULT_EVENTS: TraceEvent[] = [
  { time: '2:47 AM', label: 'File Created', detail: 'Vegas Pro project saved — metadata timestamp', suspicious: true },
  { time: '3:12 AM', label: 'Upload Initiated', detail: 'VPN connection established — IP: 185.220.101.x (data center range)', suspicious: true },
  { time: '3:14 AM', label: 'File Uploaded', detail: 'Video uploaded to anonymous file host — 23 MB, single seed', suspicious: true },
  { time: '3:18 AM', label: 'First Share', detail: 'Posted to Veritas social feed — account created 48h ago', suspicious: true },
  { time: '3:45 AM', label: 'Viral Spread Begins', detail: 'Bot amplification detected — 78% shares from coordinated IPs', suspicious: true },
  { time: '4:00 AM', label: 'GIHA Intercept', detail: 'Flagged by automated disinformation detection system', suspicious: false },
  { time: '7:00 AM', label: 'Current Time', detail: '1,500+ shares, 15,000 reactions — city in crisis', suspicious: false },
]

const DEFAULT_SUMMARY = 'The upload timeline reveals an impossible creation-to-publish window of 25 minutes — far too fast for authentic content. The VPN IP traces to a data center range linked to VeraTech Solutions, the same shell company funding the voice scam operation. Origin: 185.220.101.x (data center).'

export function SourceTracer({ events, summary }: SourceTracerProps) {
  const traceEvents = events ?? DEFAULT_EVENTS
  const traceSummary = summary ?? DEFAULT_SUMMARY

  return (
    <div data-testid="tool-source-tracer" style={{ padding: '16px' }}>
      <div style={{ position: 'relative', paddingLeft: '32px' }}>
        {traceEvents.map((event, i) => (
          <div
            key={i}
            data-testid="st-event"
            style={{
              position: 'relative',
              paddingBottom: i < traceEvents.length - 1 ? '20px' : '0',
              paddingLeft: '20px',
              borderLeft: i < traceEvents.length - 1 ? '2px solid #444' : 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '-7px',
                top: '4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: event.suspicious ? '#ff4444' : '#2ecc71',
                border: '2px solid #1a1a2e',
              }}
            />

            <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
              <span style={{ color: '#666', fontSize: '12px', fontFamily: 'monospace', minWidth: '60px' }}>
                {event.time}
              </span>
              <span
                style={{
                  color: event.suspicious ? '#ff8888' : '#ccc',
                  fontWeight: event.suspicious ? 'bold' : 'normal',
                  fontSize: '14px',
                }}
              >
                {event.suspicious && '⚠ '}
                {event.label}
              </span>
            </div>
            <div style={{ color: '#888', fontSize: '12px', marginLeft: '72px', marginTop: '2px' }}>
              {event.detail}
            </div>

            {event.suspicious && (
              <div
                data-testid="st-flag"
                style={{
                  marginLeft: '72px',
                  marginTop: '4px',
                  color: '#ff6666',
                  fontSize: '11px',
                  background: 'rgba(255,68,68,0.1)',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  display: 'inline-block',
                }}
              >
                Flagged
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(46, 204, 113, 0.15)',
          borderRadius: '4px',
          borderLeft: '3px solid #2ecc71',
          fontSize: '13px',
          color: '#2ecc71',
          lineHeight: '1.5',
        }}
        data-testid="st-summary"
      >
        🔍 {traceSummary}
      </div>
    </div>
  )
}
