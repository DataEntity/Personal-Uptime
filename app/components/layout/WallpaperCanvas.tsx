import type { ReactNode } from "react";

import { HudQuadrant } from "../hud/AsciiHud";

type WallpaperCanvasProps = {
  topLeft?: ReactNode;
  topRight?: ReactNode;
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
};

export function WallpaperCanvas({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
}: WallpaperCanvasProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-zinc-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(39,39,42,0.45),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(12,12,14,0.85),transparent_50%)]"
      />

      <div className="relative grid h-screen w-full grid-cols-2 grid-rows-2 gap-0 p-8">
        <HudQuadrant align="start" vertical="start">
          {topLeft}
        </HudQuadrant>
        <HudQuadrant align="end" vertical="start">
          {topRight}
        </HudQuadrant>
        <HudQuadrant align="start" vertical="end" fill>
          {bottomLeft}
        </HudQuadrant>
        <HudQuadrant align="end" vertical="end">
          {bottomRight}
        </HudQuadrant>
      </div>
    </div>
  );
}
