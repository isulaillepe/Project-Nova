import Hero from "@/components/hero/Hero";
import Stats from "@/components/sections/Stats";
import WhoCanCompete from "@/components/sections/WhoCanCompete";
import { Features } from "@/components/sections/Features";
import PastEvents from "@/components/sections/PastEvents";
import OrganizingCommittee from "@/components/sections/OrganizingCommittee";
import Faq from "@/components/sections/Faq";
import Partners from "@/components/sections/Partners";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <WhoCanCompete />
      <Features />
      <PastEvents />
      <Partners />
      <OrganizingCommittee />
      <Faq />
    </>
  );
}