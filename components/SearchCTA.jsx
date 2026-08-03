import Link from "next/link";
import Reveal from "./Reveal";

/**
 * Full-width call to action pointing at the MLS search.
 *
 * Deliberately dark: the surrounding sections are bone/sand, so an ink band
 * breaks the page rhythm and makes this read as a destination rather than
 * another content block.
 */
export default function SearchCTA() {
  return (
    <section className="bg-ink px-6 py-20 lg:px-12 lg:py-24">
      {/* Narrower than the page max-width on purpose: at 1440px a two-column
          split leaves a large dead gap in the middle of the band. */}
      <div className="mx-auto max-w-[1100px]">
        <Reveal className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-gold-light">
              <span className="h-px w-12 bg-gold-light" /> The full market
            </p>
            <h2 className="mt-6 font-serif text-4xl leading-[1.05] text-bone lg:text-5xl">
              Every active listing in{" "}
              <em className="font-normal text-gold-light">Haywood County.</em>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-bone/75">
              Search the regional MLS directly &mdash; homes, land, and
              commercial. Then bring anything you find to someone who has walked
              the roads it sits on.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-4">
            <Link
              href="/search"
              className="bg-bone px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-gold-light"
            >
              Search Listings
            </Link>
            <Link
              href="/#contact"
              className="px-3 py-4 text-[10px] uppercase tracking-[0.2em] text-bone/80 transition-colors hover:text-gold-light"
            >
              Ask Brian &nbsp;↗
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
