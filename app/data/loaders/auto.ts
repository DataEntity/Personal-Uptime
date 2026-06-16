import type { StatusLoader } from "../ports";

import { createLiveLoader, type LiveLoaderConfig } from "./live";
import { createMockLoader } from "./mock";

/** 先 live，失败回退 mock，徽章 OFF + offline */
export function createAutoLoader(config: LiveLoaderConfig): StatusLoader {
  const live = createLiveLoader(config);
  const mock = createMockLoader();

  return async () => {
    try {
      return await live();
    } catch (err) {
      const message = err instanceof Error ? err.message : "连接失败";
      const fallback = await mock();

      return {
        ...fallback,
        badge: "OFF",
        offline: true,
        error: message,
      };
    }
  };
}
