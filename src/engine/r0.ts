export interface R0Params {
  baseR0: number;
  literacyRate: number;
  factCheckCoverage: number;
  algorithmAuditActive: boolean;
  noise: number;
}

export function computeR0(params: R0Params): number {
  const { baseR0, literacyRate, factCheckCoverage, algorithmAuditActive, noise } = params;
  let r0 = baseR0;
  r0 *= 1 - literacyRate * 0.3;
  r0 *= 1 - factCheckCoverage * 0.4;
  if (algorithmAuditActive) r0 *= 0.7;
  r0 += noise * (Math.random() - 0.5) * 0.1;
  return Math.max(0, r0);
}
