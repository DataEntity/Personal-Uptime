import type { CommitsLogData } from "../types";

export const MOCK_COMMITS_LOG: CommitsLogData = {
  updatedAt: new Date().toISOString(),
  lines: [
    {
      repo: "personal-uptime-server",
      short: "a1b2c3d",
      subject: "feat: add /commits/log proxy",
      time: "2h",
    },
    {
      repo: "personal-uptime-server",
      short: "b2c3d4e",
      subject: "docs: deployment notes",
      time: "1d",
    },
    {
      repo: "astro-blog",
      short: "f4e5d6a",
      subject: "fix(search): rebuild index on deploy",
      time: "3d",
    },
    {
      repo: "astro-blog",
      short: "c3d4e5f",
      subject: "feat: rss feed widget",
      time: "5d",
    },
  ],
};

export function createMockCommitsLogSnapshot(): CommitsLogData {
  return {
    ...MOCK_COMMITS_LOG,
    updatedAt: new Date().toISOString(),
  };
}
