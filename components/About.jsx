import Image from "next/image";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="bg-ink px-6 py-24 text-bone lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 lg:grid-cols-[1.15fr_.85fr] lg:gap-24">
        <Reveal>
          <div className="relative">
            <div className="absolute -bottom-5 -right-5 h-2/3 w-2/3 border border-gold/40" />
            <div className="relative aspect-[16/10] overflow-hidden bg-white">
              <Image
                src="/images/brian-noland-award-2026.jpeg"
                alt="Brian K. Noland, residential and commercial broker"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-[11px] uppercase tracking-widest2 text-gold">
              Rooted Here
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-bone lg:text-5xl">
              Eight generations here.
              <br />
              <em className="text-gold-light">Experience that shows.</em>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="hairline mt-8 mb-8 w-24" />
            <p className="font-light leading-relaxed text-mist">
              Brian Noland&rsquo;s market knowledge comes from eight generations
              in the Haywood County mountains. His background as a successful
              entrepreneur helped him become one of the area&rsquo;s top-producing
              agents, with the perspective to evaluate both homes and business
              opportunities.
            </p>
            <p className="mt-5 font-light leading-relaxed text-mist">
              Brian has guided more than 1,000 customers through buying or selling
              a home and has represented commercial clients including Publix,
              Taco Bell, Mattress Firm, Bojangles, and Shoney&rsquo;s. That
              combination gives his clients one trusted advisor across the full
              range of real estate needs.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <a
              href="#contact"
              className="mt-10 inline-block border-b border-gold pb-1 text-xs uppercase tracking-[0.25em] text-gold transition-colors hover:text-gold-light"
            >
              Meet Brian &nbsp;↗
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
