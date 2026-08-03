import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Listings from "@/components/Listings";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      {/* Brian's own representations. Full-market search lives at /search so
          the homepage stays on-brand rather than hosting a vendor iframe. */}
      <Listings />
      <About />
      <Stats />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
