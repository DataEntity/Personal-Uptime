"use client";

import { useMemo } from "react";

import type { AppCommitsLogConfig } from "@/app/data/app-config";
import { createCommitsLogLoader } from "@/app/data/commits/loaders";
import { useCommitsLogLoader } from "@/app/data/commits/hooks/use-commits-log-loader";

import { CommitsLogPanel } from "./CommitsLogPanel";

type CommitsLogWidgetProps = {
  config: AppCommitsLogConfig;
};

/** 数据容器：loader + hook → 纯展示 CommitsLogPanel */
export function CommitsLogWidget({ config }: CommitsLogWidgetProps) {
  const loader = useMemo(
    () =>
      createCommitsLogLoader(config.mode, {
        apiUrl: config.apiUrl,
        timeoutMs: config.timeoutMs,
      }),
    [config.mode, config.apiUrl, config.timeoutMs],
  );

  const { data, loading, badge, offline, error } = useCommitsLogLoader(
    loader,
    { pollIntervalMs: config.pollIntervalMs },
  );

  return (
    <div className="flex h-full w-full min-h-0 flex-col items-stretch gap-1">
      <div className="flex min-h-0 flex-1 flex-col">
        <CommitsLogPanel
          data={data}
          loading={loading}
          badge={loading ? "SYNC" : badge}
          offline={offline}
        />
      </div>
      {error && !loading ? (
        <p className="max-w-lg font-mono text-[10px] text-red-300/60">{error}</p>
      ) : null}
    </div>
  );
}
