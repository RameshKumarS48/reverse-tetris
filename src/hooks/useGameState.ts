import { useState, useCallback } from "react";
import { generateBoard, getDailyChaosSeed } from "@/engine/boardGenerator";
import type { Board } from "@/engine/pieceDetector";
import {
  applyGravity,
  removeCellsById,
  findPieceAtCell,
  countFilledCells,
} from "@/engine/gameEngine";
import { getRemovablePieceIds, getPieceCells } from "@/engine/pieceDetector";
import { calculateScore, getPercentCleared, getRank } from "@/engine/scoring";

export type Difficulty = "easy" | "medium" | "hard";
export type GamePhase = "landing" | "playing" | "ended";

const DENSITIES: Record<Difficulty, number> = {
  easy: 0.65,
  medium: 0.75,
  hard: 0.82,
};

export interface GameState {
  board: Board;
  history: Board[];
  score: number;
  combo: number;
  lastComboTime: number;
  totalCells: number;
  removedCells: number;
  elapsed: number;
  gamePhase: GamePhase;
  difficulty: Difficulty;
  seed: number;
  isDaily: boolean;
  pendingRemoval: Set<number> | null;
  hintPieceId: number | null;
  startTime: number;
}

function createEmptyState(): GameState {
  return {
    board: Array(20).fill(null).map(() => Array(10).fill(null)),
    history: [],
    score: 0,
    combo: 0,
    lastComboTime: 0,
    totalCells: 0,
    removedCells: 0,
    elapsed: 0,
    gamePhase: "landing",
    difficulty: "medium",
    seed: 0,
    isDaily: false,
    pendingRemoval: null,
    hintPieceId: null,
    startTime: 0,
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(createEmptyState());

  const startGame = useCallback(
    (opts: { difficulty: Difficulty; isDaily?: boolean }) => {
      const seed = opts.isDaily ? getDailyChaosSeed() : Date.now();
      const board = generateBoard(seed, DENSITIES[opts.difficulty]);
      const totalCells = countFilledCells(board);

      setState({
        board,
        history: [],
        score: 0,
        combo: 0,
        lastComboTime: 0,
        totalCells,
        removedCells: 0,
        elapsed: 0,
        gamePhase: "playing",
        difficulty: opts.difficulty,
        seed,
        isDaily: opts.isDaily ?? false,
        pendingRemoval: null,
        hintPieceId: null,
        startTime: Date.now(),
      });
    },
    []
  );

  const handleCellClick = useCallback((row: number, col: number) => {
    setState((prev) => {
      if (prev.gamePhase !== "playing" || prev.pendingRemoval) return prev;

      const pieceId = findPieceAtCell(prev.board, row, col);
      if (pieceId === null) return prev;

      const cells = getPieceCells(prev.board, pieceId);
      const removable = getRemovablePieceIds(prev.board);

      if (!removable.has(pieceId)) {
        // Invalid click feedback would go here
        return prev;
      }

      return { ...prev, pendingRemoval: new Set([pieceId]), hintPieceId: null };
    });
  }, []);

  const confirmRemoval = useCallback((pieceId: number) => {
    setState((prev) => {
      const now = Date.now();
      const newBoard = removeCellsById(prev.board, pieceId);
      const gravityBoard = applyGravity(newBoard);

      const { score, newCombo } = calculateScore(
        prev.score,
        prev.combo,
        prev.lastComboTime,
        now
      );

      const newRemovedCells = prev.removedCells + 4;
      const isCleared = newRemovedCells >= prev.totalCells;

      return {
        ...prev,
        board: gravityBoard,
        history: [...prev.history.slice(-9), prev.board],
        score: isCleared ? score + 5000 : score,
        combo: newCombo,
        lastComboTime: now,
        removedCells: newRemovedCells,
        pendingRemoval: null,
        gamePhase: isCleared ? "ended" : "playing",
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) return prev;
      const board = prev.history[prev.history.length - 1];
      const removedCells = countFilledCells(board);
      return {
        ...prev,
        board,
        history: prev.history.slice(0, -1),
        combo: 0,
        lastComboTime: 0,
        removedCells,
      };
    });
  }, []);

  const getHint = useCallback(() => {
    setState((prev) => {
      const removable = getRemovablePieceIds(prev.board);
      const ids = Array.from(removable);
      if (ids.length === 0) return prev;

      const hintPieceId = ids[Math.floor(Math.random() * ids.length)];
      return { ...prev, hintPieceId };
    });
  }, []);

  const updateElapsed = useCallback(() => {
    setState((prev) => {
      if (prev.gamePhase !== "playing") return prev;
      const elapsed = Math.floor((Date.now() - prev.startTime) / 1000);
      return { ...prev, elapsed };
    });
  }, []);

  const restart = useCallback(() => {
    setState((prev) => {
      const seed = Date.now();
      const board = generateBoard(seed, DENSITIES[prev.difficulty]);
      const totalCells = countFilledCells(board);

      return {
        board,
        history: [],
        score: 0,
        combo: 0,
        lastComboTime: 0,
        totalCells,
        removedCells: 0,
        elapsed: 0,
        gamePhase: "playing" as const,
        difficulty: prev.difficulty,
        seed,
        isDaily: false,
        pendingRemoval: null,
        hintPieceId: null,
        startTime: Date.now(),
      };
    });
  }, []);

  const newGame = useCallback((difficulty: Difficulty) => {
    startGame({ difficulty });
  }, [startGame]);

  return {
    state,
    startGame,
    handleCellClick,
    confirmRemoval,
    undo,
    getHint,
    updateElapsed,
    restart,
    newGame,
  };
}
