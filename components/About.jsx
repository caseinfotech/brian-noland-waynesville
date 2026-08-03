import Image from "next/image";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="bg-ink px-6 py-20 text-bone lg:px-12 lg:py-24">
      {/* Was [1.15fr_.85fr]: the text column got so narrow that the headline
          broke to one word per line. Even columns, capped overall width. */}
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-2 lg:gap-20">
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
            <h2 className="mt-5 font-serif text-[2.1rem] leading-[1.12] text-bone lg:text-[2.75rem]">
              Eight generations here.
              <br />
              <em className="text-gold-light">Experience that shows.</em>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="hairline mt-8 mb-8 w-24" />
            <p className="font-light leading-relaxed text-mist">
              Brian Noland&rsquo;s real estate expertise is rooted in eight
              generations of family history in the Haywood County mountains. As a
              successful entrepreneur and one of the area&rsquo;s top-producing
              agents, he brings a unique ability to evaluate residential
              properties, commercial investments, and business opportunities.
            </p>
            <p className="mt-5 font-light leading-relaxed text-mist">
              Throughout his career, Brian has guided more than 1,000 clients
              through the process of buying or selling a home. His commercial
              real estate experience includes representing nationally recognized
              brands such as Publix, Taco Bell, Mattress Firm, Bojangles, and
              Shoney&rsquo;s.
            </p>
            <p className="mt-5 font-light leading-relaxed text-mist">
              By combining deep local knowledge, proven business experience, and
              extensive residential and commercial expertise, Brian provides his
              clients with one trusted advisor for the full range of their real
              estate needs.
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
