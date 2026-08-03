"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-reveal wrapper.
 *
 * `.reveal` starts at opacity 0, which means a failure here doesn't degrade
 * gracefully — it leaves the page blank. Three safeguards:
 *
 *   1. If IntersectionObserver is unavailable, reveal immediately.
 *   2. A failsafe timer reveals the element regardless after 2.5s, so a
 *      missed observer callback can never permanently hide content.
 *   3. globals.css reveals everything under `@media (scripting: none)`.
 *
 * A tall element can also never reach a high intersection ratio on a short
 * viewport, so the threshold is 0 with a negative rootMargin instead — it
 * fires as soon as any part is meaningfully on screen, at any element height.
 */
export default function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => el.classList.add("is-visible");

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        show();
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);

    const failsafe = setTimeout(() => {
      if (!el.classList.contains("is-visible")) {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) show();
      }
    }, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
