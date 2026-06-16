import type { ReactNode } from "react";

type AsciiBlockProps = {
  art: string;
  dimmed?: boolean;
  label?: string;
};

export function AsciiBlock({ art, dimmed = false, label }: AsciiBlockProps) {
  return (
    <figure className={dimmed ? "opacity-75" : undefined}>
      {label ? (
        <figcaption className="sr-only">{label}</figcaption>
      ) : null}
      <pre className="ascii-hud m-0 select-none">{art}</pre>
    </figure>
  );
}

type HudColumnProps = {
  /** 同一象限内纵向堆叠多个 ASCII 面板（多服务 / 多数据源） */
  children: ReactNode;
};

export function HudColumn({ children }: HudColumnProps) {
  return <div className="flex flex-col items-end gap-4">{children}</div>;
}

type HudQuadrantProps = {
  children: ReactNode;
  align?: "start" | "end";
  vertical?: "start" | "end";
};

export function HudQuadrant({
  children,
  align = "end",
  vertical = "end",
}: HudQuadrantProps) {
  const alignClass = align === "end" ? "items-end" : "items-start";
  const verticalClass = vertical === "end" ? "justify-end" : "justify-start";

  return (
    <div className={`flex h-full w-full flex-col ${verticalClass} ${alignClass}`}>
      {children}
    </div>
  );
}
