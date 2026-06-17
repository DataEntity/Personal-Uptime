import type { CommitsLogLoadResult } from "./types";

/** 可插拔 commits log 数据源 */
export type CommitsLogLoader = () => Promise<CommitsLogLoadResult>;

export type CommitsLogLoaderOptions = {
  /** 轮询间隔，毫秒；0 表示不轮询 */
  pollIntervalMs?: number;
};
