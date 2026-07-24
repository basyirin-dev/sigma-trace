export interface MockCall {
  method: string
  args: unknown[]
}

export interface MockCanvasContext {
  ctx: CanvasRenderingContext2D
  calls: MockCall[]
  props: Record<string, unknown>
}

export function createMockCanvasContext(): MockCanvasContext {
  const calls: MockCall[] = []
  const props: Record<string, unknown> = {
    fillStyle: '#000',
    strokeStyle: '#000',
    globalAlpha: 1,
    font: '',
    lineWidth: 1,
    lineCap: 'butt' as CanvasLineCap,
    textAlign: 'start',
    textBaseline: 'alphabetic',
  }

  function record(method: string, args: unknown[] = []) {
    calls.push({ method, args })
  }

  const ctx = {
    get fillStyle() {
      return props.fillStyle as string
    },
    set fillStyle(v: string) {
      props.fillStyle = v
      record('fillStyle', [v])
    },
    get strokeStyle() {
      return props.strokeStyle as string
    },
    set strokeStyle(v: string) {
      props.strokeStyle = v
      record('strokeStyle', [v])
    },
    get globalAlpha() {
      return props.globalAlpha as number
    },
    set globalAlpha(v: number) {
      props.globalAlpha = v
      record('globalAlpha', [v])
    },
    get font() {
      return props.font as string
    },
    set font(v: string) {
      props.font = v
      record('font', [v])
    },
    get lineWidth() {
      return props.lineWidth as number
    },
    set lineWidth(v: number) {
      props.lineWidth = v
      record('lineWidth', [v])
    },
    get lineCap(): CanvasLineCap {
      return props.lineCap as CanvasLineCap
    },
    set lineCap(v: CanvasLineCap) {
      props.lineCap = v
      record('lineCap', [v])
    },
    get textAlign() {
      return props.textAlign as CanvasTextAlign
    },
    set textAlign(v: CanvasTextAlign) {
      props.textAlign = v
      record('textAlign', [v])
    },
    get textBaseline() {
      return props.textBaseline as CanvasTextBaseline
    },
    set textBaseline(v: CanvasTextBaseline) {
      props.textBaseline = v
      record('textBaseline', [v])
    },

    clearRect: (...args: number[]) => record('clearRect', [...args]),
    fillRect: (...args: number[]) => record('fillRect', [...args]),
    strokeRect: (...args: number[]) => record('strokeRect', [...args]),
    fillText: (...args: unknown[]) => record('fillText', [...args]),
    beginPath: () => record('beginPath'),
    arc: (...args: number[]) => record('arc', [...args]),
    fill: () => record('fill'),
    stroke: () => record('stroke'),
    moveTo: (x: number, y: number) => record('moveTo', [x, y]),
    lineTo: (x: number, y: number) => record('lineTo', [x, y]),
    save: () => record('save'),
    restore: () => record('restore'),
    closePath: () => record('closePath'),
  } as unknown as CanvasRenderingContext2D

  return { ctx, calls, props }
}
