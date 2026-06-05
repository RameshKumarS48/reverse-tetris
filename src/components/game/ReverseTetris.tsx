import { useEffect, useRef } from "react";
import { useGameState } from "@/hooks/useGameState";
import { useAnimations } from "@/hooks/useAnimations";
import { useKeyboard } from "@/hooks/useKeyboard";
import { loadBestScore, saveBestScore } from "@/lib/storage";
import { Board } from "./Board";
import { ScorePanel } from "./ScorePanel";
import { GameControls } from "./GameControls";
import { LandingScreen } from "@/components/menu/LandingScreen";
import { EndScreen } from "@/components/menu/EndScreen";

export function ReverseTetris() {
  const {
    state,
    startGame,
    handleCellClick,
    confirmRemoval,
    undo,
    getHint,
    updateElapsed,
    restart,
    newGame,
  } = useGameState();

  const prevBoardRef = useRef(state.board);
  const animState = useAnimations(state.pendingRemoval, confirmRemoval);

  const handleRestart = () => {
    if (state.gamePhase === "playing") {
      restart();
    }
  };

  const handleNewGame = (difficulty: any) => {
    newGame(difficulty);
  };

  const handleBackToMenu = () => {
    startGame({ difficulty: "medium" });
  };

  useKeyboard({
    onRestart: handleRestart,
    onHint: () => state.gamePhase === "playing" && getHint(),
    onUndo: () => state.gamePhase === "playing" && state.history.length > 0 && undo(),
  });

  useEffect(() => {
    if (state.gamePhase === "playing") {
      const timer = setInterval(updateElapsed, 100);
      return () => clearInterval(timer);
    }
  }, [state.gamePhase, updateElapsed]);

  useEffect(() => {
    if (state.gamePhase === "ended") {
      saveBestScore(state.difficulty, state.score);
    }
  }, [state.gamePhase, state.difficulty, state.score]);

  useEffect(() => {
    prevBoardRef.current = state.board;
  }, [state.board]);

  const bestScore = loadBestScore(state.difficulty);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-background via-background to-blue-50">
      {state.gamePhase === "landing" && (
        <LandingScreen onStart={startGame} />
      )}

      {state.gamePhase === "playing" && (
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-4 lg:gap-6 min-h-screen p-4 lg:p-6 w-full">
          {/* Left Panel: Controls - Hidden on mobile, left on desktop */}
          <div className="hidden lg:flex flex-col gap-3 w-32 flex-shrink-0 justify-center">
            <GameControls
              onUndo={undo}
              onHint={getHint}
              onRestart={handleRestart}
              onNewGame={handleNewGame}
              canUndo={state.history.length > 0}
            />
          </div>

          {/* Center: Game Board - Full width on mobile */}
          <div className="w-full lg:w-96 lg:flex-shrink-0 h-screen lg:h-auto flex items-center justify-center">
            <Board
              board={state.board}
              prevBoard={prevBoardRef.current}
              animState={animState}
              onCellClick={handleCellClick}
              hintPieceId={state.hintPieceId}
            />
          </div>

          {/* Right Panel: Score - Below board on mobile, right on desktop */}
          <div className="lg:hidden w-full max-w-sm">
            <ScorePanel
              score={state.score}
              combo={state.combo}
              lastComboTime={state.lastComboTime}
              elapsed={state.elapsed}
              totalCells={state.totalCells}
              removedCells={state.removedCells}
              bestScore={bestScore}
            />
          </div>

          <div className="hidden lg:flex flex-col gap-3 w-56 flex-shrink-0 justify-center">
            <ScorePanel
              score={state.score}
              combo={state.combo}
              lastComboTime={state.lastComboTime}
              elapsed={state.elapsed}
              totalCells={state.totalCells}
              removedCells={state.removedCells}
              bestScore={bestScore}
            />
          </div>
        </div>
      )}

      {state.gamePhase === "ended" && (
        <EndScreen
          score={state.score}
          percentCleared={Math.round(
            (state.removedCells / state.totalCells) * 100
          )}
          elapsed={state.elapsed}
          difficulty={state.difficulty}
          onRestart={() => startGame({ difficulty: state.difficulty, isDaily: state.isDaily })}
          onNewGame={handleNewGame}
          onMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}
