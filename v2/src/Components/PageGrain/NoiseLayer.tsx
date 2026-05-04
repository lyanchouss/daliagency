"use client";
import React, { useEffect, useRef } from "react";

interface Props {
  refresh?: number;
  alpha?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function NoiseLayer({
  refresh = 2,
  alpha = 38,
  className = "",
  style,
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;

    let f = 0;
    let id = 0;
    const S = 1024;

    c.width = S;
    c.height = S;

    const draw = () => {
      const img = ctx.createImageData(S, S);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = alpha;
      }
      ctx.putImageData(img, 0, 0);
    };

    const loop = () => {
      if (f % refresh === 0) draw();
      f++;
      id = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(id);
  }, [refresh, alpha]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      style={{ imageRendering: "pixelated", ...style }}
    />
  );
}
