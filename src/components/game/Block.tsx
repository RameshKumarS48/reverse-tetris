import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Cell } from "@/engine/pieceDetector";
import { TETROMINO_COLORS } from "@/engine/tetrominos";

interface BlockProps {
  cell: Cell | null;
  row: number;
  col: number;
  isShaking: boolean;
  isExploding: boolean;
  isHint: boolean;
  onClick: () => void;
}

export function Block({
  cell,
  row,
  col,
  isShaking,
  isExploding,
  isHint,
  onClick,
}: BlockProps) {
  const animationDelay = useMemo(() => {
    return `${(row * 10 + col) * 3}ms`;
  }, [row, col]);

  if (!cell) {
    return (
      <div
        className="w-full h-full bg-gray-100 border-2 border-gray-300 animate-board-cell-in"
        style={{ animationDelay }}
      />
    );
  }

  const color = TETROMINO_COLORS[cell.type as keyof typeof TETROMINO_COLORS] || "var(--tetro-i)";

  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full h-full cursor-pointer border-2 transition-all duration-150 animate-board-cell-in",
        "hover:shadow-lg hover:-translate-y-0.5",
        isShaking && "animate-block-shake",
        isExploding && "animate-block-explode",
        isHint && "animate-pulse ring-4 ring-yellow-300"
      )}
      style={{
        backgroundColor: color,
        boxShadow: `inset 1px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)`,
        borderColor: `color-mix(in oklab, ${color} 80%, black)`,
        animationDelay,
      }}
    >
      {isExploding && <Particles color={color} />}
    </div>
  );
}

function Particles({ color }: { color: string }) {
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const distance = 40;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    return (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-full animate-particle-burst pointer-events-none"
        style={{
          backgroundColor: color,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          "--tx": `${tx}px`,
          "--ty": `${ty}px`,
          opacity: 0.8,
        } as React.CSSProperties}
      />
    );
  });

  return <div className="relative w-full h-full">{particles}</div>;
}
