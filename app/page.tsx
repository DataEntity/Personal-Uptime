import { getAppStatusConfig } from "@/app/data/app-config";
import { WallpaperCanvas } from "./components/layout/WallpaperCanvas";
import { HudColumn } from "./components/hud/AsciiHud";
import { ServerStatusWidget } from "./components/ServerStatus/ServerStatusWidget";

/**
 * Composition Root：唯一决定「加载哪些服务、用什么配置」的地方。
 * 未来多服务：getAppStatusConfigs() 返回数组，map 成多个 Widget。
 */
export default function Home() {
  const homelab = getAppStatusConfig();

  return (
    <WallpaperCanvas
      bottomRight={
        <HudColumn>
          <ServerStatusWidget config={homelab} />
        </HudColumn>
      }
    />
  );
}
