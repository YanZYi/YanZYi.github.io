"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  twinkle: number;
  twinkleSpeed: number;
}

interface ParticlesProps {
  /** 粒子数量（原站为 70） */
  density?: number;
  /** 移动速度（原站为 2） */
  speed?: number;
  /** 连线距离 */
  linkDistance?: number;
  /** 鼠标排斥半径 */
  repulseRadius?: number;
}

/**
 * 增强版粒子背景
 * - 粒子颜色跟随 CSS 变量 --theme-primary（与主题联动）
 * - 鼠标悬停排斥、点击推散
 * - 粒子间连线、呼吸闪烁、DPR 适配
 */
export default function Particles({
  density = 70,
  speed = 2,
  linkDistance = 150,
  repulseRadius = 120,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let rafId = 0;
    let lastColor = "";
    let colorTimer = 0;
    const mouse = { x: -9999, y: -9999, clickX: -9999, clickY: -9999, clickAt: 0 };

    const readColor = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--theme-primary")
        .trim();
      return v || "#6a11cb";
    };

    const spawn = (): Particle => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * speed * 1.4,
      vy: (Math.random() - 0.5) * speed * 1.4,
      r: Math.random() * 2.4 + 1,
      alpha: Math.random() * 0.35 + 0.15,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.004,
    });

    const init = () => {
      particles = Array.from({ length: density }, spawn);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onClick = (e: MouseEvent) => {
      mouse.clickX = e.clientX;
      mouse.clickY = e.clientY;
      mouse.clickAt = performance.now();
    };

    const draw = (now: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      // 每 ~600ms 刷新一次主题色
      if (now - colorTimer > 600) {
        lastColor = readColor();
        colorTimer = now;
      }
      ctx.clearRect(0, 0, w, h);

      const linkDist2 = linkDistance * linkDistance;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 鼠标排斥（hover）
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < repulseRadius * repulseRadius && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const force = ((repulseRadius - d) / repulseRadius) * 0.8;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }

        // 点击推散
        const clickDx = p.x - mouse.clickX;
        const clickDy = p.y - mouse.clickY;
        const cd2 = clickDx * clickDx + clickDy * clickDy;
        if (now - mouse.clickAt < 300 && cd2 < 10000 && cd2 > 0.01) {
          const cd = Math.sqrt(cd2);
          const force = ((100 - cd) / 100) * 1.2;
          p.vx += (clickDx / cd) * force;
          p.vy += (clickDy / cd) * force;
        }

        p.x += p.vx;
        p.y += p.vy;

        // 边界回弹
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.min(Math.max(p.x, 0), w);
        p.y = Math.min(Math.max(p.y, 0), h);

        // 呼吸闪烁
        p.twinkle += p.twinkleSpeed;
        const alpha = p.alpha * (0.55 + 0.45 * Math.sin(p.twinkle));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = lastColor;
        ctx.globalAlpha = Math.max(0.05, alpha);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 粒子间连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist2) {
            const opacity = (1 - Math.sqrt(d2) / linkDistance) * 0.3;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = lastColor;
            ctx.globalAlpha = Math.max(0, opacity);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseout", onMouseLeave);
    window.addEventListener("click", onClick);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseLeave);
      window.removeEventListener("click", onClick);
    };
  }, [density, speed, linkDistance, repulseRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-[1] h-full w-full"
      aria-hidden
    />
  );
}
