import { Tooltip } from '@shared/Tooltip';
import { TOOLS } from './tools/constants';
import styles from './Toolbelt.module.css';

export interface ToolbeltProps {
  activeTool: string | null;
  usedTools: string[];
  onSelectTool: (toolId: string | null) => void;
  onRequestTutorialHelp?: () => void;
}

export function Toolbelt({
  activeTool,
  usedTools,
  onSelectTool,
  onRequestTutorialHelp,
}: ToolbeltProps) {
  return (
    <div className={styles.bar} data-testid="toolbelt">
      {TOOLS.map((tool) => {
        const isActive = activeTool === tool.id;
        const isUsed = usedTools.includes(tool.id);

        const classNames = [styles.toolBtn, isActive ? styles.activeTool : '']
          .filter(Boolean)
          .join(' ');

        const button = (
          <button
            key={tool.id}
            className={classNames}
            onClick={() => onSelectTool(isActive ? null : tool.id)}
            data-testid={`tool-btn-${tool.id}`}
            data-active={isActive}
            data-used={isUsed}
          >
            <span className={styles.toolIcon}>{tool.icon}</span>
            <span className={styles.toolLabel}>{tool.label}</span>
            {isUsed && (
              <span className={styles.usedBadge} data-testid="used-badge">
                ✓
              </span>
            )}
          </button>
        );

        return (
          <Tooltip key={tool.id} content={tool.tooltip} position="bottom" delay={500}>
            {button}
          </Tooltip>
        );
      })}
      {onRequestTutorialHelp && (
        <>
          <div className={styles.separator} />
          <button
            className={styles.helpBtn}
            onClick={onRequestTutorialHelp}
            data-testid="tutorial-help-btn"
            aria-label="Tool Tutorials"
            title="Tool Tutorials"
          >
            ?
          </button>
        </>
      )}
    </div>
  );
}
