"use client";

import { useCallback, useEffect, useState } from "react";
import Reveal from "./Reveal";

function formatPrice(value) {
  return typeof value === "number"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value)
    : "Price on request";
}

function specLine(property) {
  return (
    [
      property.beds && `${property.beds} BD`,
      property.baths && `${property.baths} BA`,
      property.sqft && `${property.sqft.toLocaleString()} SF`,
    ]
      .filter(Boolean)
      .join(" · ") ||
    property.propertySubType ||
    property.propertyType ||
    "Property details available"
  );
}

/**
 * @param {{ hideHeader?: boolean }} props
 *   `hideHeader` when the surrounding page already has its own heading —
 *   otherwise /search shows two competing search headlines.
 */
export default function PropertySearch({ hideHeader = false }) {
  const [propertyType, setPropertyType] = useState("");
  const [result, setResult] = useState(null);
  // Starts true (not false): the page auto-loads listings on mount below, so
  // the very first render is already in a loading state, not an empty one.
  const [loading, setLoading] = useState(true);

  // No setState call runs before the first `await` here — everything that
  // touches state happens after the fetch resolves. That keeps the mount
  // effect below free of synchronous setState-in-effect, while still
  // supporting the immediate "Searching…" feedback handleSubmit sets up
  // itself before calling this.
  const fetchProperties = useCallback(async (type) => {
    const params = new URLSearchParams();
    if (type) params.set("propertyType", type);

    try {
      const response = await fetch(`/api/properties?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load properties.");
      setResult({
        properties: data.properties || [],
        filteredByAgent: Boolean(data.filteredByAgent),
        message: "",
      });
    } catch (error) {
      setResult({ properties: [], message: error.message || "Unable to load properties." });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load the full active feed as soon as the page opens — a search page that
  // shows nothing until you press a button reads as broken, not blank by
  // design. This is a deliberate fetch-on-mount, not a synchronous state
  // update, so the lint rule's general "you might not need an effect"
  // concern doesn't apply here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProperties("");
    // fetchProperties is referentially stable (useCallback, empty deps), so
    // listing it here doesn't cause re-fetches on every render.
  }, [fetchProperties]);

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    fetchProperties(propertyType);
  }

  return (
    <section
      id="properties"
      className={`bg-[#eae9e5] px-6 lg:px-12 ${
        hideHeader ? "pb-20 pt-8 lg:pb-24 lg:pt-10" : "py-20 lg:py-24"
      }`}
    >
      <div className="mx-auto max-w-[1440px]">
        {!hideHeader && (
          <Reveal className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-widest2 text-gold-dim">
              Live property search
            </p>
            <h2 className="mt-4 font-serif text-4xl text-ink lg:text-6xl">
              Search what&apos;s <em className="text-gold-dim">on the market.</em>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-ink/80">
              Browse the authorized live MLS feed. This test connection is
              limited to API-supported filters; the production search will use a
              synced local listing database for location, price, and map search.
            </p>
          </Reveal>
        )}

        <Reveal delay={125} className={hideHeader ? "" : "mt-12"}>
          <form onSubmit={handleSubmit} className="grid gap-4 border-y border-ink/15 py-6 md:grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="property-type">Property type</label>
            <select
              id="property-type"
              value={propertyType}
              onChange={(event) => setPropertyType(event.target.value)}
              className="border-b border-ink/25 bg-transparent px-1 py-3 text-sm text-ink focus:border-gold focus:outline-none"
            >
              <option value="">All active property types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial Sale">Commercial sale</option>
              <option value="Land">Land</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="bg-ink px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-gold disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? "Searching…" : "Search listings"}
            </button>
          </form>
        </Reveal>

        {result && (
          <div className="mt-10">
            {result.message ? (
              <p className="border-l-2 border-gold pl-4 text-sm text-ink/80">{result.message}</p>
            ) : result.properties.length === 0 ? (
              <p className="border-l-2 border-gold pl-4 text-sm leading-7 text-ink/80">
                {result.filteredByAgent
                  ? "No active listings are currently associated with Brian in the MLS feed. His recent representations are shown above."
                  : "No active listings matched those filters."}
              </p>
            ) : (
              <>
                <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                  {result.properties.map((property) => {
                    const photo = property.photos?.[0];
                    return (
                      <article key={property.listingKey} className="listing-card group min-w-0">
                        <div className="relative aspect-[4/3] overflow-hidden bg-ink/10">
                          {photo ? (
                            // Served from our own /api/media proxy — MLS Grid
                            // media URLs are never exposed to the browser.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={photo.src}
                              alt={photo.alt}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-1000 ease-luxe group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="text-[9px] uppercase tracking-[0.2em] text-ink/60">
                                Photo unavailable
                              </span>
                            </div>
                          )}
                          {property.photos?.length > 1 && (
                            <span className="absolute bottom-4 right-4 bg-bone/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-ink backdrop-blur-sm">
                              {property.photos.length} photos
                            </span>
                          )}
                          {property.status && (
                            <span className="absolute left-5 top-5 bg-bone/90 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-ink backdrop-blur-sm">
                              {property.status}
                            </span>
                          )}
                        </div>

                        <div className="grid gap-3 border-b border-ink/15 py-6 sm:grid-cols-[1fr_auto]">
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-gold-dim">
                              {property.city || "MLS Grid"}
                              {property.state ? `, ${property.state}` : ""}
                            </p>
                            <h3 className="mt-2 font-serif text-2xl text-ink transition-colors group-hover:text-gold-dim lg:text-3xl">
                              {property.address || "Address available upon request"}
                            </h3>
                          </div>
                          <div className="sm:text-right">
                            <p className="font-serif text-xl text-ink">
                              {formatPrice(property.price)}
                            </p>
                            <p className="mt-2 text-[10px] text-ink/80">{specLine(property)}</p>
                          </div>
                        </div>

                        {(property.listOfficeName || property.listAgentName) && (
                          <p className="mt-3 text-[9px] leading-5 text-ink/72">
                            Listing courtesy of{" "}
                            {property.listOfficeName || property.listAgentName}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>

                {/* IDX attribution — required when displaying MLS data. */}
                <p className="mt-12 max-w-3xl text-[10px] leading-5 text-ink/72">
                  Listing data provided by the MLS via MLS Grid. Information is
                  deemed reliable but not guaranteed and should be independently
                  verified. IDX information is provided exclusively for
                  consumers&apos; personal, non-commercial use.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
