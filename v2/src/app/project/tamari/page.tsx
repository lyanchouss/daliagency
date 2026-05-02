import Container from "@/Components/Container/Container";
import HeroImage from "./assets/screenshot.jpg";
import "./page.styles.css";
import { condensedHeadings, monoText, serifText } from "@/assets/fonts";
import { Metadata } from "next";
import ProjectsSelect from "@/Components/ProjectsSelect/ProjectsSelect";
import FadeIn from "../Components/FadeIn";
import PhoneFrame from "@/Components/PhoneFrame/PhoneFrame";

export const metadata: Metadata = {
  title: "Saint King Tamari",
  description: "Daily companion of Christian saints' wisdom",
};

export default function TamariPage() {
  return (
    <FadeIn>
      <Container id="tamari-page" className="overflow-hidden">
        <section
          id="project-header"
          className={`${monoText.className} uppercase flex flex-col gap-36 py-80`}
        >
          <h1 className={`text-body1 md:text-[72px] leading-none`}>
            Daily wisdom of the saints, in your pocket.
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
            <div className="flex justify-center md:justify-start">
              <div className="w-full max-w-[260px]">
                <PhoneFrame
                  src={HeroImage}
                  alt="Saint King Tamari app"
                  placeholder="blur"
                  sizes="(max-width: 768px) 70vw, 260px"
                />
              </div>
            </div>
            <p className="text-body4 md:text-body1">
              Saint King Tamari is a mobile app for daily spiritual practice — each day surfaces a saint, along with their teachings and stories for reflection. The brand and product came together in our studio: reverent yet contemporary, designed to honor the depth of the tradition while feeling natural in everyday use.
            </p>
          </div>
        </section>

        <section className="py-80">
          <h2
            className={`${condensedHeadings.className} text-h3 md:text-[48px] uppercase mb-24`}
          >
            OTHER PROJECTS
          </h2>
          <ProjectsSelect excludeProjects={["tamari"]} />
        </section>
      </Container>
    </FadeIn>
  );
}

const projectData = {
  tags: ["mobile", "brand", "spiritual"],
  client: "LLC Tamari",
  year: "2025",
};
