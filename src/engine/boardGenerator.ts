import { TETROMINO_SHAPES, TETROMINO_COLORS, TETROMINO_TYPES, type TetrominoType } from "./tetrominos";
import type { Cell, Board } from "./pieceDetector";

export const ROWS = 20;
export const COLS = 10;

// Mulberry32 seeded PRNG
function mulberry32(seed: number): () => number {
  return function() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getDailyChaosSeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function isWithinBounds(row: number, col: number): boolean {
  return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

function isValidPlacement(board: Board, cells: [number, number][]): boolean {
  for (const [r, c] of cells) {
    if (!isWithinBounds(r, c) || board[r][c] !== null) {
      return false;
    }
  }
  return true;
}

function isGravityStable(board: Board, cells: [number, number][]): boolean {
  for (const [r, c] of cells) {
    if (r === ROWS - 1) continue;
    const hasSupport =
      board[r + 1][c] !== null ||
      cells.some(([rr, cc]) => rr === r + 1 && cc === c);
    if (!hasSupport) return false;
  }
  return true;
}

export function generateBoard(seed: number, density: number): Board {
  const rng = mulberry32(seed);
  const board: Board = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(null)
  );

  const targetCells = Math.floor(ROWS * COLS * density);
  let filledCount = 0;
  let attempts = 0;
  let pieceId = 0;
  const MAX_ATTEMPTS = 5000;

  while (filledCount < targetCells && attempts < MAX_ATTEMPTS) {
    attempts++;

    const type = TETROMINO_TYPES[Math.floor(rng() * TETROMINO_TYPES.length)] as TetrominoType;
    const rotationIdx = Math.floor(rng() * TETROMINO_SHAPES[type].length);
    const shape = TETROMINO_SHAPES[type][rotationIdx];

    const anchorRow = Math.floor(rng() * ROWS);
    const anchorCol = Math.floor(rng() * COLS);

    const cells = shape.map(([dr, dc]) => [
      anchorRow + dr,
      anchorCol + dc,
    ] as [number, number]);

    if (!isValidPlacement(board, cells)) continue;
    if (!isGravityStable(board, cells)) continue;

    pieceId++;
    for (const [r, c] of cells) {
      board[r][c] = {
        type,
        pieceId,
      };
    }
    filledCount += 4;
  }

  return board;
}
