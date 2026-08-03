import Image from "next/image";
import Reveal from "./Reveal";

const listings = [
  {
    title: "Green Valley Road",
    location: "Waynesville, NC",
    price: "$80,000",
    specs: "Waterfront · Mountain views · Unrestricted",
    image: "/images/green-valley-road.jpg",
  },
  {
    title: "Great Smoky Mountains Expressway",
    location: "Waynesville, NC",
    price: "$737,500",
    specs: "Office · Heated storage · Three-bay garage",
    image: "/images/great-smoky-mountains-expressway.jpg",
  },
  {
    title: "Riverbend Street",
    location: "Waynesville, NC",
    price: "$150,000",
    specs: "2 BD · 1 BA · Hazelwood corner lot",
    image: "/images/riverbend-street.jpg",
  },
];

export default function Listings() {
  return (
    <section id="listings" className="bg-bone py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="mb-10 flex flex-col gap-6 border-b border-ink/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div><p className="text-[10px] uppercase tracking-widest2 text-gold-dim">
            Brian K. Noland Representations
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.1] text-ink lg:text-5xl">
            Brian&apos;s local work, <em className="text-gold-dim">clearly represented.</em>
          </h2></div>
          <a href="https://www.naibeverly-hanks.com/agents/bknoland" target="_blank" rel="noreferrer" className="shrink-0 whitespace-nowrap text-[10px] uppercase tracking-[0.22em] text-ink underline decoration-gold underline-offset-8">View Brian&apos;s profile &nbsp;↗</a>
        </Reveal>

        <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((l, i) => (
            <Reveal key={l.title} delay={i * 150} className="min-w-0">
              <article className="listing-card group h-full cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={l.image}
                    alt={l.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-luxe group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-ink/10 transition-opacity duration-500 group-hover:opacity-0" />
                  <span className="absolute left-5 top-5 bg-bone/90 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-ink backdrop-blur-sm">
                    Sold
                  </span>
                </div>
                <div className="grid gap-3 border-b border-ink/15 py-6 sm:grid-cols-[1fr_auto]">
                  <div><p className="text-[9px] uppercase tracking-[0.2em] text-gold-dim">{l.location}</p>
                  <h3 className="mt-2 font-serif text-2xl text-ink transition-colors group-hover:text-gold-dim lg:text-3xl">
                    {l.title}
                  </h3></div>
                  <div className="sm:text-right"><p className="font-serif text-xl text-ink">{l.price}</p>
                    <p className="mt-2 text-[10px] text-ink/80">{l.specs}</p></div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* No search CTA here — the SearchCTA band immediately below this
            section already routes to /search. Two in a row read as duplication. */}
      </div>
    </section>
  );
}
