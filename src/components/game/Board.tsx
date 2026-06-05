import { useRef, useEffect, useMemo } from "react";
import type { Board } from "@/engine/pieceDetector";
import type { AnimationState } from "@/hooks/useAnimations";
import { Block } from "./Block";

interface BoardProps {
  board: Board;
  prevBoard: Board | null;
  animState: AnimationState;
  onCellClick: (row: number, col: number) => void;
  hintPieceId: number | null;
}

export function Board({
  board,
  prevBoard,
  animState,
  onCellClick,
  hintPieceId,
}: BoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fallDistances = useMemo(() => {
    const distances = new Map<string, number>();

    if (!prevBoard) return distances;

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const cell = board[r][c];
        if (!cell) continue;

        let prevRow = -1;
        for (let pr = 0; pr < prevBoard.length; pr++) {
          const prevCell = prevBoard[pr][c];
          if (prevCell?.pieceId === cell.pieceId) {
            prevRow = pr;
            break;
          }
        }

        if (prevRow !== -1 && prevRow !== r) {
          const cellHeight = containerRef.current
            ? containerRef.current.offsetHeight / 20
            : 0;
          distances.set(`${r}-${c}`, (prevRow - r) * cellHeight);
        }
      }
    }

    return distances;
  }, [board, prevBoard]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full aspect-[10/20] overflow-hidden glass p-3 rounded-xl"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        gridTemplateRows: "repeat(20, 1fr)",
        gap: "2px",
      }}
    >
      {board.flatMap((row, r) =>
        row.map((cell, c) => {
          const fallFrom = fallDistances.get(`${r}-${c}`) || 0;
          return (
            <div
              key={`${r}-${c}`}
              style={{
                "--fall-from": `${fallFrom}px`,
              } as React.CSSProperties}
              className={fallFrom !== 0 ? "animate-block-fall" : ""}
            >
              <Block
                cell={cell}
                row={r}
                col={c}
                isShaking={cell ? animState.shakingPieceIds.has(cell.pieceId) : false}
                isExploding={cell ? animState.explodingPieceId === cell.pieceId : false}
                isHint={cell ? cell.pieceId === hintPieceId : false}
                onClick={() => onCellClick(r, c)}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
