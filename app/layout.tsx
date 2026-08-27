import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import BackgroundLayers from "@/components/BackgroundLayers";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import SettingsPanel from "@/components/SettingsPanel";

export const metadata: Metadata = {
  title: {
    default: "Yan Home | 博客",
    template: "%s | Yan Home",
  },
  description:
    "严正易的个人网站 —— 全栈开发 · 创意技术 · 算法设计，记录学习笔记与技术思考。",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <ThemeProvider>
          <BackgroundLayers />
          <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-5 py-8 lg:flex-row lg:items-start">
            <Sidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
          <Footer />
          <SettingsPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
