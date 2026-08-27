"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const STORAGE_KEY = "yan-home-theme-v2";

/** 背景渐变预设（与主题色联动的双色渐变） */
export const BG_PRESETS: [string, string][] = [
  ["#0f0f1e", "#1a1a2e"], // 经典暗紫（原站）
  ["#0a0a2e", "#2d0a3f"], // 赛博紫夜
  ["#050d21", "#0f2b5b"], // 霓虹深蓝
  ["#160a29", "#3a0d2e"], // 洋红幻境
  ["#0b0f1c", "#12263a"], // 钢蓝冷夜
  ["#140f0f", "#331c1c"], // 熔岩红
];

export interface ThemeSettings {
  bgMode: "preset" | "solid" | "image";
  bgPreset: number;
  bgColor: string;
  bgImage: string | null;
  contentOpacity: number;
  primary: string;
  secondary: string;
  accent: string;
  gridOverlay: boolean;
}

export const DEFAULT_SETTINGS: ThemeSettings = {
  bgMode: "preset",
  bgPreset: 0,
  bgColor: "#0f0f1e",
  bgImage: null,
  contentOpacity: 0.72,
  primary: "#6a11cb",
  secondary: "#2575fc",
  accent: "#ff3e78",
  gridOverlay: false,
};

/** 根据设置计算背景样式 */
export function bgStyle(settings: ThemeSettings): CSSProperties {
  if (settings.bgMode === "solid") {
    return { background: settings.bgColor };
  }
  if (settings.bgMode === "image" && settings.bgImage) {
    return {
      backgroundImage: `url(${settings.bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  const [c1, c2] = BG_PRESETS[settings.bgPreset] ?? BG_PRESETS[0];
  return { background: `linear-gradient(135deg, ${c1}, ${c2})` };
}

interface ThemeContextValue {
  settings: ThemeSettings;
  update: (patch: Partial<ThemeSettings>) => void;
  reset: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  settings: DEFAULT_SETTINGS,
  update: () => {},
  reset: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  // 首次挂载时从 localStorage 恢复用户自定义
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ThemeSettings>;
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {
      /* 忽略损坏的存储 */
    }
    setReady(true);
  }, []);

  // 应用主题变量到 :root，并持久化
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.style.setProperty("--theme-primary", settings.primary);
    root.style.setProperty("--theme-secondary", settings.secondary);
    root.style.setProperty("--theme-accent", settings.accent);
    root.style.setProperty("--content-opacity", String(settings.contentOpacity));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* 存储已满等情况忽略 */
    }
  }, [settings, ready]);

  const update = useCallback((patch: Partial<ThemeSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  return (
    <ThemeContext.Provider value={{ settings, update, reset }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
