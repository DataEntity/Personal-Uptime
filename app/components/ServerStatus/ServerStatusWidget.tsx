"use client";

import { useMemo } from "react";

import type { AppStatusConfig } from "@/app/data/app-config";
import { createStatusLoader } from "@/app/data/loaders";
import { useStatusLoader } from "@/app/data/hooks/use-status-loader";

import { ServerStatusPanel } from "./StatusPanel";

type ServerStatusWidgetProps = {
  config: AppStatusConfig;
};

/**
 * 数据容器：接收 page 注入的配置，组装 loader，驱动纯展示 Panel。
 * 未来多台机器 = 多个 <ServerStatusWidget config={...} /> 实例。
 */
export function ServerStatusWidget({ config }: ServerStatusWidgetProps) {
  const loader = useMemo(
    () =>
      createStatusLoader(config.mode, {
        apiUrl: config.apiUrl,
        timeoutMs: config.timeoutMs,
      }),
    [config.mode, config.apiUrl, config.timeoutMs],
  );

  const { data, loading, badge, offline, error } = useStatusLoader(loader, {
    pollIntervalMs: config.pollIntervalMs,
  });

  return (
    <div className="flex flex-col items-end gap-1">
      <ServerStatusPanel
        hostName={config.hostName}
        data={data}
        loading={loading}
        badge={loading ? "SYNC" : badge}
        offline={offline}
      />
      {error && !loading ? (
        <p className="max-w-72 text-right font-mono text-[10px] text-red-300/60">
          {error}
        </p>
      ) : null}
    </div>
  );
}
