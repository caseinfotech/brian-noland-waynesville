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
