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
    backgroundColor: "#8AA4B8",
    frameColor: "#B89968",
    image: StayAndWorkImage,
  },
  {
    title: "Muqtad",
    slug: "muqtad",
    tagline: "discount aggregator",
    tags: ["brand", "e-commerce"],
    backgroundColor: "#FDFBF7",
    frameColor: "#5E9FD1",
    image: MuqtadImage,
  },
  {
    title: "Delivery Setup",
    slug: "deliverysetup",
    tagline: "restaurant delivery, end-to-end",
    tags: ["brand", "foodtech", "service"],
    backgroundColor: "#F4FAE6",
    frameColor: "#94B062",
    image: DeliverySetupImage,
  },
  {
    title: "UIMix",
    slug: "uimix",
    tagline: "wysiwyg for react components",
    tags: ["product", "dev tool", "open source"],
    backgroundColor: "#ECECEC",
    frameColor: "#888888",
    image: UIMixImage,
  },
  {
    title: "Masuro",
    slug: "masuro",
    tagline: "localization & video studio",
    tags: ["brand", "studio", "video"],
    backgroundColor: "#E8C9C9",
    frameColor: "#9B6B6B",
    image: MasuroImage,
  },
  {
    title: "agents.ge",
    slug: "agentsge",
    tagline: "shared memory for AI coding agents",
    tags: ["product", "dev tool", "open source"],
    backgroundColor: "#FFE8D1",
    frameColor: "#C2925E",
    image: AgentsGeImage,
  },
  {
    title: "Saint King Tamari",
    slug: "tamari",
    tagline: "daily wisdom of the saints",
    tags: ["mobile", "brand", "spiritual"],
    backgroundColor: "#BCC8D8",
    frameColor: "#5E7290",
    orientation: "portrait",
    image: TamariImage,
  },
  {
    title: "Muqta",
    slug: "muqta",
    tagline: "smart shopping companion",
    tags: ["mobile", "e-commerce", "lifestyle"],
    backgroundColor: "#B8DDF7",
    frameColor: "#5E9FD1",
    orientation: "portrait",
    image: MuqtaImage,
  },
];
