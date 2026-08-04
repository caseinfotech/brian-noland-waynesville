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
                alt="Brian Noland, residential and commercial broker"
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
              Brian K. Noland is a dedicated real estate professional with 18
              years of experience and more than 2,300 successful property
              closings throughout Western North Carolina. His extensive
              knowledge spans residential homes, raw land, and commercial real
              estate, giving clients the confidence of working with an
              experienced advisor no matter their real estate needs.
            </p>
            <p className="mt-5 font-light leading-relaxed text-mist">
              In addition to his real estate career, Brian has successfully
              started, owned, and managed more than a dozen thriving businesses
              throughout Haywood County. His entrepreneurial background has
              given him valuable expertise in business, marketing, negotiations,
              and customer service&mdash;skills that directly benefit his real
              estate clients.
            </p>
            <p className="mt-5 font-light leading-relaxed text-mist">
              Brian believes that every client deserves personalized service.
              Whether helping buyers find the right property that meets their
              specific needs or developing strategic marketing plans to maximize
              exposure for sellers, he takes the time to understand each
              client&rsquo;s goals and priorities. He approaches every
              transaction as if it were his own, putting himself in his
              clients&rsquo; shoes to ensure they receive the guidance,
              communication, and level of service he would expect for his own
              family.
            </p>
            <p className="mt-5 font-light leading-relaxed text-mist">
              Known for his local market expertise, strong work ethic, and
              commitment to integrity, Brian has built a reputation for
              delivering exceptional results while making the buying and
              selling process as smooth and stress-free as possible.
            </p>
            <p className="mt-5 font-light leading-relaxed text-mist">
              Outside of real estate, Brian enjoys classic cars, cruising,
              camping, and spending quality time with his family. He is also an
              active member of his local church, where his faith and commitment
              to serving others are reflected in both his personal life and his
              approach to business.
            </p>
            <p className="mt-5 font-light leading-relaxed text-mist">
              Whether you&rsquo;re buying your first home, selling a property,
              investing in land, or seeking commercial opportunities, Brian is
              committed to providing knowledgeable guidance, honest advice, and
              exceptional service every step of the way.
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
