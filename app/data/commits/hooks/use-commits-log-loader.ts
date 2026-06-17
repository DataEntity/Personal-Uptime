"use client";

import { useEffect, useState } from "react";

import type { StatusBadge } from "@/app/data/types";

import type { CommitsLogLoader, CommitsLogLoaderOptions } from "../ports";
import type { CommitsLogData } from "../types";

export type CommitsLogLoaderState = {
  data: CommitsLogData | null;
  loading: boolean;
  badge: StatusBadge;
  offline: boolean;
  error: string | null;
};

const initialState: CommitsLogLoaderState = {
  data: null,
  loading: true,
  badge: "SYNC",
  offline: false,
  error: null,
};

/** 通用 commits log hook：只消费注入的 loader，默认 15 分钟轮询 */
export function useCommitsLogLoader(
  loader: CommitsLogLoader,
  options: CommitsLogLoaderOptions = {},
): CommitsLogLoaderState {
  const pollIntervalMs = options.pollIntervalMs ?? 0;
  const [state, setState] = useState<CommitsLogLoaderState>(initialState);

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
