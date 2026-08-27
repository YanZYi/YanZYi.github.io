"use client";

import { bgStyle, useTheme } from "./ThemeProvider";
import Particles from "./Particles";

/**
 * 背景层：主题背景 + 赛博网格 + 粒子
 * 通过负 z-index 置于内容之下
 */
export default function BackgroundLayers() {
  const { settings } = useTheme();

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-20" style={bgStyle(settings)} />
      {settings.gridOverlay && (
        <div className="cyber-grid pointer-events-none fixed inset-0 -z-[1]" />
      )}
      <Particles />
    </>
  );
}
