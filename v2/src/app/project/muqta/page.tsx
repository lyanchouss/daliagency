import Container from "@/Components/Container/Container";
import HeroImage from "./assets/screenshot.webp";
import Photo2 from "./assets/photo-2.webp";
import Photo3 from "./assets/photo-3.webp";
import Photo4 from "./assets/photo-4.webp";
import "./page.styles.css";
import { condensedHeadings, monoText, serifText } from "@/assets/fonts";
import { Metadata } from "next";
import ProjectsSelect from "@/Components/ProjectsSelect/ProjectsSelect";
import FadeIn from "../Components/FadeIn";
import PhoneFrame from "@/Components/PhoneFrame/PhoneFrame";

export const metadata: Metadata = {
  title: "Muqta",
  description: "Smart shopping companion for Georgian consumers",
};

export default function MuqtaPage() {
  return (
    <FadeIn>
      <Container id="muqta-page" className="overflow-hidden">
        <section
          id="project-header"
          className={`${monoText.className} uppercase flex flex-col gap-36 py-80`}
        >
          <h1 className={`text-body1 md:text-[72px] leading-none`}>
            {/* [TEXT] Headline */}
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
              style={{ transform: "rotate(90deg) translate(4px,-100%)" }}
            >
              {projectData.year}
            </span>{" "}
            <span>client &mdash; {projectData.client}</span>
          </p>
        </section>

        <section className="flex flex-col justify-center items-center py-40 md:py-80">
          <div className="w-full max-w-[280px] md:max-w-[340px]">
            <PhoneFrame
              src={HeroImage}
              alt="Muqta app"
              placeholder="blur"
              sizes="(max-width: 768px) 80vw, 340px"
            />
          </div>
        </section>

        <section className="py-40 md:py-80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-40 max-w-[1100px] mx-auto">
            <PhoneFrame src={Photo2} alt="Muqta app screen" placeholder="blur" />
            <PhoneFrame src={Photo3} alt="Muqta app screen" placeholder="blur" />
            <PhoneFrame src={Photo4} alt="Muqta app screen" placeholder="blur" />
          </div>
        </section>

        <section
          className={`${serifText.className} grid grid-cols-1 md:grid-cols-2 gap-32 py-40 md:py-80`}
        >
          <h2
            className={`${condensedHeadings.className} text-h3 md:text-[48px] uppercase`}
          >
            {/* [TEXT] About heading */}
          </h2>
          <p className="text-body4 md:text-body1">
            {/* [TEXT] Intro paragraph */}
          </p>
        </section>

        <section className="py-80">
          <h2
            className={`${condensedHeadings.className} text-h3 md:text-[48px] uppercase mb-24`}
          >
            OTHER PROJECTS
          </h2>
          <ProjectsSelect excludeProjects={["muqta"]} />
        </section>
      </Container>
    </FadeIn>
  );
}

const projectData = {
  tags: ["mobile", "e-commerce", "lifestyle"],
  client: "Muqta",
  year: "2025",
};
