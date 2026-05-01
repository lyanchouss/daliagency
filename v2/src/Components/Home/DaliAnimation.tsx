"use client";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

const LETTERS = ["D", "a", "l", "i"];

const DEFAULTS = {
  FONT_SIZE: 130,
  BASELINE_Y: 280,
  START_X: 20,
  SPACING_0: -4,
  SPACING_1: -20,
  SPACING_2: -4,
  PEN_WIDTH: 36,
  ANIM_DURATION: 3,
  ANIM_DELAY: 0.3,
  STROKE_PORTION: 100,
  LETTER_OVERLAP: 0,
  EASE_0: 0.32,
  EASE_1: 0.04,
  EASE_2: 0.4,
  EASE_3: 1,
};

type Params = typeof DEFAULTS;
type Glyph = { ch: string; x: number; dash: number };
type Layout = { glyphs: Glyph[] };

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
  SPACING_0: { label: "Space D→a", min: -60, max: 60, step: 1 },
  SPACING_1: { label: "Space a→l", min: -60, max: 60, step: 1 },
  SPACING_2: { label: "Space l→i", min: -60, max: 60, step: 1 },
  PEN_WIDTH: { label: "Pen width (mask)", min: 4, max: 80, step: 1 },
  ANIM_DURATION: { label: "Total duration (s)", min: 0.5, max: 10, step: 0.05 },
  ANIM_DELAY: { label: "Start delay (s)", min: 0, max: 5, step: 0.05 },
  STROKE_PORTION: { label: "Stroke % of slot", min: 30, max: 100, step: 1 },
  LETTER_OVERLAP: { label: "Letter overlap %", min: 0, max: 50, step: 1 },
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
  const slot = 1 / n;
  const overlap = (overlapPct / 100) * slot;
  const start = Math.max(0, i * slot - overlap * i);
  const slotEnd = start + slot;
  const strokeEnd = start + slot * (strokePct / 100);
  return {
    strokeStart: start,
    strokeEnd: Math.min(slotEnd, strokeEnd),
  };
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
  const measureRefs = useRef<Array<SVGTextElement | null>>([]);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [params, setParams] = useState<Params>(DEFAULTS);
  const [animKey, setAnimKey] = useState(0);
  const [showDebug, setShowDebug] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubProgress, setScrubProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const progressMV = useMotionValue(0);

  const spacings = [params.SPACING_0, params.SPACING_1, params.SPACING_2];

  const measure = useCallback(() => {
    let cursor = params.START_X;
    const glyphs: Glyph[] = [];
    LETTERS.forEach((ch, i) => {
      const el = measureRefs.current[i];
      if (!el) return;
      const bbox = el.getBBox();
      const x = cursor - bbox.x;
      const dash = Math.ceil((bbox.width + bbox.height) * 3) || 600;
      glyphs.push({ ch, x, dash });
      cursor += bbox.width + (spacings[i] ?? 0);
    });
    setLayout({ glyphs });
  }, [params.START_X, spacings[0], spacings[1], spacings[2]]);

  useEffect(() => {
    let cancelled = false;
    const doMeasure = () => {
      if (!cancelled) measure();
    };
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts && fonts.load) {
      fonts.load(`${params.FONT_SIZE}px Adelia`).then(() => fonts.ready).then(doMeasure).catch(doMeasure);
    } else {
      doMeasure();
    }
    return () => {
      cancelled = true;
    };
  }, [params.FONT_SIZE, measure]);

  useEffect(() => {
    measure();
  }, [measure]);

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

  const dashes: number[] = [
    layout?.glyphs[0]?.dash ?? 600,
    layout?.glyphs[1]?.dash ?? 600,
    layout?.glyphs[2]?.dash ?? 600,
    layout?.glyphs[3]?.dash ?? 600,
  ];

  const slot0 = getSlot(0, 4, params.STROKE_PORTION, params.LETTER_OVERLAP);
  const slot1 = getSlot(1, 4, params.STROKE_PORTION, params.LETTER_OVERLAP);
  const slot2 = getSlot(2, 4, params.STROKE_PORTION, params.LETTER_OVERLAP);
  const slot3 = getSlot(3, 4, params.STROKE_PORTION, params.LETTER_OVERLAP);

  const stroke0 = useTransform(progressMV, [slot0.strokeStart, slot0.strokeEnd], [dashes[0], 0], { clamp: true });
  const stroke1 = useTransform(progressMV, [slot1.strokeStart, slot1.strokeEnd], [dashes[1], 0], { clamp: true });
  const stroke2 = useTransform(progressMV, [slot2.strokeStart, slot2.strokeEnd], [dashes[2], 0], { clamp: true });
  const stroke3 = useTransform(progressMV, [slot3.strokeStart, slot3.strokeEnd], [dashes[3], 0], { clamp: true });

  const strokeArr = [stroke0, stroke1, stroke2, stroke3];

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
          <style>{`
            .dali-ink {
              font-family: 'Adelia', 'Brush Script MT', cursive;
              font-weight: 400;
              font-size: ${params.FONT_SIZE}px;
            }
          `}</style>
        </defs>

        <g aria-hidden="true" opacity={0}>
          {LETTERS.map((ch, i) => (
            <text
              key={`m-${i}`}
              ref={(el) => {
                measureRefs.current[i] = el;
              }}
              x={0}
              y={params.BASELINE_Y}
              className="dali-ink"
            >
              {ch}
            </text>
          ))}
        </g>

        <defs>
          {layout?.glyphs.map(({ ch, x, dash }, i) => (
            <mask key={`mask-${i}`} id={`dali-pen-${i}`}>
              <motion.text
                x={x}
                y={params.BASELINE_Y}
                className="dali-ink"
                fill="none"
                stroke="white"
                strokeWidth={params.PEN_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={dash}
                strokeDashoffset={strokeArr[i]}
              >
                {ch}
              </motion.text>
            </mask>
          ))}
        </defs>

        {layout?.glyphs.map(({ ch, x }, i) => (
          <text
            key={`a-${i}`}
            x={x}
            y={params.BASELINE_Y}
            className="dali-ink"
            fill="var(--primary, #dd1e3e)"
            mask={`url(#dali-pen-${i})`}
          >
            {ch}
          </text>
        ))}
      </svg>
    </>
  );
}
