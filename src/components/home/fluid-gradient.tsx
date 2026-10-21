"use client";

import React, { useEffect, useRef } from "react";

interface FluidGradientProps {
  colors?: string[];
  speed?: number;
  className?: string;
}

export function FluidGradient({
  colors = ["#A32D3B", "#3D1A24", "#1A1A1A", "#681D26"],
  speed = 0.0015,
  className = "w-full h-full",
}: FluidGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      t += speed;
      const w = canvas.width;
      const h = canvas.height;

      const grad = ctx.createLinearGradient(
        w * (0.5 + 0.3 * Math.cos(t)),
        0,
        w * (0.5 + 0.3 * Math.sin(t * 0.8)),
        h
      );

      const c0 = colors[0] || "#A32D3B";
      const c1 = colors[1] || "#2B0F15";
      const c2 = colors[2] || "#141414";

      grad.addColorStop(0, c0);
      grad.addColorStop(0.55, c1);
      grad.addColorStop(1, c2);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Soft ambient organic blobbies
      const cx1 = w * (0.4 + 0.25 * Math.sin(t * 1.2));
      const cy1 = h * (0.5 + 0.2 * Math.cos(t * 0.9));
      const radGrad1 = ctx.createRadialGradient(cx1, cy1, 10, cx1, cy1, Math.max(w, h) * 0.55);
      radGrad1.addColorStop(0, "rgba(163, 45, 59, 0.45)");
      radGrad1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = radGrad1;
      ctx.fillRect(0, 0, w, h);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block" }}
    />
  );
}
