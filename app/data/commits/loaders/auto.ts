import type { CommitsLogLoader } from "../ports";

import {
  createCommitsLogLiveLoader,
  type CommitsLogLiveLoaderConfig,
} from "./live";
import { createMockCommitsLogLoader } from "./mock";

export function createCommitsLogAutoLoader(
  config: CommitsLogLiveLoaderConfig,
): CommitsLogLoader {
  const live = createCommitsLogLiveLoader(config);
  const mock = createMockCommitsLogLoader();

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
