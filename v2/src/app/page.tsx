import Hero from "../Components/Home/Hero";
import Projects from "../Components/Home/Projects";
import DesignSprints from "../Components/Home/DesignSprints";
import About from "../Components/Home/About";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <DesignSprints />
      <About />
    </main>
  );
}
