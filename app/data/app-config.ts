import type { DataMode } from "./loaders";
import type { CommitsLogDataMode } from "./commits/loaders";

/** 单个服务器面板的可序列化配置（可从 page 注入给 Client 组件） */
export type AppStatusConfig = {
  hostName: string;
  mode: DataMode;
  apiUrl: string;
  timeoutMs: number;
  pollIntervalMs: number;
};

/** 左下 commits log 终端配置 */
export type AppCommitsLogConfig = {
  mode: CommitsLogDataMode;
  apiUrl: string;
  timeoutMs: number;
  /** live/auto 默认 15 分钟轮询 */
  pollIntervalMs: number;
};

const DEFAULT_STATUS_API_URL = "http://100.67.173.13:3000/status";
const DEFAULT_COMMITS_API_URL = "http://100.67.173.13:3000/commits/log";
const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_STATUS_POLL_MS = 60_000;
const DEFAULT_COMMITS_POLL_MS = 900_000;

/** Composition Root 用：从 env 组装配置，未来多服务可返回数组 */
export function getAppStatusConfig(): AppStatusConfig {
  const mode = (process.env.NEXT_PUBLIC_DATA_MODE ?? "mock") as DataMode;

  return {
    hostName: process.env.NEXT_PUBLIC_HOST_NAME ?? "homelab",
    mode,
    apiUrl:
      process.env.NEXT_PUBLIC_STATUS_API_URL ?? DEFAULT_STATUS_API_URL,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    pollIntervalMs: mode === "mock" ? 0 : DEFAULT_STATUS_POLL_MS,
  };
}

export function getCommitsLogConfig(): AppCommitsLogConfig {
  const mode = (process.env.NEXT_PUBLIC_DATA_MODE ?? "mock") as CommitsLogDataMode;

  return {
    mode,
    apiUrl:
      process.env.NEXT_PUBLIC_COMMITS_API_URL ?? DEFAULT_COMMITS_API_URL,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    pollIntervalMs: mode === "mock" ? 0 : DEFAULT_COMMITS_POLL_MS,
  };
}
