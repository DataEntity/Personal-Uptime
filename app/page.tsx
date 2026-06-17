import {
  getAppStatusConfig,
  getCommitsLogConfig,
} from "@/app/data/app-config";
import { createMockCommitsLogSnapshot } from "@/app/data/commits/loaders/mock-data";
import { createMockSnapshot } from "@/app/data/loaders/mock-data";
import { CommitsLogPanel } from "./components/Commits/CommitsLogPanel";
import { CommitsLogWidget } from "./components/Commits/CommitsLogWidget";
import { WallpaperCanvas } from "./components/layout/WallpaperCanvas";
import { HudColumn } from "./components/hud/AsciiHud";
import { ServerStatusPanel } from "./components/ServerStatus/StatusPanel";
import { ServerStatusWidget } from "./components/ServerStatus/ServerStatusWidget";

/**
 * Composition Root：唯一决定「加载哪些服务、用什么配置」的地方。
 */
export default function Home() {
  const homelab = getAppStatusConfig();
  const commitsLog = getCommitsLogConfig();

  const bottomLeft =
    commitsLog.mode === "mock" ? (
      <CommitsLogPanel data={createMockCommitsLogSnapshot()} badge="DEV" />
    ) : (
      <CommitsLogWidget config={commitsLog} />
    );

  const bottomRight = (
    <HudColumn>
      {homelab.mode === "mock" ? (
        <ServerStatusPanel
          hostName={homelab.hostName}
          data={createMockSnapshot()}
          badge="DEV"
        />
      ) : (
        <ServerStatusWidget config={homelab} />
      )}
    </HudColumn>
  );

  return (
    <WallpaperCanvas bottomLeft={bottomLeft} bottomRight={bottomRight} />
  );
}
