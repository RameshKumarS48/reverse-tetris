import { ROWS, COLS } from "./boardGenerator";
import type { Cell, Board } from "./pieceDetector";

export function applyGravity(board: Board): Board {
  const newBoard = board.map((row) => [...row]);

  for (let col = 0; col < COLS; col++) {
    const cells: (Cell | null)[] = [];
    for (let row = 0; row < ROWS; row++) {
      if (newBoard[row][col] !== null) {
        cells.push(newBoard[row][col]);
      }
    }

    for (let row = ROWS - 1; row >= 0; row--) {
      newBoard[row][col] = cells.length > 0 ? cells.pop()! : null;
    }
  }

  return newBoard;
}

export function removeCellsById(board: Board, pieceId: number): Board {
  const newBoard = board.map((row) =>
    row.map((cell) => (cell?.pieceId === pieceId ? null : cell))
  );
  return newBoard;
}

export function findPieceAtCell(board: Board, row: number, col: number): number | null {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null;
  return board[row][col]?.pieceId ?? null;
}

export function countFilledCells(board: Board): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell !== null) count++;
    }
  }
  return count;
}

export function boardsEqual(board1: Board, board2: Board): boolean {
  if (board1.length !== board2.length) return false;
  for (let r = 0; r < board1.length; r++) {
    if (board1[r].length !== board2[r].length) return false;
    for (let c = 0; c < board1[r].length; c++) {
      const cell1 = board1[r][c];
      const cell2 = board2[r][c];
      if (cell1 === null && cell2 === null) continue;
      if (cell1 === null || cell2 === null) return false;
      if (cell1.pieceId !== cell2.pieceId) return false;
    }
  }
  return true;
}
