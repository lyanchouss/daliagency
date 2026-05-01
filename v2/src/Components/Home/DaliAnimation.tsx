"use client";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { parse as parseFont, type Font } from "opentype.js";

const LETTERS = ["D", "a", "l", "i"];

const DEFAULTS = {
  FONT_SIZE: 130,
  BASELINE_Y: 280,
  START_X: 20,
  SPACING_0: -4,
  SPACING_1: -20,
  SPACING_2: -4,
  PEN_WIDTH: 28,
  ANIM_DURATION: 3,
  ANIM_DELAY: 0.3,
  STROKE_PORTION: 100,
  LETTER_OVERLAP: 30,
  EASE_0: 0.32,
  EASE_1: 0.04,
  EASE_2: 0.4,
  EASE_3: 1,
};

type Params = typeof DEFAULTS;
type Bbox = { x1: number; y1: number; x2: number; y2: number };
type Glyph = { ch: string; pathData: string; advanceWidth: number; bbox: Bbox };
type Layout = { glyphs: Array<Glyph & { x: number }> };

const LAYOUT_KEYS: Array<keyof Params> = [
  "FONT_SIZE",
  "BASELINE_Y",
  "START_X",
  "SPACING_0",
  "SPACING_1",
  "SPACING_2",
];
const ANIM_KEYS: Array<keyof Params> = [
  "ANIM_DURATION",
  "ANIM_DELAY",
  "PEN_WIDTH",
  "STROKE_PORTION",
  "LETTER_OVERLAP",
  "EASE_0",
  "EASE_1",
  "EASE_2",
  "EASE_3",
];

const CONTROL_META: Record<keyof Params, { label: string; min: number; max: number; step: number }> = {
  FONT_SIZE: { label: "Font Size", min: 40, max: 300, step: 1 },
  BASELINE_Y: { label: "Baseline Y", min: 50, max: 400, step: 1 },
  START_X: { label: "Start X", min: -50, max: 200, step: 1 },
  SPACING_0: { label: "Space D→a", min: -200, max: 60, step: 1 },
  SPACING_1: { label: "Space a→l", min: -200, max: 60, step: 1 },
  SPACING_2: { label: "Space l→i", min: -200, max: 60, step: 1 },
  PEN_WIDTH: { label: "Pen width", min: 4, max: 200, step: 1 },
  ANIM_DURATION: { label: "Total duration (s)", min: 0.5, max: 10, step: 0.05 },
  ANIM_DELAY: { label: "Start delay (s)", min: 0, max: 5, step: 0.05 },
  STROKE_PORTION: { label: "Stroke % of slot", min: 30, max: 100, step: 1 },
  LETTER_OVERLAP: { label: "Next starts at % done", min: 0, max: 95, step: 1 },
  EASE_0: { label: "Ease p1 (in-x)", min: 0, max: 1, step: 0.01 },
  EASE_1: { label: "Ease p2 (in-y)", min: -1, max: 2, step: 0.01 },
  EASE_2: { label: "Ease p3 (out-x)", min: 0, max: 1, step: 0.01 },
  EASE_3: { label: "Ease p4 (out-y)", min: -1, max: 2, step: 0.01 },
};

const EASE_PRESETS: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  pen: [0.32, 0.04, 0.4, 1],
  smooth: [0.45, 0.05, 0.55, 0.95],
  snap: [0.7, 0, 0.3, 1],
};

function getSlot(i: number, n: number, strokePct: number, overlapPct: number) {
  const overlap = Math.min(0.95, overlapPct / 100);
  const letterDuration = 1 / (n - (n - 1) * overlap);
  const start = i * letterDuration * (1 - overlap);
  const slotEnd = start + letterDuration;
  const strokeEnd = start + letterDuration * (strokePct / 100);
  return { strokeStart: start, strokeEnd: Math.min(slotEnd, strokeEnd) };
}

let cachedFont: Font | null = null;
let cachedFontPromise: Promise<Font> | null = null;
function loadAdelia(): Promise<Font> {
  if (cachedFont) return Promise.resolve(cachedFont);
  if (cachedFontPromise) return cachedFontPromise;
  cachedFontPromise = fetch("/fonts/adelia.ttf")
    .then((res) => {
      if (!res.ok) throw new Error(`Adelia fetch failed: ${res.status}`);
      return res.arrayBuffer();
    })
    .then((buf) => {
      const font = parseFont(buf);
      cachedFont = font;
      return font;
    })
    .catch((err) => {
      cachedFontPromise = null;
      throw err;
    });
  return cachedFontPromise;
}

function DebugPanel({
  params,
  onChange,
  onReplay,
  scrubbing,
  scrubProgress,
  setScrubbing,
  setScrubProgress,
  isPlaying,
  togglePlay,
  applyPreset,
}: {
  params: Params;
  onChange: (key: keyof Params, val: number) => void;
  onReplay: () => void;
  scrubbing: boolean;
  scrubProgress: number;
  setScrubbing: (v: boolean) => void;
  setScrubProgress: (v: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  applyPreset: (preset: keyof typeof EASE_PRESETS) => void;
}) {
  const exportCode = () => {
    const lines = Object.entries(params)
      .map(([k, v]) => `  ${k}: ${v},`)
      .join("\n");
    navigator.clipboard.writeText(`{\n${lines}\n}`);
  };

  const renderRow = (k: keyof Params) => {
    const { label, min, max, step } = CONTROL_META[k];
    return (
      <div key={k} style={{ marginBottom: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{label}</span>
          <span style={{ color: "#aaa" }}>{params[k]}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={params[k]}
          onChange={(e) => onChange(k, parseFloat(e.target.value))}
          style={{ width: "100%", accentColor: "#dd1e3e" }}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        zIndex: 99999,
        background: "rgba(0,0,0,0.92)",
        color: "#fff",
        padding: 16,
        borderRadius: 12,
        fontSize: 12,
        fontFamily: "monospace",
        width: 300,
        maxHeight: "92vh",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <strong style={{ fontSize: 13 }}>Dali Debug</strong>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={togglePlay}
            style={{
              background: isPlaying ? "#444" : "#2a8f3e",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={onReplay}
            style={{
              background: "#dd1e3e",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            Replay
          </button>
          <button
            onClick={exportCode}
            style={{
              background: "#555",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            Copy
          </button>
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <strong>Timeline</strong>
          <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={scrubbing}
              onChange={(e) => setScrubbing(e.target.checked)}
              style={{ accentColor: "#dd1e3e" }}
            />
            <span style={{ fontSize: 10 }}>Scrub</span>
          </label>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={scrubProgress}
          onChange={(e) => {
            setScrubbing(true);
            setScrubProgress(parseFloat(e.target.value));
          }}
          style={{ width: "100%", accentColor: "#dd1e3e" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", color: "#aaa", fontSize: 10 }}>
          <span>0%</span>
          <span>{Math.round(scrubProgress * 100)}%</span>
          <span>100%</span>
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong style={{ display: "block", marginBottom: 4 }}>Easing presets</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {Object.keys(EASE_PRESETS).map((p) => (
            <button
              key={p}
              onClick={() => applyPreset(p as keyof typeof EASE_PRESETS)}
              style={{
                background: "#222",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: 4,
                padding: "2px 6px",
                cursor: "pointer",
                fontSize: 10,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <details open>
        <summary style={{ cursor: "pointer", marginBottom: 6 }}>
          <strong>Animation</strong>
        </summary>
        {ANIM_KEYS.map(renderRow)}
      </details>

      <details>
        <summary style={{ cursor: "pointer", margin: "8px 0 6px" }}>
          <strong>Layout</strong>
        </summary>
        {LAYOUT_KEYS.map(renderRow)}
      </details>
    </div>
  );
}

export default function DaliAnimation() {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [params, setParams] = useState<Params>(DEFAULTS);
  const [animKey, setAnimKey] = useState(0);
  const [showDebug, setShowDebug] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubProgress, setScrubProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const progressMV = useMotionValue(0);

  const spacings = [params.SPACING_0, params.SPACING_1, params.SPACING_2];

  useEffect(() => {
    let cancelled = false;
    loadAdelia()
      .then((font) => {
        if (cancelled) return;
        let cursor = params.START_X;
        const glyphs: Layout["glyphs"] = [];
        LETTERS.forEach((ch, i) => {
          const path = font.getPath(ch, cursor, params.BASELINE_Y, params.FONT_SIZE);
          const pathData = path.toPathData(2);
          const bbox = path.getBoundingBox();
          glyphs.push({
            ch,
            pathData,
            x: cursor,
            advanceWidth: bbox.x2 - bbox.x1,
            bbox: { x1: bbox.x1, y1: bbox.y1, x2: bbox.x2, y2: bbox.y2 },
          });
          cursor = bbox.x2 + (spacings[i] ?? 0);
        });
        setLayout({ glyphs });
      })
      .catch((err) => console.error("[Dali] font load failed:", err));
    return () => {
      cancelled = true;
    };
  }, [
    params.FONT_SIZE,
    params.BASELINE_Y,
    params.START_X,
    spacings[0],
    spacings[1],
    spacings[2],
  ]);

  useEffect(() => {
    if (!layout || scrubbing || !isPlaying) return;
    progressMV.set(0);
    const controls = animate(progressMV, 1, {
      duration: params.ANIM_DURATION,
      ease: [params.EASE_0, params.EASE_1, params.EASE_2, params.EASE_3],
      delay: params.ANIM_DELAY,
    });
    return () => controls.stop();
  }, [
    layout,
    scrubbing,
    isPlaying,
    animKey,
    params.ANIM_DURATION,
    params.ANIM_DELAY,
    params.EASE_0,
    params.EASE_1,
    params.EASE_2,
    params.EASE_3,
    progressMV,
  ]);

  useEffect(() => {
    if (!scrubbing) return;
    progressMV.set(scrubProgress);
  }, [scrubbing, scrubProgress, progressMV]);

  useEffect(() => {
    if (!layout) return;
    const unsub = progressMV.on("change", (v) => {
      if (scrubbing) return;
      setScrubProgress(v);
    });
    return () => unsub();
  }, [layout, scrubbing, progressMV]);

  const slot0 = getSlot(0, 4, params.STROKE_PORTION, params.LETTER_OVERLAP);
  const slot1 = getSlot(1, 4, params.STROKE_PORTION, params.LETTER_OVERLAP);
  const slot2 = getSlot(2, 4, params.STROKE_PORTION, params.LETTER_OVERLAP);
  const slot3 = getSlot(3, 4, params.STROKE_PORTION, params.LETTER_OVERLAP);

  const len0 = useTransform(progressMV, [slot0.strokeStart, slot0.strokeEnd], [0, 1], { clamp: true });
  const len1 = useTransform(progressMV, [slot1.strokeStart, slot1.strokeEnd], [0, 1], { clamp: true });
  const len2 = useTransform(progressMV, [slot2.strokeStart, slot2.strokeEnd], [0, 1], { clamp: true });
  const len3 = useTransform(progressMV, [slot3.strokeStart, slot3.strokeEnd], [0, 1], { clamp: true });

  const lenArr = [len0, len1, len2, len3];

  const handleParamChange = (k: keyof Params, v: number) => setParams((p) => ({ ...p, [k]: v }));

  const handleReplay = () => {
    setScrubbing(false);
    setScrubProgress(0);
    setIsPlaying(true);
    progressMV.set(0);
    setAnimKey((k) => k + 1);
  };

  const togglePlay = () => {
    if (scrubbing) {
      setScrubbing(false);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((p) => !p);
  };

  const applyPreset = (preset: keyof typeof EASE_PRESETS) => {
    const [a, b, c, d] = EASE_PRESETS[preset];
    setParams((p) => ({ ...p, EASE_0: a, EASE_1: b, EASE_2: c, EASE_3: d }));
    handleReplay();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        setShowDebug((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {showDebug && (
        <DebugPanel
          params={params}
          onChange={handleParamChange}
          onReplay={handleReplay}
          scrubbing={scrubbing}
          scrubProgress={scrubProgress}
          setScrubbing={setScrubbing}
          setScrubProgress={setScrubProgress}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          applyPreset={applyPreset}
        />
      )}
      <svg
        viewBox="0 0 720 400"
        xmlns="http://www.w3.org/2000/svg"
        className="lottie-hero w-full max-w-[680px] h-auto"
        preserveAspectRatio="xMinYMid meet"
        aria-label="Dali"
      >
        <defs>
          {layout?.glyphs.map(({ bbox }, i) => {
            const pad = 8;
            const fullW = bbox.x2 - bbox.x1 + pad * 2;
            return (
              <mask key={`mask-${i}`} id={`dali-pen-${i}`}>
                <motion.rect
                  x={bbox.x1 - pad}
                  y={bbox.y1 - pad}
                  height={bbox.y2 - bbox.y1 + pad * 2}
                  fill="white"
                  style={{ scaleX: lenArr[i] }}
                  width={fullW}
                  transform-origin={`${bbox.x1 - pad}px ${bbox.y1}px`}
                />
              </mask>
            );
          })}
        </defs>

        {layout?.glyphs.map(({ pathData }, i) => (
          <path
            key={`a-${i}`}
            d={pathData}
            fill="var(--primary, #dd1e3e)"
            mask={`url(#dali-pen-${i})`}
          />
        ))}
      </svg>
    </>
  );
}
