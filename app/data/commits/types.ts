import type { StatusBadge } from "../types";

/** 单条 commit log 行（与后端 GET /commits/log 契约对齐） */
export type CommitLogLine = {
  repo: string;
  short: string;
  subject: string;
  /** 展示用时间，如 "2h" 或 ISO 字符串 */
  time: string;
};

/** GET /commits/log 响应体 */
export type CommitsLogData = {
  updatedAt: string;
  lines: CommitLogLine[];
};

/** Loader 单次拉取结果 */
export type CommitsLogLoadResult = {
  data: CommitsLogData;
  badge: StatusBadge;
  offline: boolean;
  error: string | null;
};
