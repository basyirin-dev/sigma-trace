export interface MetadataInspectorProps {
  metadata: Record<string, string>;
}

export function MetadataInspector(_props: MetadataInspectorProps) {
  return <div data-testid="tool-metadata-inspector" />;
}
