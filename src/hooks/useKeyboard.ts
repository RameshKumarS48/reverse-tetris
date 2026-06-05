import { useEffect } from "react";

interface KeyboardHandlers {
  onRestart?: () => void;
  onHint?: () => void;
  onUndo?: () => void;
}

export function useKeyboard(handlers: KeyboardHandlers) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "r":
          handlers.onRestart?.();
          break;
        case "h":
          handlers.onHint?.();
          break;
        case "u":
          handlers.onUndo?.();
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlers]);
}
