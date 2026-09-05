'use client';

import { useEffect, useRef } from 'react';

export default function DotCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.innerWidth < 768) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SPACING = 28, R = 1.8, REPEL = 200, LERP = 0.08;
    type Dot = { rx: number; ry: number; cx: number; cy: number; vx: number; vy: number; lit: number };
    let dots: Dot[] = [];
    let mouse = { x: -9999, y: -9999 };
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dots = [];
      for (let x = 0; x < canvas.width; x += SPACING) {
        for (let y = 0; y < canvas.height; y += SPACING) {
          dots.push({ rx: x, ry: y, cx: x, cy: y, vx: 0, vy: 0, lit: 0 });
        }
      }
    };

    const draw = () => {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach(d => {
        const dx = d.cx - mouse.x;
        const dy = d.cy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL) {
          const f = (REPEL - dist) / REPEL;
          d.vx += (dx / dist) * f * 3;
          d.vy += (dy / dist) * f * 3;
          d.lit = Math.max(d.lit, Math.pow(1 - dist / REPEL, 1.5));
        } else {
          d.lit *= 0.90;
        }

        d.cx += (d.rx - d.cx) * LERP + d.vx;
        d.cy += (d.ry - d.cy) * LERP + d.vy;
        d.vx *= 0.85;
        d.vy *= 0.85;

        if (d.lit > 0.01) {
          const base = isDark ? [255, 255, 255, 0.12] : [0, 0, 0, 0.1];
          const accent = [59, 130, 246];
          const r = Math.round(base[0] + (accent[0] - base[0]) * d.lit);
          const g = Math.round(base[1] + (accent[1] - base[1]) * d.lit);
          const b = Math.round(base[2] + (accent[2] - base[2]) * d.lit);
          const a = (base[3] as number) + (0.8 - (base[3] as number)) * d.lit;
          ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
          const radius = R + d.lit * 2.5;
          ctx.beginPath();
          ctx.arc(d.cx, d.cy, radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
          ctx.beginPath();
          ctx.arc(d.cx, d.cy, R, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouse = { x: -9999, y: -9999 };
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
