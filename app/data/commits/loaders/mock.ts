import type { CommitsLogLoader } from "../ports";
import type { CommitsLogData } from "../types";

import { createMockCommitsLogSnapshot } from "./mock-data";

export type MockCommitsLogLoaderOptions = {
  getData?: () => CommitsLogData;
};

export function createMockCommitsLogLoader(
  options: MockCommitsLogLoaderOptions = {},
): CommitsLogLoader {
  const getData = options.getData ?? createMockCommitsLogSnapshot;

  return async () => ({
    data: getData(),
    badge: "DEV",
    offline: false,
    error: null,
  });
}
