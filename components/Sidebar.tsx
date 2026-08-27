"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  Github,
  Home,
  Linkedin,
  Mail,
  MapPin,
  PenSquare,
  Twitter,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "首页", icon: Home },
  { href: "/posts", label: "文章归档", icon: Archive },
  { href: "/about", label: "关于我", icon: User },
  { href: "/write", label: "写文章", icon: PenSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  // 静态导出会生成尾斜杠，归一化后做精确匹配
  const path = pathname.replace(/\/+$/, "") || "/";

  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-8 lg:w-[300px]">
      <div className="glass-card p-7 text-center">
        {/* 头像 */}
        <img
          src="/images/head.jpg"
          alt="Yan"
          className="mx-auto mb-4 h-20 w-20 rounded-full border-4 border-white/20 object-cover shadow-[0_0_25px_rgba(106,17,203,0.35)] lg:h-[120px] lg:w-[120px]"
        />

        {/* 个人信息 */}
        <h2 className="gradient-text text-[1.6rem] font-bold">严正易</h2>
        <p className="mt-1.5 mb-5 text-[0.95rem] text-[rgba(240,240,255,0.72)]">
          全栈开发 · 创意技术 · 算法设计
        </p>
        <p className="mb-5 hidden border-b border-white/10 pb-4 text-left text-[0.92rem] leading-relaxed text-[rgba(240,240,255,0.72)] md:block">
          把复杂的设计转化为优雅的代码，将复杂的功能需求转化为简洁的算法实现。在这里记录学习笔记与技术思考。
        </p>

        {/* 导航 */}
        <nav className="mb-5 flex flex-col gap-1.5 text-left sm:flex-row sm:flex-wrap sm:justify-center">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`side-link ${path === href ? "active" : ""}`}
            >
              <Icon size={17} strokeWidth={2} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* 社交 */}
        <div className="mb-4 flex justify-center gap-3">
          {[
            { href: "https://github.com/YanZYi", title: "GitHub", Icon: Github },
            { href: "#", title: "LinkedIn", Icon: Linkedin },
            { href: "#", title: "Twitter", Icon: Twitter },
            { href: "mailto:yanzhyii@outlook.com", title: "Email", Icon: Mail },
          ].map(({ href, title, Icon }) => (
            <a
              key={title}
              href={href}
              title={title}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[rgba(240,240,255,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--theme-accent)] hover:text-white"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        {/* 联系方式 */}
        <div className="flex flex-col gap-2 text-left text-[0.82rem] text-[rgba(240,240,255,0.72)]">
          <span className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 text-[var(--theme-accent)]" />
            中国 · 无锡
          </span>
          <span className="flex items-center gap-2">
            <Mail size={14} className="shrink-0 text-[var(--theme-accent)]" />
            yanzhyii@outlook.com
          </span>
        </div>
      </div>
    </aside>
  );
}
