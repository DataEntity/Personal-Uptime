import type { CSSProperties, ReactNode } from "react";

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

type AsciiTerminalProps = {
  art: string;
  /** 面板总字符宽度（与 render 侧一致，用于横向铺满） */
  cols: number;
  dimmed?: boolean;
  label?: string;
};

/** 铺满父容器的仿终端面板（左下象限用，不依赖 JS 量测） */
export function AsciiTerminal({
  art,
  cols,
  dimmed = false,
  label,
}: AsciiTerminalProps) {
  const lineCount = art.split("\n").length;

  return (
    <figure
      className={`ascii-terminal m-0 h-full w-full min-h-0${dimmed ? " opacity-75" : ""}`}
      style={
        {
          "--terminal-cols": cols,
          "--terminal-lines": lineCount,
        } as CSSProperties
      }
    >
      {label ? (
        <figcaption className="sr-only">{label}</figcaption>
      ) : null}
      <pre className="ascii-hud ascii-terminal__pre m-0 h-full w-full select-none">
        {art}
      </pre>
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
  /** 子元素拉伸至象限宽高（左下终端用） */
  fill?: boolean;
};

export function HudQuadrant({
  children,
  align = "end",
  vertical = "end",
  fill = false,
}: HudQuadrantProps) {
  const alignClass = fill
    ? "items-stretch"
    : align === "end"
      ? "items-end"
      : "items-start";
  const verticalClass = vertical === "end" ? "justify-end" : "justify-start";

  return (
    <div className={`flex h-full w-full min-h-0 flex-col ${verticalClass} ${alignClass}`}>
      {fill ? (
        <div className="flex min-h-0 w-full flex-1 flex-col">{children}</div>
      ) : (
        children
      )}
    </div>
  );
}
