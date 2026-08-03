"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Floating action dock — persistent access to MLS search and contact.
 *
 * Behaviour is deliberately restrained so it helps rather than nags:
 *   - hidden until the visitor scrolls past the hero, so it never competes
 *     with the hero's own buttons
 *   - hidden again while the contact section is on screen, so it can't sit
 *     on top of the form the visitor is already filling in
 *   - full-width bar on mobile, compact pill bottom-right on desktop
 *
 * @param {{ showSearch?: boolean }} props
 *   `showSearch` false on /search, where the link would point at the page
 *   the visitor is already on.
 */
export default function FloatingActions({ showSearch = true }) {
  const [visible, setVisible] = useState(false);
  const contactVisible = useRef(false);

  useEffect(() => {
    // Hide while the contact section is in view.
    const contact = document.getElementById("contact");
    let observer;
    if (contact) {
      observer = new IntersectionObserver(
        (entries) => {
          contactVisible.current = entries[0]?.isIntersecting ?? false;
          if (contactVisible.current) setVisible(false);
        },
        { threshold: 0.15 },
      );
      observer.observe(contact);
    }

    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.75;
      setVisible(past && !contactVisible.current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-0 transition-all duration-500 ease-luxe sm:inset-x-auto sm:bottom-7 sm:right-7 sm:px-0 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-stretch border-t border-bone/15 bg-ink shadow-[0_-8px_30px_rgba(0,0,0,.18)] sm:border sm:border-bone/15 sm:shadow-[0_10px_40px_rgba(0,0,0,.28)]">
        {showSearch && (
          <Link
            href="/search"
            tabIndex={visible ? 0 : -1}
            className="group flex flex-1 items-center justify-center gap-3 px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:bg-gold hover:text-ink sm:flex-none sm:px-7 sm:py-4"
          >
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.6" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="M12.8 12.8L17 17" strokeLinecap="round" />
            </svg>
            Search MLS
          </Link>
        )}

        {showSearch && <span className="w-px bg-bone/15" aria-hidden="true" />}

        <Link
          href="/#contact"
          tabIndex={visible ? 0 : -1}
          className="group flex flex-1 items-center justify-center gap-3 px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:bg-gold hover:text-ink sm:flex-none sm:px-7 sm:py-4"
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.6" aria-hidden="true">
            <rect x="2.5" y="4.5" width="15" height="11" rx="1" />
            <path d="M3 5.5l7 5 7-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Contact Brian
        </Link>
      </div>
    </div>
  );
}
