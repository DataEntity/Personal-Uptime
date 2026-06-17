import type { CommitsLogLoader } from "../ports";
import type { CommitsLogData } from "../types";

export type CommitsLogLiveLoaderConfig = {
  apiUrl: string;
  timeoutMs?: number;
};

async function fetchCommitsLogJson(
  apiUrl: string,
  timeoutMs: number,
): Promise<CommitsLogData> {
  const response = await fetch(apiUrl, {
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return (await response.json()) as CommitsLogData;
}

export function createCommitsLogLiveLoader(
  config: CommitsLogLiveLoaderConfig,
): CommitsLogLoader {
  const timeoutMs = config.timeoutMs ?? 8_000;

  return async () => {
    const data = await fetchCommitsLogJson(config.apiUrl, timeoutMs);

    return {
      data,
      badge: "LIVE",
      offline: false,
      error: null,
    };
  };
}
