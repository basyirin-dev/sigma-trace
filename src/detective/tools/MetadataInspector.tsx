export interface MetadataInspectorProps {
  metadata: Record<string, string>
}

const SUSPICIOUS_KEYWORDS = ['vegas', 'vpn', 'proxy', 'anonymous', 'fake', 'unknown', 'shell company', '2:47']

export function MetadataInspector({ metadata }: MetadataInspectorProps) {
  const entries = Object.entries(metadata)

  const isSuspicious = (value: string): boolean => {
    const lower = value.toLowerCase()
    return SUSPICIOUS_KEYWORDS.some((kw) => lower.includes(kw))
  }

  return (
    <div data-testid="tool-metadata-inspector" style={{ padding: '16px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '8px 16px',
          fontFamily: 'monospace',
          fontSize: '13px',
        }}
      >
        <div style={{ color: '#888', fontWeight: 'bold', borderBottom: '1px solid #333', paddingBottom: '4px' }}>
          FIELD
        </div>
        <div style={{ color: '#888', fontWeight: 'bold', borderBottom: '1px solid #333', paddingBottom: '4px' }}>
          VALUE
        </div>

        {entries.map(([key, value]) => (
          <div key={key} data-testid="mi-row">
            <div
              style={{
                color: '#aaa',
                padding: '4px 0',
                borderBottom: '1px solid #222',
              }}
            >
              {key}
            </div>
            <div
              data-testid={isSuspicious(value) ? 'mi-suspicious' : undefined}
              style={{
                padding: '4px 0',
                borderBottom: '1px solid #222',
                color: isSuspicious(value) ? '#ff6666' : '#ddd',
                background: isSuspicious(value) ? 'rgba(255,68,68,0.08)' : 'transparent',
                paddingLeft: isSuspicious(value) ? '8px' : '0',
                borderRadius: '2px',
                fontWeight: isSuspicious(value) ? 'bold' : 'normal',
              }}
            >
              {isSuspicious(value) && (
                <span style={{ marginRight: '6px' }}>⚠</span>
              )}
              {value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(255,68,68,0.1)',
          borderRadius: '4px',
          borderLeft: '3px solid #ff4444',
          fontSize: '13px',
          color: '#ff8888',
          lineHeight: '1.5',
        }}
        data-testid="mi-summary"
      >
        ⚠ {entries.length} field(s) analyzed.
        {' '}{entries.filter(([, v]) => isSuspicious(v)).length} suspicious value(s) detected — highlighted in red.
      </div>
    </div>
  )
}
