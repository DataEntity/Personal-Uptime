import type { StatusLoader } from "../ports";
import type { ServerStatusData } from "../types";

export type LiveLoaderConfig = {
  apiUrl: string;
  timeoutMs?: number;
};

async function fetchStatusJson(
  apiUrl: string,
  timeoutMs: number,
): Promise<ServerStatusData> {
  const response = await fetch(apiUrl, {
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return (await response.json()) as ServerStatusData;
}

/** 从 HTTP API 拉取，成功徽章 LIVE；失败向上抛出 */
export function createLiveLoader(config: LiveLoaderConfig): StatusLoader {
  const timeoutMs = config.timeoutMs ?? 8_000;

  return async () => {
    const data = await fetchStatusJson(config.apiUrl, timeoutMs);

    return {
      data,
      badge: "LIVE",
      offline: false,
      error: null,
    };
  };
}
