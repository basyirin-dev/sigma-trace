import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { EvidenceCard, type EvidenceItem } from './EvidenceCard';
import type { EvidenceBoardData } from './CaseLoader';
import { TOOLS, TOOL_AFFINITY_MAP } from './tools/constants';
import styles from './EvidenceBoard.module.css';

export interface EvidenceBoardProps {
  evidenceItems: EvidenceItem[];
  boardData: EvidenceBoardData;
  connections: [string, string][];
  onConnect: (evidenceIdA: string, evidenceIdB: string) => void;
  onDisconnect: (evidenceIdA: string, evidenceIdB: string) => void;
  onInspect: (evidenceId: string, toolId: string) => void;
  activeTool?: string | null;
  evidenceFindings?: Record<string, string>;
  onToolApply?: (evidenceId: string, toolId: string) => void;
}

interface ContextMenuState {
  evidenceId: string;
  x: number;
  y: number;
}

export function EvidenceBoard({
  evidenceItems,
  boardData,
  connections,
  onConnect,
  onDisconnect,
  onInspect,
  activeTool,
  evidenceFindings,
  onToolApply,
}: EvidenceBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const draggingCardRef = useRef<string | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const appliedPairsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    appliedPairsRef.current = new Set();
  }, [boardData, activeTool]);

  const [cardCoords, setCardCoords] = useState<Record<string, { x: number; y: number }>>(() => {
    const coords: Record<string, { x: number; y: number }> = {};
    for (const node of boardData.nodes) {
      coords[node.id] = { x: node.x, y: node.y };
    }
    return coords;
  });
  const [previewPoint, setPreviewPoint] = useState<{ x: number; y: number } | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [toolResult, setToolResult] = useState<{
    evidenceId: string;
    toolId: string;
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [deniedCardId, setDeniedCardId] = useState<string | null>(null);

  const evidenceMap = useMemo(() => new Map(evidenceItems.map((e) => [e.id, e])), [evidenceItems]);
  const visibleNodeIds = boardData.nodes.map((n) => n.id).filter((id) => evidenceMap.has(id));

  const getRelativeCoords = useCallback((clientX: number, clientY: number) => {
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return null;
    return {
      x: Math.max(0, Math.min(1, (clientX - boardRect.left) / boardRect.width)),
      y: Math.max(0, Math.min(1, (clientY - boardRect.top) / boardRect.height)),
    };
  }, []);

  const handleDragStart = useCallback((evidenceId: string, e: React.DragEvent) => {
    draggingCardRef.current = evidenceId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', evidenceId);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const id = draggingCardRef.current;
      if (!id) return;
      draggingCardRef.current = null;
      const coords = getRelativeCoords(e.clientX, e.clientY);
      if (!coords) return;
      setCardCoords((prev) => ({ ...prev, [id]: coords }));
    },
    [getRelativeCoords],
  );

  const handleConnectMouseDown = useCallback(
    (evidenceId: string) => {
      const center = cardCoords[evidenceId];
      if (!center) return;
      setConnectingFrom(evidenceId);
      setPreviewPoint({ x: center.x, y: center.y });
    },
    [cardCoords],
  );

  useEffect(() => {
    if (!connectingFrom) return;

    const handleMouseMove = (e: MouseEvent) => {
      const targetId = hoveredRef.current;
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (!boardRect) return;

      let x = Math.max(0, Math.min(1, (e.clientX - boardRect.left) / boardRect.width));
      let y = Math.max(0, Math.min(1, (e.clientY - boardRect.top) / boardRect.height));

      if (targetId) {
        const targetCenter = cardCoords[targetId];
        if (targetCenter) {
          x = targetCenter.x;
          y = targetCenter.y;
        }
      }

      setPreviewPoint({ x, y });
    };

    const handleMouseUp = (_e: MouseEvent) => {
      const targetId = hoveredRef.current;
      setConnectingFrom(null);
      setPreviewPoint(null);

      if (targetId && targetId !== connectingFrom) {
        onConnect(connectingFrom, targetId);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [connectingFrom, cardCoords, onConnect]);

  const handleContextMenu = useCallback((evidenceId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ evidenceId, x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    if (!contextMenu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenu(null);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [contextMenu]);

  const handleToolCardClick = useCallback(
    (id: string) => {
      if (!activeTool || !onToolApply) return;

      const pairKey = `${id}::${activeTool}`;
      if (appliedPairsRef.current.has(pairKey)) {
        setDeniedCardId(id);
        setTimeout(() => setDeniedCardId(null), 400);
        return;
      }

      const evItem = evidenceItems.find((e) => e.id === id);
      const affinity = TOOL_AFFINITY_MAP[activeTool];
      if (!evItem || !affinity?.includes(evItem.type)) {
        setDeniedCardId(id);
        setTimeout(() => setDeniedCardId(null), 400);
        return;
      }

      appliedPairsRef.current.add(pairKey);
      onToolApply(id, activeTool);

      const findingText = evidenceFindings?.[id] ?? '';
      setToolResult({
        evidenceId: id,
        toolId: activeTool,
        text: findingText,
        x: 0,
        y: 0,
      });
    },
    [activeTool, onToolApply, evidenceItems, evidenceFindings],
  );

  useEffect(() => {
    if (!toolResult) return;
    const timer = setTimeout(() => setToolResult(null), 5000);
    return () => clearTimeout(timer);
  }, [toolResult]);

  const handleLineClick = useCallback(
    (a: string, b: string) => {
      onDisconnect(a, b);
    },
    [onDisconnect],
  );

  const connectedSet = new Set(connections.flat());
  const boardClass = [styles.board, activeTool ? styles.toolMode : ''].filter(Boolean).join(' ');

  return (
    <div
      ref={boardRef}
      className={boardClass}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      data-testid="evidence-board"
    >
      <svg className={styles.svgOverlay} viewBox="0 0 1 1" preserveAspectRatio="none">
        {connections.map(([a, b]) => {
          const ca = cardCoords[a];
          const cb = cardCoords[b];
          if (!ca || !cb) return null;
          return (
            <g key={`${a}-${b}`}>
              <line
                x1={ca.x}
                y1={ca.y}
                x2={cb.x}
                y2={cb.y}
                className={styles.connectionLine}
                onClick={() => handleLineClick(a, b)}
                data-testid={`connection-${a}-${b}`}
              />
              <circle
                cx={ca.x}
                cy={ca.y}
                r="0.008"
                fill="#C0392B"
                stroke="#8B1A1A"
                strokeWidth="0.0015"
                opacity="0.8"
                pointerEvents="none"
              />
              <circle
                cx={cb.x}
                cy={cb.y}
                r="0.008"
                fill="#C0392B"
                stroke="#8B1A1A"
                strokeWidth="0.0015"
                opacity="0.8"
                pointerEvents="none"
              />
            </g>
          );
        })}
        {connectingFrom &&
          previewPoint &&
          (() => {
            const source = cardCoords[connectingFrom];
            if (!source) return null;
            return (
              <line
                x1={source.x}
                y1={source.y}
                x2={previewPoint.x}
                y2={previewPoint.y}
                className={styles.previewLine}
                data-testid="preview-line"
              />
            );
          })()}
      </svg>

      {visibleNodeIds.map((id) => {
        const node = boardData.nodes.find((n) => n.id === id)!;
        const evidence = evidenceMap.get(id)!;
        const coord = cardCoords[id] ?? { x: node.x, y: node.y };

        return (
          <EvidenceCard
            key={id}
            evidence={evidence}
            selected={connectedSet.has(id) || connectingFrom === id}
            isRevealed={false}
            showRedHerringBadge={false}
            evidenceDetails={evidence.description}
            onSelect={() => {}}
            onContextMenu={(e) => handleContextMenu(id, e)}
            onConnectMouseDown={(e) => {
              e.stopPropagation();
              handleConnectMouseDown(id);
            }}
            onDragStart={(e) => handleDragStart(id, e)}
            onMouseEnter={() => {
              hoveredRef.current = id;
            }}
            onMouseLeave={() => {
              if (hoveredRef.current === id) hoveredRef.current = null;
            }}
            onCardClick={activeTool ? () => handleToolCardClick(id) : undefined}
            clickDenied={deniedCardId === id}
            style={{
              left: `${coord.x * 100}%`,
              top: `${coord.y * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}

      {contextMenu &&
        createPortal(
          <div className={styles.menuBackdrop} onClick={() => setContextMenu(null)}>
            <div
              className={styles.menu}
              style={{ left: contextMenu.x, top: contextMenu.y }}
              onClick={(e) => e.stopPropagation()}
              role="menu"
              aria-label="Evidence actions"
            >
              <div className={styles.menuHeader} data-testid="menu-header">
                {evidenceMap.get(contextMenu.evidenceId)?.label ?? 'Inspect'}
              </div>
              {TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  className={styles.menuItem}
                  onClick={() => {
                    onInspect(contextMenu.evidenceId, tool.id);
                    setContextMenu(null);
                  }}
                  data-testid={`menu-tool-${tool.id}`}
                >
                  Inspect with {tool.label}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}

      {toolResult &&
        createPortal(
          <div className={styles.popoverBackdrop} onClick={() => setToolResult(null)}>
            <div
              className={styles.popover}
              onClick={(e) => e.stopPropagation()}
              data-testid="tool-result-popover"
            >
              <div className={styles.popoverHeader}>
                <span>
                  {TOOLS.find((t) => t.id === toolResult.toolId)?.label ?? toolResult.toolId}{' '}
                  Analysis
                </span>
                <button
                  className={styles.popoverClose}
                  onClick={() => setToolResult(null)}
                  aria-label="Close"
                  data-testid="popover-close"
                >
                  x
                </button>
              </div>
              <div className={styles.popoverBody}>
                <p className={styles.popoverTitle}>
                  &ldquo;{evidenceMap.get(toolResult.evidenceId)?.label ?? ''}&rdquo;
                </p>
                <p className={styles.popoverText} data-testid="popover-text">
                  {toolResult.text}
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
