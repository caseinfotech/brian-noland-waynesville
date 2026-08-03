import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

const listings = [
  {
    title: "Green Valley Road",
    location: "Waynesville, North Carolina",
    price: "$80,000",
    specs: "Waterfront · Mountain views · Unrestricted",
    image: "/images/green-valley-road.jpg",
  },
  {
    title: "Great Smoky Mountains Expressway",
    location: "Waynesville, North Carolina",
    price: "$737,500",
    specs: "Office · Heated storage · Three-bay garage",
    image: "/images/great-smoky-mountains-expressway.jpg",
  },
  {
    title: "Riverbend Street",
    location: "Waynesville, North Carolina",
    price: "$150,000",
    specs: "2 BD · 1 BA · Hazelwood corner lot",
    image: "/images/riverbend-street.jpg",
  },
];

export default function Listings() {
  return (
    <section id="listings" className="bg-bone py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="mb-14 flex flex-col gap-6 border-b border-ink/15 pb-10 md:flex-row md:items-end md:justify-between">
          <div><p className="text-[10px] uppercase tracking-widest2 text-gold-dim">
            Brian K. Noland Representations
          </p>
          <h2 className="mt-4 font-serif text-4xl text-ink lg:text-6xl">
            Brian&apos;s local work, <em className="text-gold-dim">clearly represented.</em>
          </h2></div>
          <a href="https://www.naibeverly-hanks.com/agents/bknoland" target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-[0.22em] text-ink underline decoration-gold underline-offset-8">View Brian&apos;s profile &nbsp;↗</a>
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
                    <p className="mt-2 text-[10px] text-ink/55">{l.specs}</p></div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Route to the full-market search, which lives on its own page. */}
        <Reveal delay={200} className="mt-16 flex flex-col gap-6 border-t border-ink/15 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-sm leading-7 text-ink/65">
            Looking for what&apos;s on the market right now? Search every active
            listing across Haywood County and Western North Carolina.
          </p>
          <Link
            href="/search"
            className="shrink-0 bg-ink px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-gold"
          >
            Search all listings &nbsp;↗
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
