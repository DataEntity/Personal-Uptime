/** API / mock 共用的原始数据契约 */
export type ServerStatusData = {
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  updatedAt: string;
};

/** 面板右上角状态徽章（UI 只认这个，不关心数据从哪来） */
export type StatusBadge = "SYNC" | "DEV" | "LIVE" | "OFF";

/** Loader 单次拉取结果 */
export type StatusLoadResult = {
  data: ServerStatusData;
  badge: StatusBadge;
  offline: boolean;
  error: string | null;
};

/** 面板展示所需的完整 ViewModel */
export type ServerStatusViewModel = {
  hostName: string;
  data: ServerStatusData | null;
  loading: boolean;
  badge: StatusBadge;
  offline: boolean;
  error: string | null;
};
