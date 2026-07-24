export interface TimelineCrossReferencerProps {
  events: { time: string; label: string }[]
}

export function TimelineCrossReferencer({ events }: TimelineCrossReferencerProps) {
  const timeline = events.map((e) => ({
    ...e,
    detail: 'detail' in e ? String(e.detail) : '',
    suspicious: 'suspicious' in e ? Boolean(e.suspicious) : false,
  }))

  return (
    <div data-testid="tool-timeline-cross-referencer" style={{ padding: '16px' }}>
      <div style={{ position: 'relative', paddingLeft: '32px' }}>
        {timeline.map((event, i) => (
          <div
            key={i}
            data-testid="tcr-event"
            style={{
              position: 'relative',
              paddingBottom: i < timeline.length - 1 ? '24px' : '0',
              paddingLeft: '20px',
              borderLeft: i < timeline.length - 1 ? '2px solid #555' : 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '-7px',
                top: '2px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: event.suspicious ? '#ff4444' : '#4a4a8a',
                border: '2px solid #1a1a2e',
              }}
            />

            <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
              <span style={{ color: '#888', fontSize: '11px', fontFamily: 'monospace', minWidth: '80px' }}>
                {event.time}
              </span>
              <span
                style={{
                  color: event.suspicious ? '#ff8888' : '#ccc',
                  fontWeight: event.suspicious ? 'bold' : 'normal',
                  fontSize: '13px',
                }}
              >
                {event.suspicious && '⚠ '}
                {event.label}
              </span>
            </div>
            {event.detail && (
              <div style={{ color: '#666', fontSize: '11px', marginLeft: '92px', marginTop: '2px' }}>
                {event.detail}
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(255, 170, 0, 0.1)',
          borderRadius: '4px',
          borderLeft: '3px solid #f39c12',
          fontSize: '13px',
          color: '#f0c060',
          lineHeight: '1.5',
        }}
        data-testid="tcr-insight"
      >
        ⏱ Timeline cross-reference complete. {timeline.filter((e) => e.suspicious).length} of {timeline.length} event(s) flagged.
      </div>
    </div>
  )
}
