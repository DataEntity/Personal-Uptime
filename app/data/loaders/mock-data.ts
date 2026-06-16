import type { ServerStatusData } from "../types";

export const MOCK_STATUS: ServerStatusData = {
  cpu: 12,
  memory: 47,
  disk: 63,
  uptime: "15d",
  updatedAt: new Date().toISOString(),
};

export function createMockSnapshot(): ServerStatusData {
  return {
    ...MOCK_STATUS,
    updatedAt: new Date().toISOString(),
  };
}
