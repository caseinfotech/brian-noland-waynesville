"use client";

import { useState } from "react";
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

function propertyAddress(property) {
  return [
    property.StreetNumber,
    property.StreetDirPrefix,
    property.StreetName,
    property.StreetSuffix,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function PropertySearch() {
  const [propertyType, setPropertyType] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const params = new URLSearchParams();
    if (propertyType) params.set("propertyType", propertyType);

    try {
      const response = await fetch(`/api/properties?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load properties.");
      setResult({ properties: data.properties || [], message: "" });
    } catch (error) {
      setResult({ properties: [], message: error.message || "Unable to load properties." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="properties" className="bg-[#e7e0d4] px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-widest2 text-gold-dim">
            Live property search
          </p>
          <h2 className="mt-4 font-serif text-4xl text-ink lg:text-6xl">
            Search what&apos;s <em className="text-gold-dim">on the market.</em>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-ink/65">
            Browse the authorized live MLS feed. This test connection is limited
            to API-supported filters; the production search will use a synced
            local listing database for location, price, and map search.
          </p>
        </Reveal>

        <Reveal delay={125} className="mt-12">
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
              <p className="border-l-2 border-gold pl-4 text-sm text-ink/70">{result.message}</p>
            ) : result.properties.length === 0 ? (
              <p className="text-sm text-ink/70">No active listings matched those filters.</p>
            ) : (
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {result.properties.map((property) => (
                  <article key={property.ListingKey} className="border-b border-ink/15 pb-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dim">
                      {property.City || "MLS Grid"}{property.StateOrProvince ? `, ${property.StateOrProvince}` : ""}
                    </p>
                    <h3 className="mt-3 font-serif text-3xl text-ink">
                      {propertyAddress(property) || "Address available upon request"}
                    </h3>
                    <p className="mt-5 font-serif text-xl text-ink">{formatPrice(property.ListPrice)}</p>
                    <p className="mt-2 text-xs leading-6 text-ink/60">
                      {[property.BedroomsTotal && `${property.BedroomsTotal} BD`, property.BathroomsTotalInteger && `${property.BathroomsTotalInteger} BA`, property.LivingArea && `${property.LivingArea.toLocaleString()} SF`]
                        .filter(Boolean)
                        .join(" · ") || property.PropertySubType || property.PropertyType || "Property details available"}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
