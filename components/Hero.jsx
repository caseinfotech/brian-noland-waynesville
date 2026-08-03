import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    /* Shorter on phones. The hero photo is a 2.35:1 panorama; in a tall
       portrait box object-cover crops the sides away and scales what's left
       far past its native resolution. 78svh keeps more of the ridgeline
       visible and asks much less of the source image. */
    <section
      id="top"
      className="relative flex h-[78svh] min-h-[560px] items-end overflow-hidden sm:h-[88svh] sm:min-h-[640px] lg:h-[92svh]"
    >
      <div className="absolute inset-0 hero-zoom">
        <Image
          src="/images/blue-ridge-autumn.jpg"
          alt="Autumn light over the Blue Ridge ridgelines of Haywood County, near Waynesville"
          fill
          priority
          /* Default sizes="100vw" made Next serve a 406px-wide file into a
             ~690px-tall box on mobile — a ~4x upscale. Asking for roughly
             double the viewport width on small screens fixes the softness. */
          sizes="(max-width: 640px) 200vw, (max-width: 1024px) 130vw, 100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/55" />
      <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-ink/60 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 sm:pb-20 lg:px-12 lg:pb-24">
        {/* The full location string wrapped into the nav on phones. Short form
            below sm, full string above. */}
        <p className="mb-5 flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-bone/80 sm:mb-7 sm:gap-4 sm:text-[10px] sm:tracking-[0.35em]">
          <span className="h-px w-8 bg-gold-light sm:w-12" />
          <span className="sm:hidden">Waynesville &middot; Western NC</span>
          <span className="hidden sm:inline">
            Waynesville &middot; Haywood County &middot; Western North Carolina
          </span>
        </p>

        <h1 className="max-w-5xl font-serif text-[2.75rem] leading-[0.98] text-bone sm:text-6xl sm:leading-[0.94] lg:text-[6.2rem]">
          Live where life
          <br />
          <em className="font-normal text-gold-light">opens up.</em>
        </h1>

        <div className="mt-7 flex flex-col gap-7 border-l border-bone/30 pl-5 sm:mt-9 sm:pl-6 md:flex-row md:items-end md:justify-between md:gap-8">
          <p className="max-w-lg text-sm font-light leading-7 text-bone/85 md:text-base">
            Residential and commercial guidance grounded in eight generations of
            local knowledge.
          </p>

          {/* Full-width stacked buttons on phones — equal width and a proper
              tap target, rather than two differently-sized pills. */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="/search"
              className="bg-bone px-7 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:bg-gold-light"
            >
              Search Listings
            </Link>
            <a
              href="#featured"
              className="border border-bone/40 px-7 py-4 text-center text-[10px] uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-gold-light hover:text-gold-light"
            >
              Brian&rsquo;s Properties
            </a>
            <a
              href="#contact"
              className="py-2 text-center text-[10px] uppercase tracking-[0.2em] text-bone transition-colors hover:text-gold-light sm:px-3 sm:py-4"
            >
              Start a Conversation &nbsp;↗
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue — desktop only; it collided with the hero text on phones. */}
      <div className="absolute right-12 top-1/2 z-10 hidden -translate-y-1/2 rotate-90 text-[9px] uppercase tracking-[0.35em] text-bone/60 lg:block">
        Scroll to discover <span className="ml-4 text-gold-light">→</span>
      </div>
    </section>
  );
}
