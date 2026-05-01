import Container from "@/Components/Container/Container";
import Image from "next/image";
import HeroImage from "./assets/screenshot.png";
import "./page.styles.css";
import { condensedHeadings, monoText, serifText } from "@/assets/fonts";
import { Metadata } from "next";
import ProjectsSelect from "@/Components/ProjectsSelect/ProjectsSelect";
import FadeIn from "../Components/FadeIn";

export const metadata: Metadata = {
  title: "Masuro",
  description: "Localization & video production studio for global brands",
};

export default function MasuroPage() {
  return (
    <FadeIn>
      <Container id="masuro-page" className="overflow-hidden">
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

        <section className="full-bleed max-w-[1440px] mx-auto flex flex-col justify-center items-center py-40 md:py-80">
          <Image
            src={HeroImage}
            alt="Masuro website"
            className="w-full max-w-[1440px]"
            placeholder="blur"
          />
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
          <ProjectsSelect excludeProjects={["masuro"]} />
        </section>
      </Container>
    </FadeIn>
  );
}

const projectData = {
  tags: ["brand", "studio", "localization"],
  client: "Masuro",
  year: "2024",
};
