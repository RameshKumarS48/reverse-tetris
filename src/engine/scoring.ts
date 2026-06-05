export const BASE_SCORE_PER_PIECE = 100;
export const COMBO_WINDOW_MS = 3000;
export const FULL_CLEAR_BONUS = 5000;

export function calculateScore(
  currentScore: number,
  combo: number,
  lastComboTime: number,
  now: number,
): { score: number; newCombo: number } {
  const withinWindow = now - lastComboTime < COMBO_WINDOW_MS;
  const newCombo = withinWindow ? combo + 1 : 1;

  const multiplier = newCombo === 1 ? 1 : Math.max(1, newCombo * 0.5 + 0.5);
  const points = Math.round(BASE_SCORE_PER_PIECE * multiplier);

  return { score: currentScore + points, newCombo };
}

export function getRank(percentCleared: number): string {
  if (percentCleared === 100) return "Chaos Master";
  if (percentCleared >= 80) return "Reality Fixer";
  if (percentCleared >= 50) return "Order Restorer";
  return "Chaos Apprentice";
}

export function getPercentCleared(totalCells: number, removedCells: number): number {
  if (totalCells === 0) return 0;
  return Math.round((removedCells / totalCells) * 100);
}
