"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.css";

const STORAGE_KEY = "peakshift-colors";

const COLOR_VARS = [
  { variable: "--primary", label: "Primary", default: "#dd1e3e" },
  { variable: "--page-bg-color", label: "Page BG", default: "#ffffff" },
  { variable: "--page-text-color", label: "Text", default: "#000000" },
  { variable: "--frame-color", label: "Frame", default: "#dd1e3e" },
  { variable: "--footer-bg-color", label: "Footer BG", default: "#dd1e3e" },
  { variable: "--footer-text-color", label: "Footer Text", default: "#ffffff" },
];

export default function ColorPicker() {
  const [open, setOpen] = useState(false);
  const [colors, setColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Record<string, string>;
      setColors(parsed);
      for (const [key, value] of Object.entries(parsed)) {
        document.documentElement.style.setProperty(key, value);
      }
    }
  }, []);

  const handleChange = (variable: string, value: string) => {
    const next = { ...colors, [variable]: value };
    setColors(next);
    document.documentElement.style.setProperty(variable, value);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleReset = () => {
    for (const v of COLOR_VARS) {
      document.documentElement.style.removeProperty(v.variable);
    }
    setColors({});
    localStorage.removeItem(STORAGE_KEY);
  };

  const ACCENT_VARS = ["--primary", "--frame-color", "--footer-bg-color"];

  const handleAllChange = (value: string) => {
    const next = { ...colors };
    for (const v of ACCENT_VARS) {
      next[v] = value;
      document.documentElement.style.setProperty(v, value);
    }
    setColors(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const allValue = colors["--primary"] || "#dd1e3e";

  const getValue = (v: (typeof COLOR_VARS)[number]) => colors[v.variable] || v.default;

  return (
    <>
      <button
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-label="Color picker"
      >
        🎨
      </button>
      {open && (
        <div className={styles.panel}>
          <h3>Colors</h3>
          <div className={`${styles.row} ${styles.allRow}`}>
            <label>All accent</label>
            <input
              type="color"
              value={allValue}
              onChange={(e) => handleAllChange(e.target.value)}
            />
          </div>
          <div className={styles.divider} />
          {COLOR_VARS.map((v) => (
            <div key={v.variable} className={styles.row}>
              <label>{v.label}</label>
              <input
                type="color"
                value={getValue(v)}
                onChange={(e) => handleChange(v.variable, e.target.value)}
              />
            </div>
          ))}
          <button className={styles.reset} onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </>
  );
}
