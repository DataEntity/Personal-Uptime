import type { StatusLoadResult } from "./types";

/**
 * 可插拔数据源接口（Port）
 *
 * 实现方：live loader / mock loader / auto loader
 * 消费方：useStatusLoader hook（步骤 3）
 * 注入点：page.tsx（步骤 4）
 */
export type StatusLoader = () => Promise<StatusLoadResult>;

export type StatusLoaderOptions = {
  /** 轮询间隔，毫秒；0 表示不轮询 */
  pollIntervalMs?: number;
};
