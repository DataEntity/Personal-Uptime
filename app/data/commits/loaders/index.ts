export { MOCK_COMMITS_LOG, createMockCommitsLogSnapshot } from "./mock-data";
export {
  createMockCommitsLogLoader,
  type MockCommitsLogLoaderOptions,
} from "./mock";
export {
  createCommitsLogLiveLoader,
  type CommitsLogLiveLoaderConfig,
} from "./live";
export { createCommitsLogAutoLoader } from "./auto";

export type CommitsLogDataMode = "mock" | "live" | "auto";

import type { CommitsLogLoader } from "../ports";

import { createCommitsLogAutoLoader } from "./auto";
import {
  createCommitsLogLiveLoader,
  type CommitsLogLiveLoaderConfig,
} from "./live";
import { createMockCommitsLogLoader } from "./mock";

export function createCommitsLogLoader(
  mode: CommitsLogDataMode,
  config: CommitsLogLiveLoaderConfig,
): CommitsLogLoader {
  switch (mode) {
    case "mock":
      return createMockCommitsLogLoader();
    case "live":
      return createCommitsLogLiveLoader(config);
    case "auto":
      return createCommitsLogAutoLoader(config);
  }
}
