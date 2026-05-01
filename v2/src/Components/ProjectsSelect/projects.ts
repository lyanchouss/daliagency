import { StaticImageData } from "next/image";

type Project = {
  title: string;
  slug: string;
  tagline: string;
  tags: string[];
  image: StaticImageData;
  backgroundColor: string;
  frameColor: string;
  backgroundImage?: string;
  externalLink?: string;
};

// Add projects here. Example shape (uncomment and fill in once you have a thumbnail):
//
// import HUB21Image from "@/assets/images/projects/hub21.jpg";
//
// {
//   title: "HUB21 hackerspace in Belgrade",
//   slug: "hub21",
//   tagline: "innovation space",
//   tags: ["interior design", "brand", "vibes"],
//   backgroundColor: "#E8FA48",
//   frameColor: "#000",
//   image: HUB21Image,
// },

export const projects: Project[] = [];
