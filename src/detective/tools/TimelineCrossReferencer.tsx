export interface TimelineCrossReferencerProps {
  events: { time: string; label: string }[];
}

export function TimelineCrossReferencer(_props: TimelineCrossReferencerProps) {
  return <div data-testid="tool-timeline-cross-referencer" />;
}
