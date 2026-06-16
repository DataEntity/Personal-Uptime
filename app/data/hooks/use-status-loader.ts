"use client";

import { useEffect, useState } from "react";

import type { StatusLoader, StatusLoaderOptions } from "../ports";
import type { ServerStatusData, StatusBadge } from "../types";

export type StatusLoaderState = {
  data: ServerStatusData | null;
  loading: boolean;
  badge: StatusBadge;
  offline: boolean;
  error: string | null;
};

const initialState: StatusLoaderState = {
  data: null,
  loading: true,
  badge: "SYNC",
  offline: false,
  error: null,
};

/**
 * 通用状态 hook：只消费注入的 loader，不感知 env / API URL。
 */
export function useStatusLoader(
  loader: StatusLoader,
  options: StatusLoaderOptions = {},
): StatusLoaderState {
  const pollIntervalMs = options.pollIntervalMs ?? 0;
  const [state, setState] = useState<StatusLoaderState>(initialState);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const result = await loader();
        if (cancelled) return;

        setState({
          data: result.data,
          loading: false,
          badge: result.badge,
          offline: result.offline,
          error: result.error,
        });
      } catch (err) {
        if (cancelled) return;

        setState({
          data: null,
          loading: false,
          badge: "OFF",
          offline: true,
          error: err instanceof Error ? err.message : "连接失败",
        });
      }
    };

    void load();

    if (pollIntervalMs <= 0) {
      return () => {
        cancelled = true;
      };
    }

    const timer = window.setInterval(load, pollIntervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [loader, pollIntervalMs]);

  return state;
}
