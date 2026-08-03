"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BrokerageMark from "./BrokerageMark";

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
          ? "bg-bone/95 backdrop-blur-md border-b border-ink/10 py-5"
          : "bg-transparent py-8"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="group flex items-center gap-3 sm:gap-5">
          <div>
            <span className={`font-serif text-xl tracking-wide sm:text-3xl lg:text-4xl ${light ? "text-ink" : "text-bone"}`}>
              Brian Noland<span className="text-gold">.</span>
            </span>
            {/* Hidden below sm: on a phone this line plus the logo crowded
                the header. The location already lives in the hero and footer. */}
            <span className={`mt-0.5 hidden text-[9px] uppercase tracking-widest2 sm:block ${light ? "text-gold-dim" : "text-gold-light"}`}>
              Waynesville &middot; Western North Carolina
            </span>
          </div>

          {/* Firm identification — required on licensee advertising in NC.
              Sized to match Brian's name in visual weight at every breakpoint,
              not tucked in as an afterthought (or dropped on mobile). */}
          <span className={`h-8 w-px sm:h-11 lg:h-14 ${light ? "bg-ink/15" : "bg-bone/25"}`} aria-hidden="true" />
          <BrokerageMark
            dark={light}
            className="w-[46px] sm:w-[92px] lg:w-[124px]"
          />
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

        {/* Mobile toggle. Negative margin offsets the padding so the bigger
            tap target (44px, not the ~14px the bare icon gave it) doesn't
            shift the icon's visual position. */}
        <button
          aria-label={open ? "Close menu" : "Menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="-m-3 flex flex-col gap-1.5 p-3 md:hidden"
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
