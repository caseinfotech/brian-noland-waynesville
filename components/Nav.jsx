"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Root-relative so these work from /search as well as the homepage.
const links = [
  { href: "/#featured", label: "Listings" },
  { href: "/search", label: "Search" },
  { href: "/#about", label: "About Brian" },
  { href: "/#process", label: "The Approach" },
  { href: "/#reviews", label: "Reviews" },
];

/**
 * @param {{ solid?: boolean }} props
 *   `solid` forces the light-background treatment for pages that have no
 *   dark hero behind the header (e.g. /search).
 */
export default function Nav({ solid = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  const light = solid || scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxe ${
        light
          ? "bg-bone/95 backdrop-blur-md border-b border-ink/10 py-4"
          : "bg-transparent py-7"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="group">
          <span className={`font-serif text-2xl tracking-wide ${light ? "text-ink" : "text-bone"}`}>
            Brian K. Noland<span className="text-gold">.</span>
          </span>
          <span className={`mt-0.5 block text-[9px] uppercase tracking-widest2 ${light ? "text-gold-dim" : "text-gold-light"}`}>
            Waynesville &middot; Western North Carolina
          </span>
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-gold ${light ? "text-ink/80" : "text-bone/80"}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/#contact"
              className={`border px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${light ? "border-ink bg-ink text-bone hover:bg-gold hover:border-gold" : "border-bone/60 text-bone hover:bg-bone hover:text-ink"}`}
            >
              Inquire
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 transition-transform ${light ? "bg-ink" : "bg-bone"} ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 transition-transform ${light ? "bg-ink" : "bg-bone"} ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-bone px-6 py-6 md:hidden">
          <ul className="flex flex-col gap-5">
            {[...links, { href: "/#contact", label: "Inquire" }].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-[0.2em] text-ink hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
