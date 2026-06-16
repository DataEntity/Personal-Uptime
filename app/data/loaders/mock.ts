import type { StatusLoader } from "../ports";
import type { ServerStatusData } from "../types";

import { createMockSnapshot } from "./mock-data";

export type MockLoaderOptions = {
  getData?: () => ServerStatusData;
};

/** 始终返回本地 mock 数据，徽章 DEV */
export function createMockLoader(options: MockLoaderOptions = {}): StatusLoader {
  const getData = options.getData ?? createMockSnapshot;

  return async () => ({
    data: getData(),
    badge: "DEV",
    offline: false,
    error: null,
  });
}
