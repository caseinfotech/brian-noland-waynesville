import Image from "next/image";

export default function Hero() {
  return (
    <section id="top" className="relative flex h-[96svh] min-h-[680px] items-end overflow-hidden">
      <div className="absolute inset-0 hero-zoom">
        <Image
          src="/images/blue-ridge-autumn.jpg"
          alt="Autumn light over the Blue Ridge ridgelines of Haywood County, near Waynesville"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/55" />
      <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-ink/60 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-24 lg:px-12 lg:pb-24">
        <p className="mb-7 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-bone/80">
          <span className="h-px w-12 bg-gold-light" /> Waynesville &middot; Haywood County &middot; Western North Carolina
        </p>
        <h1 className="max-w-5xl font-serif text-[3.4rem] leading-[0.94] text-bone sm:text-7xl lg:text-[6.8rem]">
          Live where life
          <br /><em className="font-normal text-gold-light">opens up.</em>
        </h1>
        <div className="mt-9 flex flex-col gap-8 border-l border-bone/30 pl-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-lg text-sm font-light leading-7 text-bone/80 md:text-base">
            Residential and commercial guidance grounded in eight generations of local knowledge.
          </p>
          <div className="flex flex-wrap items-center gap-4">
          <a
            href="#listings"
            className="bg-bone px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:bg-gold-light"
          >
            Explore Properties
          </a>
          <a
            href="#contact"
            className="px-3 py-4 text-[10px] uppercase tracking-[0.2em] text-bone transition-colors hover:text-gold-light"
          >
            Start a Conversation &nbsp;↗
          </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute right-12 top-1/2 z-10 hidden -translate-y-1/2 rotate-90 text-[9px] uppercase tracking-[0.35em] text-bone/60 lg:block">
        Scroll to discover <span className="ml-4 text-gold-light">→</span>
      </div>
    </section>
  );
}
