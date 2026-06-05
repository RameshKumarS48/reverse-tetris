import { TETROMINO_SHAPES, TETROMINO_TYPES } from "./tetrominos";

function serialize(cells: [number, number][]): string {
  return cells.map(([r, c]) => `${r},${c}`).join("|");
}

function normalize(cells: [number, number][]): [number, number][] {
  if (cells.length === 0) return [];
  const minRow = Math.min(...cells.map(([r]) => r));
  const minCol = Math.min(...cells.map(([, c]) => c));
  return cells
    .map(([r, c]) => [r - minRow, c - minCol] as [number, number])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

// Pre-compute all valid tetromino shapes
const VALID_SHAPES = new Set<string>();

for (const type of TETROMINO_TYPES) {
  for (const rotation of TETROMINO_SHAPES[type]) {
    const normalized = normalize(rotation as [number, number][]);
    VALID_SHAPES.add(serialize(normalized));
  }
}

export function isValidTetromino(cells: [number, number][]): boolean {
  if (cells.length !== 4) return false;
  const normalized = normalize(cells);
  return VALID_SHAPES.has(serialize(normalized));
}

export interface Cell {
  type: string;
  pieceId: number;
}

export type Board = (Cell | null)[][];

export function getPieceCells(board: Board, pieceId: number): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c]?.pieceId === pieceId) {
        cells.push([r, c]);
      }
    }
  }
  return cells;
}

export function getRemovablePieceIds(board: Board): Set<number> {
  const pieceIds = new Set<number>();
  for (const row of board) {
    for (const cell of row) {
      if (cell) pieceIds.add(cell.pieceId);
    }
  }

  const removable = new Set<number>();
  for (const pieceId of pieceIds) {
    const cells = getPieceCells(board, pieceId);
    if (isValidTetromino(cells)) {
      removable.add(pieceId);
    }
  }
  return removable;
}
