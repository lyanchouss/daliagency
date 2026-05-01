import Container from "@/Components/Container/Container";
import React from "react";
import SetPageColor from "../Components/SetPageColor";
import Image from "next/image";
// import FirstPhotoImage from "./assets/first-photo.png";        // [PHOTO] intro photo (top-left)
// import CrossHairsImage from "./assets/cross-hairs.svg";        // decorative crosshairs overlay
// import AsterixLogo from "./assets/asterix-logo.svg";           // small accent logo (bottom-right of intro)
// import WebsiteImage from "./assets/website.png";               // [PHOTO] website screenshot
// import Logo from "./assets/logo-design.svg";                   // logo
// import LogoWireframe from "./assets/logo-design--wireframe.svg"; // logo wireframe
// import PhotoDump from "./assets/photo-dump.png";               // [PHOTO] photo dump / collage
// import PosterImage from "./assets/poster-image.png";           // [PHOTO] poster
// import Reel1 from "./assets/reel_1.gif";                       // [VIDEO/GIF] short reel 1
// import Reel2 from "./assets/reel_2.gif";                       // [VIDEO/GIF] short reel 2
// import Reel3 from "./assets/reel_3.gif";                       // [VIDEO/GIF] short reel 3
// import Reel4 from "./assets/reel_4.gif";                       // [VIDEO/GIF] short reel 4
// import AfterMovie from "./assets/video--aftermovie.gif";       // [VIDEO/GIF] aftermovie (landscape)
import "./page.styles.css";
import { condensedHeadings, monoText, serifText } from "@/assets/fonts";
import ColorsPalette from "../Components/ColorsPalette";
import { Metadata } from "next";
import ProjectsSelect from "@/Components/ProjectsSelect/ProjectsSelect";
import FadeIn from "../Components/FadeIn";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function ProjectPage() {
  return (
    <FadeIn>
      <Container id="hub21-page" className="overflow-hidden">
        {/* SECTION 1 — HEADER: title, tags, year & client */}
        <section
          id="project-header"
          className={`${monoText.className} uppercase flex flex-col gap-36 py-80`}
        >
          <h1 className={`text-body1 md:text-[72px] leading-none`}>
            {/* [TEXT] Project headline (1–2 lines) */}
          </h1>
          <ul className={`flex text-body5 md:text-h2 gap-36 font-light`}>
            {projectData.tags.map((tag, idx) => (
              <li key={idx}>
                <span className="mb-36">/</span> <span>{tag}</span>
              </li>
            ))}
          </ul>
          <p className="flex text-body5 md:text-body2 font-medium">
            <span
              className="origin-top-left"
              style={{
                transform: "rotate(90deg) translate(4px,-100%)",
              }}
            >
              {projectData.year}
            </span>{" "}
            <span>client &mdash; {projectData.client}</span>
          </p>
        </section>

        {/* SECTION 2 — INTRO: left photo + right paragraphs */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-x-100 gap-y-24 py-40 relative">
          <div>
            {/* [PHOTO] intro photo — replace src with imported image */}
            {/* <Image src={FirstPhotoImage} alt="" /> */}
            {/* <Image
              src={CrossHairsImage}
              alt=""
              className="absolute top-0 left-0 md:left-100 md:-translate-x-1/2 md:-translate-y-1/4 pointer-events-none"
            /> */}
          </div>
          <div className="col-span-2">
            <p
              className={`${serifText.className} text-body4 md:text-body1 pb-24`}
            >
              {/* [TEXT] Intro paragraph 1 */}
            </p>
            <p className={`${serifText.className} text-body4 md:text-body1`}>
              {/* [TEXT] Intro paragraph 2 */}
            </p>
            <div className="flex justify-end mt-24">
              {/* <Image src={AsterixLogo} alt="" /> */}
            </div>
          </div>
        </section>

        {/* SECTION 3 — FULL-BLEED PHOTO DUMP */}
        <section className="full-bleed max-w-[1440px] mx-auto flex flex-col justify-center items-center pb-80">
          <div className="w-[110%]">
            {/* [PHOTO] full-bleed photo dump / collage */}
            {/* <Image src={PhotoDump} alt="" className="translate-y-1/4" /> */}
          </div>
        </section>

        {/* SECTION 4 — COLOR PALETTE */}
        <section className="py-40 full-bleed">
          <div className="max-w-[1440px] mx-auto">
            <ColorsPalette
              colors={[
                {
                  backgroundInCYMK: [0, 0, 0, 0],
                  textInHex: "#000",
                  borderInHex: "#000",
                },
              ]}
            />
          </div>
        </section>

        {/* SECTION 5 — "HOW MIGHT WE" QUESTION + PARAGRAPH */}
        <section className="py-80">
          <div
            className={`${serifText.className} grid grid-cols-1 md:grid-cols-2 gap-32 mt-24 md:mt-48`}
          >
            <h2
              className={`${condensedHeadings.className} text-h3 md:text-[48px] uppercase`}
            >
              {/* [TEXT] "How might we…" question */}
            </h2>
            <p className="text-body4 md:text-body1">
              {/* [TEXT] Answer paragraph */}
            </p>
          </div>
        </section>

        {/* SECTION 6 — AFTERMOVIE (landscape video/gif) */}
        <section className="py-40 md:py-80">
          <div className="flex justify-center gap-[-60px]">
            <div className="border rounded-xl sm:rounded-2xl border-black overflow-hidden video-preview video-preview--landscape">
              {/* [VIDEO/GIF] aftermovie — landscape */}
              {/* <Image src={AfterMovie} alt="" className="min-w-0" /> */}
            </div>
          </div>
        </section>

        {/* SECTION 7 — REELS ROW (4 vertical short videos/gifs) */}
        <section className="py-40 md:py-80">
          <div className="flex justify-center gap-[-60px]">
            <div className="border rounded-xl sm:rounded-2xl border-black overflow-hidden transform rotate-[7deg] video-preview video-preview--reel">
              {/* [VIDEO/GIF] reel 1 */}
              {/* <Image src={Reel1} alt="" className="min-w-0" /> */}
            </div>
            <div className="border rounded-xl sm:rounded-2xl border-black overflow-hidden transform -rotate-[2.8deg] video-preview video-preview--reel">
              {/* [VIDEO/GIF] reel 2 */}
              {/* <Image src={Reel2} alt="" className="min-w-0" /> */}
            </div>
            <div className="border rounded-xl sm:rounded-2xl border-black overflow-hidden transform rotate-3 video-preview video-preview--reel">
              {/* [VIDEO/GIF] reel 3 */}
              {/* <Image src={Reel3} alt="" className="min-w-0" /> */}
            </div>
            <div className="border rounded-xl sm:rounded-2xl border-black overflow-hidden transform -rotate-6 video-preview video-preview--reel">
              {/* [VIDEO/GIF] reel 4 */}
              {/* <Image src={Reel4} alt="" className="min-w-0" /> */}
            </div>
          </div>
        </section>

        {/* SECTION 8 — PHOTO DUMP + POSTER */}
        <section className="full-bleed max-w-[1440px] mx-auto flex flex-col justify-center items-center">
          <div className="w-[110%]">
            {/* [PHOTO] photo dump / collage */}
            {/* <Image src={PhotoDump} alt="" className="translate-y-1/4" /> */}
            {/* [PHOTO] poster */}
            {/* <Image src={PosterImage} alt="" className="relative" /> */}
          </div>
        </section>

        {/* SECTION 9 — LOGO + WIREFRAMES (3 across) */}
        <section className="py-40 md:py-80">
          <div className="flex justify-center">
            <div className="w-[120%] shrink-0 flex gap-24 ">
              {/* [IMAGE] logo wireframe (left) */}
              {/* <Image src={LogoWireframe} alt="" className="min-w-0" /> */}
              {/* [IMAGE] logo (center) */}
              {/* <Image src={Logo} alt="" className="min-w-0" /> */}
              {/* [IMAGE] logo wireframe (right) */}
              {/* <Image src={LogoWireframe} alt="" className="min-w-0" /> */}
            </div>
          </div>
        </section>

        {/* SECTION 10 — WEBSITE SCREENSHOT */}
        <section className="md:py-80 flex flex-col justify-center items-center">
          {/* [PHOTO] website screenshot */}
          {/* <Image src={WebsiteImage} alt="" className="w-full max-w-[1440px]" /> */}
        </section>

        {/* SECTION 11 — TEXT BLOCKS (heading + 2-col text rows) */}
        <section className="py-80">
          <h2
            className={`${condensedHeadings.className} text-6xl sm:text-8xl font-extralight uppercase pb-40`}
          >
            {/* [TEXT] Section heading */}
          </h2>
          <div
            className={`${serifText.className} grid grid-cols-1 md:grid-cols-2 gap-32 mt-24 md:mt-48`}
          >
            <h3 className="font-light italic text-body4 md:text-h1 leading-[1]">
              {/* [TEXT] Subheading */}
            </h3>
            <p className="text-body4 md:text-body1">
              {/* [TEXT] Paragraph */}
            </p>
          </div>
        </section>

        {/* SECTION 12 — OTHER PROJECTS */}
        <section className="py-80">
          <h2
            className={`${condensedHeadings.className} text-h3 md:text-[48px] uppercase mb-24`}
          >
            OTHER PROJECTS
          </h2>
          <ProjectsSelect excludeProjects={["hub21"]} />
        </section>
      </Container>
    </FadeIn>
  );
}

const projectData = {
  tags: [], // [TEXT] e.g. ["brand", "space", "strategy"]
  client: "", // [TEXT] client name
  year: "", // [TEXT] e.g. "2023"
};
