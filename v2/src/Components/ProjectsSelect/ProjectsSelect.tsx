"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "./projects";
import { serifText } from "@/assets/fonts";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import Portal from "../Portal/Portal";
import { LayoutGroup, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import PhoneFrame from "../PhoneFrame/PhoneFrame";

interface Props {
  excludeProjects?: string[];
}

type ColorOverride = { backgroundColor?: string; frameColor?: string };

function ColorsPanel({
  overrides,
  setOverride,
  resetAll,
}: {
  overrides: Record<string, ColorOverride>;
  setOverride: (slug: string, key: keyof ColorOverride, value: string) => void;
  resetAll: () => void;
}) {
  const exportCode = () => {
    const lines = projects
      .map((p) => {
        const o = overrides[p.slug] ?? {};
        const bg = o.backgroundColor ?? p.backgroundColor;
        const frame = o.frameColor ?? p.frameColor;
        return `  // ${p.title}\n  { slug: "${p.slug}", backgroundColor: "${bg}", frameColor: "${frame}" },`;
      })
      .join("\n");
    navigator.clipboard.writeText(`[\n${lines}\n]`);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 99999,
        background: "rgba(0,0,0,0.92)",
        color: "#fff",
        padding: 16,
        borderRadius: 12,
        fontSize: 12,
        fontFamily: "monospace",
        width: 320,
        maxHeight: "92vh",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <strong style={{ fontSize: 13 }}>Project Colors</strong>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={resetAll}
            style={{
              background: "#444",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            Reset
          </button>
          <button
            onClick={exportCode}
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
            Copy
          </button>
        </div>
      </div>
      <div style={{ fontSize: 10, color: "#888", marginBottom: 10 }}>
        Ctrl+P to toggle. Copy then paste values into projects.ts.
      </div>
      {projects.map((p) => {
        const o = overrides[p.slug] ?? {};
        const bg = o.backgroundColor ?? p.backgroundColor;
        const frame = o.frameColor ?? p.frameColor;
        return (
          <div
            key={p.slug}
            style={{
              marginBottom: 10,
              padding: 8,
              border: `1px solid ${frame}`,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <strong style={{ fontSize: 11 }}>{p.title}</strong>
              <span style={{ color: "#888", fontSize: 10 }}>{p.slug}</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
              <label style={{ width: 70, fontSize: 10 }}>Background</label>
              <input
                type="color"
                value={bg}
                onChange={(e) => setOverride(p.slug, "backgroundColor", e.target.value)}
                style={{ width: 36, height: 24, border: "none", background: "transparent", cursor: "pointer" }}
              />
              <input
                type="text"
                value={bg}
                onChange={(e) => setOverride(p.slug, "backgroundColor", e.target.value)}
                style={{
                  flex: 1,
                  background: "#111",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: 4,
                  padding: "2px 6px",
                  fontFamily: "monospace",
                  fontSize: 11,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ width: 70, fontSize: 10 }}>Frame</label>
              <input
                type="color"
                value={frame}
                onChange={(e) => setOverride(p.slug, "frameColor", e.target.value)}
                style={{ width: 36, height: 24, border: "none", background: "transparent", cursor: "pointer" }}
              />
              <input
                type="text"
                value={frame}
                onChange={(e) => setOverride(p.slug, "frameColor", e.target.value)}
                style={{
                  flex: 1,
                  background: "#111",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: 4,
                  padding: "2px 6px",
                  fontFamily: "monospace",
                  fontSize: 11,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ProjectsSelect({ excludeProjects }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const router = useRouter();
  const projectsContainerRef = useRef<HTMLUListElement>(null);
  const isOnScreen = useOnScreen(projectsContainerRef);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  const [openProject, setOpenProject] = useState<
    (typeof projects)[number] | null
  >(null);

  const [colorOverrides, setColorOverrides] = useState<Record<string, ColorOverride>>(
    {}
  );
  const [showColorsPanel, setShowColorsPanel] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setShowColorsPanel((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const setOverride = useCallback(
    (slug: string, key: keyof ColorOverride, value: string) => {
      setColorOverrides((o) => ({
        ...o,
        [slug]: { ...o[slug], [key]: value },
      }));
    },
    []
  );

  const resetOverrides = useCallback(() => setColorOverrides({}), []);

  const resolveColors = (project: (typeof projects)[number]) => {
    const o = colorOverrides[project.slug] ?? {};
    return {
      backgroundColor: o.backgroundColor ?? project.backgroundColor,
      frameColor: o.frameColor ?? project.frameColor,
    };
  };

  const options = projects.filter(
    (project) => !excludeProjects?.includes(project.slug)
  );

  const onSelectProject = (idx: number) => {
    const project = options[idx];

    if (project.externalLink) {
      window.open(project.externalLink, "_blank");
      return;
    }

    setOpenProject(project);
    router.prefetch(`/project/${project.slug}`);
    setTimeout(() => {
      router.push(`/project/${project.slug}`);
    }, 400);
  };
  return (
    <LayoutGroup>
      {showColorsPanel && (
        <ColorsPanel
          overrides={colorOverrides}
          setOverride={setOverride}
          resetAll={resetOverrides}
        />
      )}
      <div className="hidden md:flex justify-end gap-12 mb-24">
        <button
          type="button"
          aria-label="Previous projects"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="w-48 h-48 flex items-center justify-center border-2 border-current rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white hover:border-black"
        >
          <FiChevronLeft className="w-20 h-20" />
        </button>
        <button
          type="button"
          aria-label="Next projects"
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="w-48 h-48 flex items-center justify-center border-2 border-current rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white hover:border-black"
        >
          <FiChevronRight className="w-20 h-20" />
        </button>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <ul className="flex gap-24" ref={projectsContainerRef}>
          {options.map((option, idx) => {
            const resolved = resolveColors(option);
            return (
            <motion.li
              layout
              layoutId={`project-${option.slug}`}
              transition={{
                layout: {
                  duration: 0,
                },
              }}
              key={idx}
              className="shrink-0 grow-0 basis-[80%] md:basis-[min(40%,500px)] 2xl:basis-[min(40%,600px)]"
            >
              <button
                className={`p-24 w-full flex flex-col items-stretch uppercase border-2 max-w-[600px] h-full text-left`}
                style={{
                  backgroundColor: resolved.backgroundColor,
                  borderColor: resolved.frameColor,
                }}
                onClick={() => onSelectProject(idx)}
              >
                <div className="flex flex-wrap md:flex-nowrap justify-between gap-x-36 gap-y-16 font-medium">
                  <div>
                    <p className="md:text-body1">{option.tagline} </p>
                    <p className={`${serifText.className} text-body5`}>
                      {option.title}
                    </p>
                  </div>
                  <div>
                    {option.tags.map((tag) => (
                      <p key={tag} className="whitespace-nowrap">
                        / {tag}
                      </p>
                    ))}
                  </div>
                </div>
                {option.orientation === "portrait" ? (
                  <div className="mt-auto mx-auto w-full max-w-[45%] my-42">
                    <PhoneFrame
                      src={option.image}
                      alt={option.title}
                      placeholder="blur"
                      priority={isOnScreen}
                    />
                  </div>
                ) : (
                  <div className="mt-auto mx-auto w-full max-w-[92%] my-42">
                    <div
                      className="relative w-full overflow-hidden rounded-md border shadow-2xl bg-black/5 aspect-[16/10]"
                      style={{ borderColor: resolved.frameColor }}
                    >
                      <Image
                        src={option.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 80vw, 500px"
                        className="object-cover object-top"
                        placeholder="blur"
                        priority={isOnScreen}
                      />
                    </div>
                  </div>
                )}
              </button>
            </motion.li>
            );
          })}
        </ul>
      </div>
      <Portal id="frame-overlay">
        {openProject && (
          <motion.div
            className="fixed inset-0 border-[10px] z-50"
            layout
            layoutId={`project-${openProject.slug}`}
            style={{
              backgroundColor: resolveColors(openProject).backgroundColor,
              borderColor: resolveColors(openProject).frameColor,
            }}
          ></motion.div>
        )}
      </Portal>
    </LayoutGroup>
  );
}

function useOnScreen(
  ref: React.MutableRefObject<Element | null>,
  rootMargin = "0px"
) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const elementToObserve = ref?.current;

    if (!elementToObserve) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(elementToObserve);

    return () => {
      if (!elementToObserve) return;

      observer.unobserve(elementToObserve);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootMargin]);
  return isVisible;
}
