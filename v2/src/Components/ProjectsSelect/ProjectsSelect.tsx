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
          {options.map((option, idx) => (
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
                  ...(option.backgroundColor && {
                    backgroundColor: option.backgroundColor,
                  }),
                  borderColor: option.frameColor,
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
                      style={{ borderColor: option.frameColor }}
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
          ))}
        </ul>
      </div>
      <Portal id="frame-overlay">
        {openProject && (
          <motion.div
            className="fixed inset-0 border-[10px] z-50"
            layout
            layoutId={`project-${openProject.slug}`}
            style={{
              backgroundColor: openProject.backgroundColor,
              borderColor: openProject.frameColor,
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
