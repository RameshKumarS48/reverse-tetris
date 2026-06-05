const STORAGE_KEY = "reverse-tetris-v1";

interface StoredData {
  bestScores: Record<string, number>;
  dailyBest: Record<string, number>;
}

function loadStoredData(): StoredData {
  if (typeof window === "undefined") {
    return { bestScores: {}, dailyBest: {} };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { bestScores: {}, dailyBest: {} };
    }
    return JSON.parse(data);
  } catch {
    return { bestScores: {}, dailyBest: {} };
  }
}

function saveStoredData(data: StoredData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Silently fail if storage is unavailable
  }
}

export function loadBestScore(difficulty: string): number {
  const data = loadStoredData();
  return data.bestScores[difficulty] ?? 0;
}

export function saveBestScore(difficulty: string, score: number): void {
  const data = loadStoredData();
  if (!data.bestScores[difficulty] || score > data.bestScores[difficulty]) {
    data.bestScores[difficulty] = score;
    saveStoredData(data);
  }
}

export function loadDailyBest(dateKey: string): number {
  const data = loadStoredData();
  return data.dailyBest[dateKey] ?? 0;
}

export function saveDailyBest(dateKey: string, score: number): void {
  const data = loadStoredData();
  if (!data.dailyBest[dateKey] || score > data.dailyBest[dateKey]) {
    data.dailyBest[dateKey] = score;
    saveStoredData(data);
  }
}
