import Reveal from "./Reveal";

/**
 * Client reviews — three, each trimmed to two sentences so the cards are
 * visually uniform.
 *
 * These are REAL, verified reviews from Brian's Realtor.com profile (sourced by
 * RealSatisfied), shortened for display. An ellipsis (…) marks every omission;
 * no wording has been changed, added, or paraphrased.
 *
 * Do not replace these with invented testimonials. Fabricated endorsements on a
 * commercial site breach the FTC's rule on fake reviews and state real estate
 * advertising rules — the liability sits with the licensee. If more reviews are
 * wanted, take them from the profile and trim them the same way.
 *
 * Full text of each: see PROFILE_URL.
 */

const PROFILE_URL =
  "https://www.realtor.com/realestateagents/567411ef89a689010069f61b";

const reviews = [
  {
    quote:
      "Brian Noland is truly the best agent my husband and I have ever worked with. He is very honest and trustworthy … he takes the time you need to find the perfect property for you.",
    name: "Mark and Karen Dufour",
    from: "Panama City",
    date: "January 2023",
  },
  {
    quote:
      "He was extremely knowledgeable about the area and one of the friendliest agents we've ever come in contact with. We loved working with someone who has deep roots within their community, and Brian has just that.",
    name: "Amie Newsome",
    from: "Waynesville",
    date: "November 2022",
  },
  {
    quote:
      "Brian was great to work with and super helpful. Buying a house is extremely stressful but Brian … made it very easy.",
    name: "Rebecca Lennox",
    from: "Waynesville",
    date: "May 2022",
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-1.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3 w-3 fill-gold" aria-hidden="true">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="bg-bone py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] uppercase tracking-widest2 text-gold-dim">
            Verified Client Reviews
          </p>
          <h2 className="mt-4 font-serif text-4xl text-ink lg:text-5xl">
            What it&apos;s like{" "}
            <em className="text-gold-dim">to work with Brian.</em>
          </h2>
        </Reveal>

        {/* Equal-height cards: the quotes are trimmed to a similar length, and
            flex-1 on the blockquote keeps every attribution on the same line. */}
        <div className="mt-14 grid items-stretch gap-px bg-ink/12 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 120} className="bg-bone">
              <figure className="flex h-full flex-col px-8 py-10 lg:px-9">
                <Stars />

                <blockquote className="mt-6 flex-1 font-serif text-[19px] italic leading-8 text-ink/85 lg:text-xl">
                  {r.quote}
                </blockquote>

                <figcaption className="mt-8">
                  <p className="text-sm font-medium tracking-wide text-ink">
                    {r.name}
                  </p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-gold-dim">
                    {r.from} &middot; {r.date}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] uppercase tracking-[0.22em] text-ink underline decoration-gold underline-offset-8"
          >
            Read all reviews on Realtor.com &nbsp;↗
          </a>
          <p className="mx-auto mt-6 max-w-xl text-[10px] leading-5 text-ink/55">
            Verified client reviews from Brian&apos;s Realtor.com profile,
            sourced by RealSatisfied. Shortened for display; an ellipsis
            (&hellip;) indicates omitted text.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
