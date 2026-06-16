import type { ServerStatusData, StatusBadge } from "@/app/data/types";

import {
  asciiBottomBorder,
  asciiContentLine,
  asciiMetricLine,
  asciiTopBorder,
  PANEL_WIDTH,
} from "./box";

function formatUpdatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

type RenderServerStatusOptions = {
  hostName: string;
  data: ServerStatusData | null;
  loading?: boolean;
  badge?: StatusBadge;
};

export function renderServerStatusPanel({
  hostName,
  data,
  loading = false,
  badge = "DEV",
}: RenderServerStatusOptions): string {
  const displayBadge = loading ? "SYNC" : badge;
  const uptime = loading ? "—" : (data?.uptime ?? "—");
  const updatedAt =
    loading || !data?.updatedAt ? "" : formatUpdatedAt(data.updatedAt);

  const footerLeft = `  ↑ ${uptime} uptime`;
  const footer =
    updatedAt.length > 0
      ? `${footerLeft.padEnd(PANEL_WIDTH - 2 - updatedAt.length)}${updatedAt}`
      : footerLeft;

  return [
    asciiTopBorder("SERVER", displayBadge),
    asciiContentLine(`  ${hostName}`),
    asciiMetricLine("CPU", data?.cpu ?? 0, loading),
    asciiMetricLine("RAM", data?.memory ?? 0, loading),
    asciiMetricLine("DISK", data?.disk ?? 0, loading),
    asciiContentLine(footer),
    asciiBottomBorder(),
  ].join("\n");
}
