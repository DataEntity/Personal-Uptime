/** 面板每行总宽度（含左右边框字符） */
export const PANEL_WIDTH = 32;

const BAR_WIDTH = 12;

export function asciiBar(value: number, loading = false): string {
  if (loading) {
    return "▒".repeat(4) + "░".repeat(BAR_WIDTH - 4);
  }

  const clamped = Math.min(100, Math.max(0, value));
  const filled = Math.round((clamped / 100) * BAR_WIDTH);

  return "█".repeat(filled) + "░".repeat(BAR_WIDTH - filled);
}

export function asciiTopBorder(title: string, badge: string): string {
  const prefix = `─ ${title} `;
  const suffix = ` ${badge} ─`;
  const dashCount = PANEL_WIDTH - 2 - prefix.length - suffix.length;

  return `┌${prefix}${"─".repeat(Math.max(0, dashCount))}${suffix}┐`;
}

export function asciiBottomBorder(): string {
  return `└${"─".repeat(PANEL_WIDTH - 2)}┘`;
}

export function asciiContentLine(content: string): string {
  const inner = content.padEnd(PANEL_WIDTH - 2);
  return `│${inner}│`;
}

export function asciiMetricLine(
  label: string,
  value: number,
  loading = false,
): string {
  const bar = asciiBar(value, loading);
  const pct = loading ? "  —" : `${String(value).padStart(3)}%`;

  return asciiContentLine(`  ${label.padEnd(5)} ${bar}    ${pct}  `);
}
