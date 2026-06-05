import { useMemo } from "react";
import { getPercentCleared } from "@/engine/scoring";

interface ScorePanelProps {
  score: number;
  combo: number;
  lastComboTime: number;
  elapsed: number;
  totalCells: number;
  removedCells: number;
  bestScore: number;
}

export function ScorePanel({
  score,
  combo,
  lastComboTime,
  elapsed,
  totalCells,
  removedCells,
  bestScore,
}: ScorePanelProps) {
  const percentCleared = useMemo(
    () => getPercentCleared(totalCells, removedCells),
    [totalCells, removedCells]
  );

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  const comboTimeRemaining = Math.max(
    0,
    Math.ceil((3000 - (Date.now() - lastComboTime)) / 1000)
  );

  return (
    <div className="glass rounded-xl p-6 space-y-6 w-full h-fit">
      {/* Score */}
      <div className="border-b-2 border-border pb-4">
        <div className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-2">
          Score
        </div>
        <div className="font-display text-4xl font-bold text-foreground tabular-nums">
          {score.toLocaleString()}
        </div>
        {bestScore > 0 && (
          <div className="text-xs text-muted-foreground mt-3 font-medium">
            Best: <span className="text-foreground font-semibold">{bestScore.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Combo */}
      {combo > 1 && (
        <div className="animate-scale-in text-center py-3 rounded-lg bg-yellow-50 border-2 border-tetro-o">
          <div className="text-2xl font-bold text-tetro-o">{combo}×</div>
          <div className="text-xs font-semibold text-tetro-o">COMBO ({comboTimeRemaining}s)</div>
        </div>
      )}

      {/* Progress Bar */}
      <div>
        <div className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-3">
          Cleared
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-tetro-i via-tetro-t to-tetro-z transition-all duration-200 rounded-full"
                style={{ width: `${Math.min(100, percentCleared)}%` }}
              />
            </div>
          </div>
          <div className="text-lg font-display font-bold text-foreground tabular-nums w-16 text-right">
            {percentCleared}%
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-border">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-1">Time</div>
          <div className="font-display font-bold text-lg text-foreground tabular-nums">
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-1">Left</div>
          <div className="font-display font-bold text-lg text-foreground tabular-nums">
            {Math.max(0, totalCells - removedCells)}
          </div>
        </div>
      </div>
    </div>
  );
}
