import type { ServerStatusData, StatusBadge } from "@/app/data/types";
import { renderServerStatusPanel } from "@/app/lib/ascii/render-server-status";

import { AsciiBlock } from "../hud/AsciiHud";

export type ServerStatusPanelProps = {
  hostName: string;
  data: ServerStatusData | null;
  loading?: boolean;
  badge?: StatusBadge;
  offline?: boolean;
};

/** 纯展示：单个服务器的 ASCII 状态面板 */
export function ServerStatusPanel({
  hostName,
  data,
  loading = false,
  badge = "DEV",
  offline = false,
}: ServerStatusPanelProps) {
  const art = renderServerStatusPanel({
    hostName,
    data,
    loading,
    badge,
  });

  return (
    <AsciiBlock
      art={art}
      dimmed={offline && data !== null}
      label={`${hostName} server status`}
    />
  );
}
