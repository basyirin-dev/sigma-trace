export interface ScoreResult {
  total: number;
  verdictAccuracy: number;
  toolEfficiency: number;
  evidenceConnections: number;
  justificationQuality: number;
  timeBonus: number;
}

export interface ScoreParams {
  isCorrect: boolean;
  toolsUsed: number;
  minToolsRequired: number;
  connectionsMade: number;
  justificationKeywords: string[];
  justificationText: string;
  timeElapsed: number;
}

export function calculateScore(params: ScoreParams): ScoreResult {
  const verdictAccuracy = params.isCorrect ? 50 : 0;
  const toolEfficiency = Math.max(0, 20 - (params.toolsUsed - params.minToolsRequired) * 5);
  const evidenceConnections = Math.min(15, params.connectionsMade * 5);
  const justificationQuality = 15;
  const timeBonus = params.timeElapsed < 180 ? 5 : params.timeElapsed > 300 ? -5 : 0;

  return {
    total:
      verdictAccuracy + toolEfficiency + evidenceConnections + justificationQuality + timeBonus,
    verdictAccuracy,
    toolEfficiency,
    evidenceConnections,
    justificationQuality,
    timeBonus,
  };
}
