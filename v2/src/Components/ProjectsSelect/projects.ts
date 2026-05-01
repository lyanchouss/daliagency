import { StaticImageData } from "next/image";

import StayAndWorkImage from "@/assets/images/projects/stayandwork.png";
import MuqtadImage from "@/assets/images/projects/muqtad.png";
import DeliverySetupImage from "@/assets/images/projects/deliverysetup.png";
import UIMixImage from "@/assets/images/projects/uimix.png";
import MasuroImage from "@/assets/images/projects/masuro.png";
import AgentsGeImage from "@/assets/images/projects/agentsge.png";
import TamariImage from "@/assets/images/projects/tamari.jpg";
import MuqtaImage from "@/assets/images/projects/muqta.webp";

type Project = {
  title: string;
  slug: string;
  tagline: string;
  tags: string[];
  image: StaticImageData;
  backgroundColor: string;
  frameColor: string;
  orientation?: "landscape" | "portrait";
  backgroundImage?: string;
  externalLink?: string;
};

export const projects: Project[] = [
  {
    title: "Stay & Work Georgia",
    slug: "stayandwork",
    tagline: "settle and work in georgia",
    tags: ["brand", "service", "legal-tech"],
    backgroundColor: "#DCEEFB",
    frameColor: "#1A4D7A",
    image: StayAndWorkImage,
  },
  {
    title: "Muqtad",
    slug: "muqtad",
    tagline: "discount aggregator",
    tags: ["brand", "e-commerce"],
    backgroundColor: "#FFE5E5",
    frameColor: "#DC2626",
    image: MuqtadImage,
  },
  {
    title: "Delivery Setup",
    slug: "deliverysetup",
    tagline: "restaurant delivery, end-to-end",
    tags: ["brand", "foodtech", "service"],
    backgroundColor: "#F5E6D3",
    frameColor: "#6B4423",
    image: DeliverySetupImage,
  },
  {
    title: "UIMix",
    slug: "uimix",
    tagline: "wysiwyg for react components",
    tags: ["product", "dev tool", "open source"],
    backgroundColor: "#ECECEC",
    frameColor: "#000",
    image: UIMixImage,
  },
  {
    title: "Masuro",
    slug: "masuro",
    tagline: "localization & video studio",
    tags: ["brand", "studio", "video"],
    backgroundColor: "#F4F0E8",
    frameColor: "#000",
    image: MasuroImage,
  },
  {
    title: "agents.ge",
    slug: "agentsge",
    tagline: "shared memory for AI coding agents",
    tags: ["product", "dev tool", "open source"],
    backgroundColor: "#BEFFCC",
    frameColor: "#000",
    image: AgentsGeImage,
  },
  {
    title: "Saint King Tamari",
    slug: "tamari",
    tagline: "daily wisdom of the saints",
    tags: ["mobile", "brand", "spiritual"],
    backgroundColor: "#E8DCC4",
    frameColor: "#6B4E1E",
    orientation: "portrait",
    image: TamariImage,
  },
  {
    title: "Muqta",
    slug: "muqta",
    tagline: "smart shopping companion",
    tags: ["mobile", "e-commerce", "lifestyle"],
    backgroundColor: "#FFE4D6",
    frameColor: "#DC2626",
    orientation: "portrait",
    image: MuqtaImage,
  },
];
