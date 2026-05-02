import React from "react";
import Image from "next/image";
import Container from "@/Components/Container/Container";
import { condensedHeadings } from "@/assets/fonts";
import DavidImage from "@/assets/images/team/david.png";
import LianaImage from "@/assets/images/team/liana.jpeg";

const photoMaskStyle = {
  maskImage:
    "radial-gradient(ellipse at center, black 50%, transparent 95%)",
  WebkitMaskImage:
    "radial-gradient(ellipse at center, black 50%, transparent 95%)",
};

function Person({
  image,
  name,
  role,
}: {
  image: typeof DavidImage;
  name: string;
  role: string;
}) {
  return (
    <figcaption className="text-center">
      <Image
        src={image}
        alt={`${name}, ${role}`}
        className="mx-auto h-[130px] w-[130px] mb-12 object-cover object-top"
        width={130}
        height={130}
        style={photoMaskStyle}
      />
      <div className="mt-4 flex flex-col items-center gap-1">
        <div className="text-gray-900 uppercase text-base whitespace-nowrap">
          {name}
        </div>
        <div className="text-gray-600 uppercase font-light text-xs whitespace-nowrap">
          {role}
        </div>
      </div>
    </figcaption>
  );
}

export default function About() {
  return (
    <section id="about" className="relative isolate pt-8 pb-80 z-10">
      <Container wide>
        <h2
          className={`${condensedHeadings.className} text-primary text-h2 lg:text-[48px] uppercase font-light leading-none`}
        >
          About Us
        </h2>
        <div className="grid lg:grid-cols-12 gap-40 lg:gap-64 mt-64 items-center -translate-y-[2%]">
          <p className="lg:col-span-7 text-body3 lg:text-body2 leading-relaxed text-justify">
            <span
              className="text-[var(--primary,#dd1e3e)]"
              style={{ fontFamily: "'Adelia', cursive" }}
            >
              Dali
            </span>{" "}
            is an agency built with the closeness of a family and run with
            professional precision. Liana leads operations, David leads
            engineering, and at the core of our work are trust, structure,
            and close attention to quality.
          </p>
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-48">
            <Person image={DavidImage} name="David" role="Founder" />
            <Person image={LianaImage} name="Liana" role="Co-founder" />
          </div>
        </div>
      </Container>
    </section>
  );
}
