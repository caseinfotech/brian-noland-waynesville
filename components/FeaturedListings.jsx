import Reveal from "./Reveal";
import { fetchProperties, DEFAULT_ORIGINATING_SYSTEM } from "@/lib/mlsgrid";

/**
 * Featured listings — Brian's top 3 active listings by price.
 *
 * Server component: the MLS Grid token never reaches the browser, and the
 * result is cached by the page's `revalidate` setting rather than being
 * re-fetched per visitor (MLS Grid allows only 2 req/sec).
 *
 * The section renders nothing at all when:
 *   - the token or agent ID isn't configured (e.g. still on the demo feed), or
 *   - the feed returns no active listings for him, or
 *   - the upstream call fails.
 * A missing section is better than a broken or empty one, and it means the
 * homepage degrades cleanly to the hand-authored representations below.
 */

const MAX_FEATURED = 3;

function formatPrice(value) {
  return typeof value === "number"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value)
    : "Price on request";
}

function specLine(l) {
  return (
    [
      l.beds && `${l.beds} BD`,
      l.baths && `${l.baths} BA`,
      l.sqft && `${l.sqft.toLocaleString()} SF`,
    ]
      .filter(Boolean)
      .join(" · ") ||
    l.propertySubType ||
    l.propertyType ||
    ""
  );
}

export default async function FeaturedListings() {
  const token = process.env.MLS_GRID_API_TOKEN;
  const agentMlsId = process.env.MLS_GRID_AGENT_MLS_ID;

  // Not configured yet — hide the section entirely.
  if (!token || !agentMlsId) return null;

  let result;
  try {
    result = await fetchProperties(token, {
      agentMlsId,
      top: 12, // over-fetched internally; ListAgentMlsId isn't server-searchable
      originatingSystemName:
        process.env.MLS_GRID_ORIGINATING_SYSTEM_NAME || DEFAULT_ORIGINATING_SYSTEM,
    });
  } catch {
    return null;
  }

  if (!result.ok || result.properties.length === 0) return null;

  const featured = [...result.properties]
    .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    .slice(0, MAX_FEATURED);

  return (
    <section className="bg-[#e7e0d4] py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="mb-14 flex flex-col gap-6 border-b border-ink/15 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest2 text-gold-dim">
              Currently Representing
            </p>
            <h2 className="mt-4 font-serif text-4xl text-ink lg:text-6xl">
              Featured <em className="text-gold-dim">listings.</em>
            </h2>
          </div>
          <a
            href="/search"
            className="text-[10px] uppercase tracking-[0.22em] text-ink underline decoration-gold underline-offset-8"
          >
            Search all listings &nbsp;↗
          </a>
        </Reveal>

        <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((l, i) => {
            const photo = l.photos?.[0];
            return (
              <Reveal key={l.listingKey} delay={i * 150} className="min-w-0">
                <article className="listing-card group h-full">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink/10">
                    {photo ? (
                      /* Served via /api/media — MLS Grid URLs are never exposed. */
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading={i === 0 ? "eager" : "lazy"}
                        className="h-full w-full object-cover transition-transform duration-1000 ease-luxe group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-ink/40">
                          Photo coming soon
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-ink/10 transition-opacity duration-500 group-hover:opacity-0" />
                    {l.status && (
                      <span className="absolute left-5 top-5 bg-bone/90 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-ink backdrop-blur-sm">
                        {l.status}
                      </span>
                    )}
                    {l.photos?.length > 1 && (
                      <span className="absolute bottom-5 right-5 bg-bone/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-ink backdrop-blur-sm">
                        {l.photos.length} photos
                      </span>
                    )}
                  </div>

                  <div className="grid gap-3 border-b border-ink/15 py-6 sm:grid-cols-[1fr_auto]">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-gold-dim">
                        {l.city || "Western North Carolina"}
                        {l.state ? `, ${l.state}` : ""}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl text-ink transition-colors group-hover:text-gold-dim lg:text-3xl">
                        {l.address || "Address upon request"}
                      </h3>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-serif text-xl text-ink">
                        {formatPrice(l.price)}
                      </p>
                      <p className="mt-2 text-[10px] text-ink/55">{specLine(l)}</p>
                    </div>
                  </div>

                  {(l.listOfficeName || l.listAgentName) && (
                    <p className="mt-3 text-[9px] leading-5 text-ink/45">
                      Listing courtesy of {l.listOfficeName || l.listAgentName}
                    </p>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* IDX attribution — required wherever MLS data is displayed. */}
        <p className="mt-12 max-w-3xl text-[10px] leading-5 text-ink/45">
          Listing data provided by the MLS via MLS Grid. Information is deemed
          reliable but not guaranteed and should be independently verified. IDX
          information is provided exclusively for consumers&apos; personal,
          non-commercial use.
        </p>
      </div>
    </section>
  );
}
