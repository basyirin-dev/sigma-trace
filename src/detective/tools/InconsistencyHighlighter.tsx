export interface Annotation {
  x: number
  y: number
  width: number
  height: number
  label: string
}

export interface InconsistencyHighlighterProps {
  imageSrc: string
  finding?: string
  annotations?: Annotation[]
}

function getAnnotationColor(index: number): string {
  const colors = ['#ff4444', '#ffaa00', '#4ecdc4', '#f39c12', '#e74c3c', '#3498db']
  return colors[index % colors.length] ?? '#ff4444'
}

export function InconsistencyHighlighter({ imageSrc, finding, annotations }: InconsistencyHighlighterProps) {
  const hasAnnotations = annotations && annotations.length > 0

  return (
    <div data-testid="tool-inconsistency-highlighter" style={{ padding: '16px' }}>
      <div
        style={{
          position: 'relative',
          background: '#111',
          borderRadius: '8px',
          overflow: 'hidden',
          maxHeight: '360px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={imageSrc}
            alt="Evidence"
            data-testid="ih-image"
            style={{
              maxWidth: '100%',
              maxHeight: '360px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
          {hasAnnotations && annotations!.map((ann, i) => (
            <div
              key={i}
              data-testid={`ih-annotation-${i}`}
              title={ann.label}
              style={{
                position: 'absolute',
                left: `${ann.x}px`,
                top: `${ann.y}px`,
                width: `${ann.width}px`,
                height: `${ann.height}px`,
                border: `2px solid ${getAnnotationColor(i)}`,
                background: `${getAnnotationColor(i)}22`,
                borderRadius: '2px',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '0',
                  background: getAnnotationColor(i),
                  color: '#fff',
                  fontSize: '10px',
                  padding: '1px 6px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap',
                  fontFamily: 'monospace',
                }}
              >
                {ann.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: '12px',
          padding: '12px',
          background: hasAnnotations ? 'rgba(255, 170, 0, 0.1)' : 'rgba(46, 204, 113, 0.15)',
          borderRadius: '4px',
          borderLeft: `3px solid ${hasAnnotations ? '#f39c12' : '#2ecc71'}`,
          fontSize: '13px',
          color: hasAnnotations ? '#f0c060' : '#2ecc71',
          lineHeight: '1.5',
        }}
        data-testid="ih-finding"
      >
        {finding ? (
          <>🔍 {finding}</>
        ) : (
          <>
            🔍 Inconsistency analysis applied.
            {' '}The image has been checked for lighting mismatch, shadow anomalies, and compression artifacts.
            {' '}See findings in the evidence card details.
          </>
        )}
      </div>

      {hasAnnotations && (
        <div style={{ marginTop: '8px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {annotations!.map((ann, i) => (
            <div
              key={i}
              data-testid="ih-legend"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                color: '#888',
                fontFamily: 'monospace',
              }}
            >
              <span style={{
                width: '10px',
                height: '10px',
                background: getAnnotationColor(i),
                borderRadius: '2px',
                display: 'inline-block',
              }} />
              {ann.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
