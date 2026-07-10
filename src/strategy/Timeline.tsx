export interface TimelineProps {
  time: number;
  totalTime: number;
}

export function Timeline(_props: TimelineProps) {
  return <div data-testid="timeline" />;
}
