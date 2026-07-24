export interface Badge {
  id: string
  name: string
  icon: string
}

const ALL_BADGE_IDS = ['fact-checker', 'deepfake-hunter', 'voice-of-truth', 'master-analyst'] as const
export type BadgeId = typeof ALL_BADGE_IDS[number]

export function computeBadges(
  caseResults: Record<string, string>,
  appliedInterventions: string[],
  completedCases: number,
): Badge[] {
  const badges: Badge[] = []

  const factCheckCount = appliedInterventions.filter((id) => id === 'fact-check').length
  if (factCheckCount >= 3) {
    badges.push({ id: 'fact-checker', name: 'Fact Checker', icon: '\uD83D\uDD0D' })
  }

  if (caseResults['case-01'] === 'S' || caseResults['case-01'] === 'A') {
    badges.push({ id: 'deepfake-hunter', name: 'Deepfake Hunter', icon: '\uD83C\uDFAC' })
  }

  if (caseResults['case-02'] === 'S' || caseResults['case-02'] === 'A') {
    badges.push({ id: 'voice-of-truth', name: 'Voice of Truth', icon: '\uD83D\uDCDE' })
  }

  const allCases = ['case-01', 'case-02', 'case-03']
  const allTop = allCases.every((id) => caseResults[id] === 'S' || caseResults[id] === 'A')
  if (completedCases >= 3 && allTop) {
    badges.push({ id: 'master-analyst', name: 'Master Analyst', icon: '\uD83C\uDFC6' })
  }

  return badges
}

export function badgeIdsFromBadges(badges: Badge[]): string[] {
  return badges.map((b) => b.id)
}

export function isBadgeId(value: string): value is BadgeId {
  return (ALL_BADGE_IDS as readonly string[]).includes(value)
}

const GRADE_VALUES: Record<string, number> = { S: 5, A: 4, B: 3, C: 2, F: 0 }

export function computeCompositeGrade(caseResults: Record<string, string>, completedCases: number): string {
  if (completedCases === 0) return 'F'
  const grades = Object.values(caseResults)
  if (grades.length === 0) return 'F'
  const total = grades.reduce((s, g) => s + (GRADE_VALUES[g] ?? 0), 0)
  const avg = total / grades.length
  if (avg >= 4.5) return 'S'
  if (avg >= 3.5) return 'A'
  if (avg >= 2.5) return 'B'
  if (avg >= 1.5) return 'C'
  return 'F'
}

export const GRADE_COLORS: Record<string, string> = {
  S: '#f39c12',
  A: '#2ecc71',
  B: '#4ecdc4',
  C: '#f1c40f',
  F: '#e74c3c',
}
