import { createFileRoute } from "@tanstack/react-router";
import { ReverseTetris } from "@/components/game/ReverseTetris";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reverse Tetris — Chaos Reversed" },
      { name: "description", content: "Everyone builds the tower. Can you undo the chaos?" },
    ],
  }),
  component: () => <ReverseTetris />,
});
