export { MOCK_STATUS, createMockSnapshot } from "./mock-data";
export { createMockLoader, type MockLoaderOptions } from "./mock";
export { createLiveLoader, type LiveLoaderConfig } from "./live";
export { createAutoLoader } from "./auto";

export type DataMode = "mock" | "live" | "auto";

import type { StatusLoader } from "../ports";

import { createAutoLoader } from "./auto";
import { createLiveLoader, type LiveLoaderConfig } from "./live";
import { createMockLoader } from "./mock";

/** 按模式选择 loader，供 Composition Root（page.tsx）使用 */
export function createStatusLoader(
  mode: DataMode,
  config: LiveLoaderConfig,
): StatusLoader {
  switch (mode) {
    case "mock":
      return createMockLoader();
    case "live":
      return createLiveLoader(config);
    case "auto":
      return createAutoLoader(config);
  }
}
