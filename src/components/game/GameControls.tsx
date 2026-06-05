import { Undo2, Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GameControlsProps {
  onUndo: () => void;
  onHint: () => void;
  onRestart: () => void;
  onNewGame: () => void;
  canUndo: boolean;
}

export function GameControls({
  onUndo,
  onHint,
  onRestart,
  canUndo,
}: GameControlsProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-3 w-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onUndo}
              disabled={!canUndo}
              className="w-full h-12 rounded-lg font-semibold bg-white border-2 border-border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-foreground transition-all"
            >
              <Undo2 className="w-5 h-5 mr-2" />
              Undo
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Undo last removal (U)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onHint}
              className="w-full h-12 rounded-lg font-semibold bg-tetro-o border-2 border-yellow-600 hover:bg-yellow-500 text-black transition-all"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Hint
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Highlight a valid piece (H)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onRestart}
              className="w-full h-12 rounded-lg font-semibold bg-tetro-z border-2 border-red-600 hover:bg-red-500 text-white transition-all"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Restart
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Restart current board (R)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
