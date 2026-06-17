import type { CommitsLogData } from "@/app/data/commits/types";
import type { StatusBadge } from "@/app/data/types";

/** 左下终端面板宽度（字符数，配合 CSS 横向铺满象限） */
export const COMMITS_LOG_PANEL_WIDTH = 54;

/** 终端总行数（含边框），用于纵向铺满象限 */
export const COMMITS_LOG_PANEL_MIN_LINES = 32;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1))}…`;
}

function topBorder(title: string, badge: string): string {
  const prefix = `─ ${title} `;
  const suffix = ` ${badge} ─`;
  const dashCount = COMMITS_LOG_PANEL_WIDTH - 2 - prefix.length - suffix.length;

  return `┌${prefix}${"─".repeat(Math.max(0, dashCount))}${suffix}┐`;
}

function bottomBorder(): string {
  return `└${"─".repeat(COMMITS_LOG_PANEL_WIDTH - 2)}┘`;
}

function contentLine(content: string): string {
  const inner = content.padEnd(COMMITS_LOG_PANEL_WIDTH - 2);
  return `│${inner}│`;
}

function formatLogLine(
  short: string,
  subject: string,
  time: string,
): string {
  const timePart = time.padStart(4);
  const prefix = `> ${short}  `;
  const maxSubject =
    COMMITS_LOG_PANEL_WIDTH - 2 - prefix.length - timePart.length - 1;

  return contentLine(`${prefix}${truncate(subject, maxSubject)}${timePart}`);
}

function padToMinLines(lines: string[]): string {
  const footer = ["", contentLine(" _"), bottomBorder()];
  const padded = [...lines];

  while (padded.length + footer.length < COMMITS_LOG_PANEL_MIN_LINES) {
    padded.push(contentLine(""));
  }

  return [...padded, ...footer].join("\n");
}

type RenderCommitsLogOptions = {
  data: CommitsLogData | null;
  loading?: boolean;
  badge?: StatusBadge;
};

export function renderCommitsLogPanel({
  data,
  loading = false,
  badge = "DEV",
}: RenderCommitsLogOptions): string {
  const displayBadge = loading ? "SYNC" : badge;
  const lines: string[] = [
    topBorder("GIT LOG", displayBadge),
    contentLine(" ~/github"),
    contentLine(""),
  ];

  if (loading && !data) {
    lines.push(contentLine(" ▒▒▒▒▒▒  syncing commits..."));
    lines.push(contentLine(" ▒▒▒▒▒▒  ..."));
    return padToMinLines(lines);
  }

  for (const line of data?.lines ?? []) {
    lines.push(formatLogLine(line.short, line.subject, line.time));
  }

  if ((data?.lines.length ?? 0) === 0) {
    lines.push(contentLine(" (no commits)"));
  }

  return padToMinLines(lines);
}
