import Hero from "../Components/Home/Hero";
import Projects from "../Components/Home/Projects";
import DesignSprints from "../Components/Home/DesignSprints";
import Quote from "@/Components/Quote/Quote";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <DesignSprints />
      <Quote />
    </main>
  );
}
