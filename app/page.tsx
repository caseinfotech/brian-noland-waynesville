import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FeaturedListings from "@/components/FeaturedListings";
import Listings from "@/components/Listings";
import SearchCTA from "@/components/SearchCTA";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";

// Featured listings come from MLS Grid, which allows only 2 req/sec. Rebuild
// the page at most every 15 minutes rather than fetching per visitor.
export const revalidate = 900;

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      {/* The anchor lives here, not inside the component: FeaturedListings
          renders null when the feed isn't configured, and the nav link to
          #featured must resolve either way. */}
      <div id="featured" />
      {/* Live: Brian's top 3 active listings by price. Renders nothing until
          the production feed and agent ID are configured. */}
      <FeaturedListings />
      {/* Hand-authored past representations. Deliberately NOT from the feed —
          sold data carries different display rules than active IDX listings. */}
      <Listings />
      <About />
      <Stats />
      <Process />
      <Testimonials />
      {/* Verified client reviews, quoted from his Realtor.com profile. */}
      <Reviews />
      {/* Dark band placed between Reviews (bone) and Contact (sand) so it reads
          as its own block. It previously sat directly above About, which is also
          bg-ink — two identical dark sections merged into one huge empty void. */}
      <SearchCTA />
      <Contact />
      <Footer />
      {/* Persistent access to search and contact once past the hero. */}
      <FloatingActions />
    </main>
  );
}
