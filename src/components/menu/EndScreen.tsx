import { Button } from "@/components/ui/button";
import { getPercentCleared, getRank } from "@/engine/scoring";
import type { Difficulty } from "@/hooks/useGameState";

interface EndScreenProps {
  score: number;
  percentCleared: number;
  elapsed: number;
  difficulty: Difficulty;
  onRestart: () => void;
  onNewGame: (difficulty: Difficulty) => void;
  onMenu: () => void;
}

export function EndScreen({
  score,
  percentCleared,
  elapsed,
  difficulty,
  onRestart,
  onNewGame,
  onMenu,
}: EndScreenProps) {
  const rank = getRank(percentCleared);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const isClear = percentCleared === 100;

  const shareText = `I reversed ${percentCleared}% of the chaos in Reverse Tetris! 🧩 Can you beat me?`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Reverse Tetris",
          text: shareText,
          url: "https://untetris.rameshkumar.space",
        });
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Copied to clipboard!");
    }
  };

  const rankColor = isClear ? "text-tetro-i" : rank === "S" ? "text-tetro-i" : rank === "A" ? "text-tetro-z" : "text-tetro-o";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center space-y-8 animate-victory-pop">
        {isClear && (
          <div className="text-6xl animate-bounce mb-4">
            🎉
          </div>
        )}

        <div>
          <h2 className="font-display text-5xl font-bold text-foreground mb-3">
            {isClear ? "PERFECT!" : "GAME OVER"}
          </h2>
          <p className={`font-display text-4xl font-bold ${rankColor}`}>{rank}</p>
        </div>

        {/* Stats Card */}
        <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-border">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-left">
              <div className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-1">Score</div>
              <div className="font-display text-2xl font-bold text-foreground tabular-nums">
                {score.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-1">Cleared</div>
              <div className="font-display text-2xl font-bold text-primary tabular-nums">
                {percentCleared}%
              </div>
            </div>
          </div>

          <div className="border-t-2 border-border pt-4 grid grid-cols-2 gap-4">
            <div className="text-left">
              <div className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-1">Time</div>
              <div className="font-display text-lg font-bold text-foreground tabular-nums">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-1">Difficulty</div>
              <div className="font-display text-lg font-bold text-foreground capitalize">
                {difficulty === "easy" ? "Easy" : difficulty === "medium" ? "Medium" : "Hard"}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full h-12 font-semibold rounded-lg bg-primary hover:bg-blue-700 text-white shadow-lg"
            onClick={handleShare}
          >
            📤 Share Score
          </Button>

          <Button
            size="lg"
            className="w-full h-12 font-semibold rounded-lg bg-accent hover:bg-orange-600 text-white shadow-lg"
            onClick={onRestart}
          >
            Play Again
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full h-12 font-semibold rounded-lg border-2 border-foreground hover:bg-foreground hover:text-background"
            onClick={() => onNewGame("medium")}
          >
            New Game
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="w-full h-12 font-semibold text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg"
            onClick={onMenu}
          >
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
