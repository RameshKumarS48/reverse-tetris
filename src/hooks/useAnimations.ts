import { useState, useEffect, useCallback } from "react";

export interface AnimationState {
  shakingPieceIds: Set<number>;
  explodingPieceId: number | null;
}

export function useAnimations(
  pendingRemoval: Set<number> | null,
  onRemovalComplete: (pieceId: number) => void
): AnimationState {
  const [animState, setAnimState] = useState<AnimationState>({
    shakingPieceIds: new Set(),
    explodingPieceId: null,
  });

  useEffect(() => {
    if (!pendingRemoval || pendingRemoval.size === 0) return;

    const pieceId = Array.from(pendingRemoval)[0];

    // Step 1: Shake for 350ms
    setAnimState({
      shakingPieceIds: new Set([pieceId]),
      explodingPieceId: null,
    });

    const shakeTimer = setTimeout(() => {
      // Step 2: Explode for 300ms
      setAnimState((s) => ({
        ...s,
        shakingPieceIds: new Set(),
        explodingPieceId: pieceId,
      }));

      // Step 3: Commit removal to game state
      onRemovalComplete(pieceId);

      const explodeTimer = setTimeout(() => {
        setAnimState({
          shakingPieceIds: new Set(),
          explodingPieceId: null,
        });
      }, 300);

      return () => clearTimeout(explodeTimer);
    }, 350);

    return () => clearTimeout(shakeTimer);
  }, [pendingRemoval, onRemovalComplete]);

  return animState;
}
