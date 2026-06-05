import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getDailyChaosSeed } from "@/engine/boardGenerator";
import type { Difficulty } from "@/hooks/useGameState";

interface LandingScreenProps {
  onStart: (opts: { difficulty: Difficulty; isDaily?: boolean }) => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-gradient-to-b from-background via-background to-blue-50">
      {/* Subtle geometric grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative Tetris blocks */}
      <div className="absolute top-10 left-10 opacity-10 pointer-events-none">
        <div className="flex gap-1">
          <div className="w-6 h-6 bg-tetro-i rounded-sm"></div>
          <div className="w-6 h-6 bg-tetro-o rounded-sm"></div>
          <div className="w-6 h-6 bg-tetro-t rounded-sm"></div>
        </div>
      </div>
      <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <div className="w-6 h-6 bg-tetro-s rounded-sm"></div>
            <div className="w-6 h-6 bg-tetro-z rounded-sm"></div>
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-6 bg-tetro-j rounded-sm"></div>
            <div className="w-6 h-6 bg-tetro-l rounded-sm"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex gap-2 mb-6 justify-center">
            <div className="w-8 h-8 bg-tetro-i rounded-sm"></div>
            <div className="w-8 h-8 bg-tetro-o rounded-sm"></div>
            <div className="w-8 h-8 bg-tetro-t rounded-sm"></div>
            <div className="w-8 h-8 bg-tetro-s rounded-sm"></div>
            <div className="w-8 h-8 bg-tetro-z rounded-sm"></div>
            <div className="w-8 h-8 bg-tetro-j rounded-sm"></div>
            <div className="w-8 h-8 bg-tetro-l rounded-sm"></div>
          </div>

          <h1 className="font-display text-7xl md:text-8xl font-bold text-foreground mb-3 animate-victory-pop tracking-tighter">
            REVERSE
          </h1>
          <h1 className="font-display text-7xl md:text-8xl font-bold text-primary mb-6 animate-victory-pop tracking-tighter"
            style={{ animationDelay: "0.05s" }}>
            TETRIS
          </h1>

          <div
            className="space-y-2 mb-10 animate-victory-pop"
            style={{ animationDelay: "0.1s" }}>
            <p className="text-lg font-medium text-foreground">
              Everyone builds the tower.
            </p>
            <p className="text-lg font-medium text-muted-foreground">
              Can you undo the chaos?
            </p>
          </div>
        </div>

        {/* Button Section */}
        <div className="space-y-3 max-w-sm mx-auto">
          <Button
            size="lg"
            className="w-full text-base h-14 font-semibold rounded-xl bg-primary hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
            onClick={() => setShowDifficultyPicker(true)}
          >
            Start Game
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full text-base h-14 font-semibold rounded-xl border-2 border-foreground hover:bg-foreground hover:text-background transition-all"
            onClick={() => onStart({ difficulty: "medium", isDaily: true })}
          >
            Daily Chaos
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="w-full text-base h-14 font-semibold text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-xl transition-all"
          >
            How to Play
          </Button>
        </div>

        {/* Difficulty Picker */}
        {showDifficultyPicker && (
          <div className="mt-8 space-y-3 animate-board-cell-in max-w-sm mx-auto">
            <p className="text-center text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Choose difficulty</p>
            <Button
              className="w-full h-12 font-semibold rounded-lg bg-green-500 hover:bg-green-600 text-white"
              onClick={() => {
                onStart({ difficulty: "easy" });
                setShowDifficultyPicker(false);
              }}
            >
              Easy — 65% filled
            </Button>
            <Button
              className="w-full h-12 font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => {
                onStart({ difficulty: "medium" });
                setShowDifficultyPicker(false);
              }}
            >
              Medium — 75% filled
            </Button>
            <Button
              className="w-full h-12 font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                onStart({ difficulty: "hard" });
                setShowDifficultyPicker(false);
              }}
            >
              Hard — 82% filled
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
