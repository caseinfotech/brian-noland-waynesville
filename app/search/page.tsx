import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IdxEmbed from "@/components/IdxEmbed";
import PropertySearch from "@/components/PropertySearch";

export const metadata: Metadata = {
  title: "Property Search | Brian K. Noland, Waynesville NC",
  description:
    "Search active listings across Waynesville, Haywood County, and Western North Carolina with Brian K. Noland.",
};

const embedUrl = process.env.NEXT_PUBLIC_IDX_EMBED_URL;
const scriptSrc = process.env.NEXT_PUBLIC_IDX_SCRIPT_SRC;
const widgetId = process.env.NEXT_PUBLIC_IDX_WIDGET_ID;

export default function SearchPage() {
  const hasIdxVendor = Boolean(embedUrl || scriptSrc);

  return (
    <main className="bg-bone">
      <Nav solid />

      {/* Page header. Padded for the fixed nav. */}
      <section className="px-6 pb-12 pt-32 lg:px-12 lg:pb-14 lg:pt-40">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] uppercase tracking-widest2 text-gold-dim">
            Waynesville &middot; Haywood County &middot; Western North Carolina
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.05] text-ink lg:text-7xl">
            Search every active listing,{" "}
            <em className="text-gold-dim">then call someone who knows them.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-ink/70">
            The search below covers the full regional MLS. Brian can show you any
            property on it &mdash; and tell you what the listing sheet
            won&apos;t.
          </p>
        </div>
      </section>

      {hasIdxVendor ? (
        <section className="px-6 py-14 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-[1440px]">
            <IdxEmbed
              embedUrl={embedUrl}
              scriptSrc={scriptSrc}
              widgetId={widgetId}
            />
          </div>
        </section>
      ) : (
        /* The page header above already introduces the search — suppress the
           component's own heading so there aren't two competing headlines. */
        <PropertySearch hideHeader />
      )}

      {/* Always-on nudge back to a human. */}
      <section className="border-t border-ink/15 px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest2 text-gold-dim">
              Not finding it?
            </p>
            <h2 className="mt-4 max-w-2xl font-serif text-3xl text-ink lg:text-5xl">
              Some of the best properties here{" "}
              <em className="text-gold-dim">never reach the search.</em>
            </h2>
          </div>
          <Link
            href="/#contact"
            className="shrink-0 bg-ink px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-gold"
          >
            Tell Brian what you&apos;re after
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
