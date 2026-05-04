import React from "react";
import Image, { StaticImageData } from "next/image";
import DavidImage from "@/assets/images/team/david.png";
import LianaImage from "@/assets/images/team/liana.jpeg";

function Avatar({
  initial,
  image,
  label,
}: {
  initial?: string;
  image?: StaticImageData;
  label: string;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={label}
        className="mx-auto h-[130px] w-[130px] mb-12 object-cover object-top"
        width={130}
        height={130}
        style={{
          maskImage:
            "radial-gradient(ellipse at center, black 50%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 50%, transparent 95%)",
        }}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={label}
      className="mx-auto h-[130px] w-[130px] border border-dotted border-black p-0.5 mb-12 flex items-center justify-center bg-[var(--primary,#dd1e3e)] text-white text-4xl font-light uppercase"
    >
      {initial}
    </div>
  );
}

function Person({
  initial,
  image,
  name,
  role,
  altLabel,
}: {
  initial?: string;
  image?: StaticImageData;
  name: string;
  role: string;
  altLabel: string;
}) {
  return (
    <figcaption className="text-center">
      <Avatar initial={initial} image={image} label={altLabel} />
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

export default function Quote() {
  return (
    <section className="relative isolate overflow-hidden bg-white px-6 pb-80 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-4xl md:pb-80">
        <figure className="mt-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-8 sm:translate-x-[30%]">
            <Person
              image={DavidImage}
              name="David"
              role="Founder"
              altLabel="David, Founder"
            />
            <Person
              image={LianaImage}
              name="Liana"
              role="Co-founder"
              altLabel="Liana, Co-founder"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
