import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="glass-card px-8 py-16 text-center">
      <h1 className="gradient-text neon-text text-7xl font-bold">404</h1>
      <p className="mt-5 text-lg text-[rgba(240,240,255,0.75)]">
        页面不存在或已被移除
      </p>
      <Link href="/" className="neon-btn mt-8">
        <Home size={16} />
        返回首页
      </Link>
    </section>
  );
}
