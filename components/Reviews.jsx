import Reveal from "./Reveal";

/**
 * Client reviews.
 *
 * Quoted verbatim from Brian's verified Realtor.com profile (sourced by
 * RealSatisfied). Deliberately hand-curated rather than scraped: Realtor.com
 * has no public reviews API, scraping breaches their terms, and a live-pulled
 * section would blank the homepage the moment their markup changed.
 *
 * Attribution and a link to the full profile are part of quoting these
 * fairly — keep both if you add more.
 *
 * Reviews are quoted verbatim except where an ellipsis (…) marks an omission.
 * Don't paraphrase or silently tidy a client's words.
 */

const PROFILE_URL =
  "https://www.realtor.com/realestateagents/567411ef89a689010069f61b";

const reviews = [
  {
    quote:
      "We would definitely recommend Brian Noland to any future homebuyers! He was extremely knowledgeable about the area and one of the friendliest agents we've ever come in contact with. I knew he was the right fit for us when at the first home we toured (which ended up being the one we purchased) he was approached by cars and people in the neighborhood who knew him. We loved working with someone who has deep roots within their community, and Brian has just that. From waving at cars passing by to picking up a berry jam from our now neighbor, you can tell he's well respected and loved in this area. No matter how busy he got, he always made time for us to answer questions, walk through the home and send us updates. 10/10 would recommend to any first, second or 10th time homebuyers.",
    name: "Amie Newsome",
    from: "Waynesville",
    location: "Waynesville, NC",
    date: "November 23, 2022",
    rating: 5,
  },
  {
    quote:
      "Brian Noland is truly the best agent my husband and I have ever worked with. All aspects of our experience with him were excellent! He is very honest and trustworthy. Not pushy…not just trying to get a deal done…he takes the time you need to find the perfect property for you. We would certainly recommend him to anyone!",
    name: "Mark and Karen Dufour",
    from: "Panama City",
    location: "Waynesville, NC",
    date: "January 16, 2023",
    rating: 5,
  },
  {
    quote:
      // Names of other individuals elided; ellipsis marks the omission so the
      // quote isn't silently rewritten.
      "Brian was great to work with and super helpful. If we buy another house we'll definitely use him again! Very friendly! Buying a house is extremely stressful but Brian … made it very easy.",
    name: "Rebecca Lennox",
    from: "Waynesville",
    location: "Waynesville, NC",
    date: "May 4, 2022",
    rating: 5,
  },
  {
    quote:
      "I was happy with such an efficient process to list, manage offers, and close.",
    name: "Susan Starr",
    from: "Atlanta, GA",
    location: "Waynesville, NC",
    date: "December 28, 2022",
    rating: 5,
  },
];

function Stars({ count = 5 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 ${i < count ? "fill-gold" : "fill-ink/15"}`}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="bg-bone py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="mb-14 flex flex-col gap-6 border-b border-ink/15 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest2 text-gold-dim">
              Verified Client Reviews
            </p>
            <h2 className="mt-4 font-serif text-4xl text-ink lg:text-6xl">
              What it&apos;s like <em className="text-gold-dim">to work with Brian.</em>
            </h2>
          </div>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-[10px] uppercase tracking-[0.22em] text-ink underline decoration-gold underline-offset-8"
          >
            All reviews on Realtor.com &nbsp;↗
          </a>
        </Reveal>

        {/* CSS columns rather than a grid: the reviews vary a lot in length,
            and this avoids tall gaps under the short ones. */}
        <div className="columns-1 gap-7 md:columns-2 lg:columns-3 [&>*]:mb-7">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 100} className="break-inside-avoid">
              <figure className="border border-ink/12 bg-[#f4f1ea] p-7">
                <div className="flex items-center justify-between gap-4">
                  <Stars count={r.rating} />
                  <span className="text-[9px] uppercase tracking-[0.18em] text-gold-dim">
                    Verified
                  </span>
                </div>

                <blockquote className="mt-5 font-light leading-7 text-ink/80">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-6 border-t border-ink/12 pt-5">
                  <p className="font-serif text-lg text-ink">{r.name}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-gold-dim">
                    {r.from}
                  </p>
                  <p className="mt-2 text-[10px] text-ink/45">
                    {r.location} &middot; {r.date}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <p className="text-[10px] leading-5 text-ink/45">
            Reviews shown are verified client reviews published on Brian&apos;s
            Realtor.com profile, sourced by RealSatisfied. Quoted verbatim;
            an ellipsis (&hellip;) indicates omitted text.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
