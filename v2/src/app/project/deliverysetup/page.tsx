import Container from "@/Components/Container/Container";
import Image from "next/image";
import HeroImage from "./assets/screenshot.png";
import "./page.styles.css";
import { condensedHeadings, monoText, serifText } from "@/assets/fonts";
import { Metadata } from "next";
import ProjectsSelect from "@/Components/ProjectsSelect/ProjectsSelect";
import FadeIn from "../Components/FadeIn";

export const metadata: Metadata = {
  title: "Delivery Setup",
  description:
    "Comprehensive delivery setup and optimization for restaurants",
};

export default function DeliverySetupPage() {
  return (
    <FadeIn>
      <Container id="deliverysetup-page" className="overflow-hidden">
        <section
          id="project-header"
          className={`${monoText.className} uppercase flex flex-col gap-36 py-80`}
        >
          <h1 className={`text-body1 md:text-[72px] leading-none`}>
            End-to-end delivery operations for restaurants.
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
              alt="Delivery Setup website"
              className="w-full"
              placeholder="blur"
            />
            <p className="text-body4 md:text-body1">
              Behind every restaurant scaling its delivery is an operational backbone running couriers, packaging, and customer experience. That's Delivery Setup. Our work covered the brand identity, website, and the operational touchpoints food businesses use day to day — so they can grow without losing quality or control.
            </p>
          </div>
        </section>

        <section className="py-80">
          <h2
            className={`${condensedHeadings.className} text-h3 md:text-[48px] uppercase mb-24`}
          >
            OTHER PROJECTS
          </h2>
          <ProjectsSelect excludeProjects={["deliverysetup"]} />
        </section>
      </Container>
    </FadeIn>
  );
}

const projectData = {
  tags: ["brand", "foodtech", "service"],
  client: "Delivery Setup",
  year: "2024",
};
