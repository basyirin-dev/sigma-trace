export interface ToolbeltProps {
  activeTool: string | null;
  onSelectTool: (toolId: string) => void;
}

export function Toolbelt(_props: ToolbeltProps) {
  return <div data-testid="toolbelt" />;
}
