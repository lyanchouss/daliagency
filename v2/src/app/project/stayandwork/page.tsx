import Container from "@/Components/Container/Container";
import Image from "next/image";
import HeroImage from "./assets/screenshot.png";
import "./page.styles.css";
import { condensedHeadings, monoText, serifText } from "@/assets/fonts";
import { Metadata } from "next";
import ProjectsSelect from "@/Components/ProjectsSelect/ProjectsSelect";
import FadeIn from "../Components/FadeIn";

export const metadata: Metadata = {
  title: "Stay & Work Georgia",
  description:
    "Helping international professionals settle and work legally in Georgia",
};

export default function StayAndWorkPage() {
  return (
    <FadeIn>
      <Container id="stayandwork-page" className="overflow-hidden">
        <section
          id="project-header"
          className={`${monoText.className} uppercase flex flex-col gap-36 py-80`}
        >
          <h1 className={`text-body1 md:text-[72px] leading-none`}>
            Helping internationals settle and work legally in Georgia.
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

        <section className={`${serifText.className} py-40 md:py-80`}>
          <h2
            className={`${condensedHeadings.className} text-h3 md:text-[48px] uppercase mb-24 md:mb-40`}
          >
            About the project
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-32 md:gap-48 items-start">
            <Image
              src={HeroImage}
              alt="Stay & Work Georgia website"
              className="w-full"
              placeholder="blur"
            />
            <p className="text-body4 md:text-body1">
              Stay & Work Georgia is a legal-tech service helping international professionals navigate residency, work permits, and tax registration. Our role was to build the brand from scratch — visual identity, website, and a product experience that turns complex bureaucracy into something approachable and trustworthy.
            </p>
          </div>
        </section>

        <section className="py-80">
          <h2
            className={`${condensedHeadings.className} text-h3 md:text-[48px] uppercase mb-24`}
          >
            OTHER PROJECTS
          </h2>
          <ProjectsSelect excludeProjects={["stayandwork"]} />
        </section>
      </Container>
    </FadeIn>
  );
}

const projectData = {
  tags: ["brand", "service", "legal-tech"],
  client: "Stay & Work Georgia",
  year: "2024",
};
