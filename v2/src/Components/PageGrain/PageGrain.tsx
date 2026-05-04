"use client";
import React from "react";
import NoiseLayer from "./NoiseLayer";

interface Props {
  refresh?: number;
  alpha?: number;
  thickness?: number;
}

export default function PageGrain({
  refresh = 2,
  alpha = 50,
  thickness = 10,
}: Props) {
  const strip = "pointer-events-none fixed z-[31] mix-blend-multiply overflow-hidden";
  const t = `${thickness}px`;

  return (
    <>
      <div className={strip} style={{ top: 0, left: 0, right: 0, height: t }}>
        <NoiseLayer refresh={refresh} alpha={alpha} />
      </div>
      <div className={strip} style={{ bottom: 0, left: 0, right: 0, height: t }}>
        <NoiseLayer refresh={refresh} alpha={alpha} />
      </div>
      <div className={strip} style={{ top: 0, bottom: 0, left: 0, width: t }}>
        <NoiseLayer refresh={refresh} alpha={alpha} />
      </div>
      <div className={strip} style={{ top: 0, bottom: 0, right: 0, width: t }}>
        <NoiseLayer refresh={refresh} alpha={alpha} />
      </div>
    </>
  );
}
