import type { CommitsLogData } from "@/app/data/commits/types";
import type { StatusBadge } from "@/app/data/types";
import {
  COMMITS_LOG_PANEL_WIDTH,
  renderCommitsLogPanel,
} from "@/app/lib/ascii/render-commits-log";

import { AsciiTerminal } from "../hud/AsciiHud";

export type CommitsLogPanelProps = {
  data: CommitsLogData | null;
  loading?: boolean;
  badge?: StatusBadge;
  offline?: boolean;
};

export function CommitsLogPanel({
  data,
  loading = false,
  badge = "DEV",
  offline = false,
}: CommitsLogPanelProps) {
  const art = renderCommitsLogPanel({ data, loading, badge });

  return (
    <AsciiTerminal
      art={art}
      cols={COMMITS_LOG_PANEL_WIDTH}
      dimmed={offline && data !== null}
      label="GitHub commits log"
    />
  );
}
