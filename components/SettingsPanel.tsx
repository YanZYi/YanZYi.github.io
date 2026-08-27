"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  Brush,
  Check,
  Image as ImageIcon,
  RotateCcw,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { BG_PRESETS, DEFAULT_SETTINGS, useTheme } from "./ThemeProvider";

function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#eef0ff]">
      <span className="text-[var(--theme-accent)]">{icon}</span>
      {children}
    </h3>
  );
}

/** 开关 */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-[var(--theme-accent)]" : "bg-white/15"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function SettingsPanel() {
  const { settings, update, reset } = useTheme();
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      update({ bgMode: "image", bgImage: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      {/* 悬浮齿轮按钮 */}
      <button
        onClick={() => setOpen(true)}
        aria-label="打开外观设置"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
        style={{
          background: "linear-gradient(135deg, var(--theme-primary), var(--theme-accent))",
          boxShadow: "0 0 20px color-mix(in srgb, var(--theme-primary) 60%, transparent)",
        }}
      >
        <Settings2 size={22} />
      </button>

      {/* 遮罩 */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 设置面板 */}
      <aside
        className={`glass-card fixed right-0 top-0 z-50 flex h-full w-[340px] max-w-[92vw] flex-col overflow-hidden rounded-none transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--card-border)" }}>
          <h2 className="flex items-center gap-2 text-base font-bold text-[#eef0ff]">
            <SlidersHorizontal size={18} className="text-[var(--theme-accent)]" />
            外观设置
          </h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="关闭"
            className="rounded-lg p-1.5 text-[#9aa0c0] transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5">
          {/* 背景 */}
          <section>
            <SectionTitle icon={<ImageIcon size={15} />}>背景</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {BG_PRESETS.map(([c1, c2], i) => (
                <button
                  key={i}
                  onClick={() => update({ bgMode: "preset", bgPreset: i })}
                  className={`relative h-12 rounded-lg transition-transform hover:scale-105 ${
                    settings.bgMode === "preset" && settings.bgPreset === i
                      ? "ring-2 ring-[var(--theme-accent)]"
                      : "ring-1 ring-white/10"
                  }`}
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                  aria-label={`背景预设 ${i + 1}`}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-[#9aa0c0] transition-colors hover:border-[var(--theme-accent)]">
                <ImageIcon size={14} />
                {settings.bgMode === "image" && settings.bgImage ? "更换图片" : "上传背景图片"}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {settings.bgMode === "image" && settings.bgImage && (
                <button
                  onClick={() => update({ bgMode: "preset", bgImage: null })}
                  className="rounded-lg border border-white/10 p-2 text-[#9aa0c0] transition-colors hover:border-red-400 hover:text-red-400"
                  aria-label="移除背景图片"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="color"
                value={settings.bgMode === "solid" ? settings.bgColor : DEFAULT_SETTINGS.bgColor}
                onChange={(e) => update({ bgMode: "solid", bgColor: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded border border-white/10 bg-transparent"
                aria-label="纯色背景"
              />
              <span className="text-xs text-[#9aa0c0]">纯色背景</span>
            </div>
          </section>

          {/* 内容透明度 */}
          <section>
            <SectionTitle icon={<Brush size={15} />}>内容透明度</SectionTitle>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.01}
                value={settings.contentOpacity}
                onChange={(e) => update({ contentOpacity: Number(e.target.value) })}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-[var(--theme-accent)]"
                style={{ accentColor: "var(--theme-accent)" }}
              />
              <span className="w-10 text-right text-xs tabular-nums text-[#9aa0c0]">
                {Math.round(settings.contentOpacity * 100)}%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#6f7595]">调节卡片、侧边栏等内容的透明程度</p>
          </section>

          {/* 主题色 */}
          <section>
            <SectionTitle icon={<Brush size={15} />}>主题色</SectionTitle>
            <div className="space-y-2.5">
              {(
                [
                  ["primary", "主色"],
                  ["secondary", "辅助色"],
                  ["accent", "强调色"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-[#c6cae8]">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] uppercase text-[#9aa0c0]">{settings[key]}</span>
                    <input
                      type="color"
                      value={settings[key]}
                      onChange={(e) => update({ [key]: e.target.value })}
                      className="h-8 w-11 cursor-pointer rounded border border-white/10 bg-transparent"
                      aria-label={`${label}颜色`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 特效 */}
          <section>
            <SectionTitle icon={<Sparkles size={15} />}>特效</SectionTitle>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#c6cae8]">赛博网格叠加层</span>
              <Toggle checked={settings.gridOverlay} onChange={(v) => update({ gridOverlay: v })} />
            </div>
          </section>
        </div>

        {/* 底部操作 */}
        <div className="flex items-center gap-2 border-t px-5 py-4" style={{ borderColor: "var(--card-border)" }}>
          <button
            onClick={reset}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 py-2.5 text-sm text-[#c6cae8] transition-all hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
          >
            <RotateCcw size={15} />
            恢复默认
          </button>
          <button
            onClick={() => setOpen(false)}
            className="neon-btn flex-1 justify-center"
          >
            <Check size={16} />
            完成
          </button>
        </div>
      </aside>
    </>
  );
}
