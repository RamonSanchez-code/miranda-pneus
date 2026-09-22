import { Hero } from "@/components/sections/Hero";
import { Marquee, About, Wheels, Tires, Services, Education, Differentials, InstagramGallery, Location, CtaBand } from "@/components/sections/Sections";
import { Simulator } from "@/components/sections/Simulator";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Wheels />
      <Tires />
      <Services />
      <Education />
      <Simulator />
      <Differentials />
      <InstagramGallery />
      <Location />
      <CtaBand />
    </>
  );
}
