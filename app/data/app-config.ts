import type { DataMode } from "./loaders";

/** 单个服务器面板的可序列化配置（可从 page 注入给 Client 组件） */
export type AppStatusConfig = {
  hostName: string;
  mode: DataMode;
  apiUrl: string;
  timeoutMs: number;
  pollIntervalMs: number;
};

const DEFAULT_API_URL = "http://100.67.173.13:3000/status";
const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_POLL_INTERVAL_MS = 60_000;

/** Composition Root 用：从 env 组装配置，未来多服务可返回数组 */
export function getAppStatusConfig(): AppStatusConfig {
  const mode = (process.env.NEXT_PUBLIC_DATA_MODE ?? "mock") as DataMode;

  return {
    hostName: process.env.NEXT_PUBLIC_HOST_NAME ?? "homelab",
    mode,
    apiUrl: process.env.NEXT_PUBLIC_STATUS_API_URL ?? DEFAULT_API_URL,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    pollIntervalMs: mode === "mock" ? 0 : DEFAULT_POLL_INTERVAL_MS,
  };
}
