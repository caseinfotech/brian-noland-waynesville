"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const inputClass =
  // Placeholder stays lighter than typed text so an empty field never reads as
  // filled in — but not so light it's hard to scan.
  "w-full border-b border-ink/30 bg-transparent py-3 text-sm font-light text-ink placeholder:text-ink/55 focus:border-gold-dim focus:outline-none transition-colors";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const HOLD_MS = 1200;

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [token, setToken] = useState("");

  const formRef = useRef(null);
  const widgetRef = useRef(null);
  const rafRef = useRef(null);
  const startedAt = useRef(0);

  // --- Cloudflare Turnstile -------------------------------------------------
  // Rendered explicitly so we can hold the token in state and reset it after a
  // submit (tokens are single-use).
  //
  // IMPORTANT: this section is wrapped in <Reveal>, which starts at opacity 0
  // until scrolled into view. Turnstile will not initialise inside an invisible
  // container — it creates the hidden input, never loads its iframe, and the
  // user sees "unable to connect". So we wait for the widget to actually be on
  // screen before rendering. This also avoids loading Turnstile at all for
  // visitors who never reach the form.
  useEffect(() => {
    if (!SITE_KEY) return;

    let cancelled = false;
    const el = widgetRef.current;
    if (!el) return;

    function render() {
      if (cancelled || !widgetRef.current || !window.turnstile) return;
      if (widgetRef.current.dataset.rendered) return;
      widgetRef.current.dataset.rendered = "true";
      window.turnstile.render(widgetRef.current, {
        sitekey: SITE_KEY,
        theme: "light",
        callback: (t) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    }

    function load() {
      if (cancelled) return;
      if (window.turnstile) {
        render();
        return;
      }
      const existing = document.querySelector("script[data-turnstile]");
      if (existing) {
        existing.addEventListener("load", render);
        return;
      }
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      s.dataset.turnstile = "true";
      s.onload = render;
      document.head.appendChild(s);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        // One frame of headroom so the reveal transition has started and the
        // container is genuinely painted before Turnstile measures it.
        requestAnimationFrame(() => setTimeout(load, 60));
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  const cancelHold = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startedAt.current = 0;
    setProgress(0);
  }, []);

  useEffect(() => () => cancelHold(), [cancelHold]);

  async function submit() {
    const form = formRef.current;
    if (!form) return;

    // Let the browser surface its own validation messages first.
    if (!form.reportValidity()) return;

    setStatus("sending");
    setError("");

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken: token }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong.");
      // Turnstile tokens are single-use — reset so a retry gets a fresh one.
      if (window.turnstile && widgetRef.current) {
        window.turnstile.reset(widgetRef.current);
        setToken("");
      }
    } finally {
      cancelHold();
    }
  }

  function startHold() {
    if (status === "sending") return;
    if (SITE_KEY && !token) {
      setError("Please complete the verification below first.");
      return;
    }
    setError("");
    startedAt.current = performance.now();

    const tick = (now) => {
      const pct = Math.min(1, (now - startedAt.current) / HOLD_MS);
      setProgress(pct);
      if (pct >= 1) {
        cancelHold();
        submit();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  return (
    <section id="contact" className="bg-[#dedcd6] px-6 py-20 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <p className="text-[11px] uppercase tracking-widest2 text-gold-dim">
            Begin the Conversation
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-tight text-ink lg:text-6xl">
            Let&rsquo;s find your place
            <br />
            <em className="text-gold-dim">in the mountains.</em>
          </h2>
          <div className="hairline mt-8 mb-8 w-24" />
          <p className="max-w-md font-light leading-relaxed text-ink/78">
            Whether buying, selling, or simply curious about your
            property&rsquo;s position in today&rsquo;s market, every inquiry is
            held in strict confidence.
          </p>
          <div className="mt-10 space-y-4 text-sm font-light text-ink/80">
            <p>
              <span className="mr-4 text-[10px] uppercase tracking-[0.25em] text-gold-dim">
                Tel
              </span>
              <a href="tel:+18287345201">(828) 734-5201</a>
            </p>
            <p>
              <span className="mr-4 text-[10px] uppercase tracking-[0.25em] text-gold-dim">
                Email
              </span>
              <a href="mailto:bknoland@beverly-hanks.com">bknoland@beverly-hanks.com</a>
            </p>
            <p>
              <span className="mr-4 text-[10px] uppercase tracking-[0.25em] text-gold-dim">
                Office
              </span>
              (828) 452-5809
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          {status === "sent" ? (
            <div className="flex h-full flex-col items-center justify-center border border-ink/20 p-12 text-center">
              <p className="font-serif text-3xl text-ink">Thank you.</p>
              <p className="mt-4 max-w-sm font-light text-ink/80">
                Your message has been received. Brian will be in touch personally
                within one business day.
              </p>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="space-y-8"
            >
              <div className="grid gap-8 sm:grid-cols-2">
                <input required name="firstName" placeholder="First name" className={inputClass} />
                <input required name="lastName" placeholder="Last name" className={inputClass} />
              </div>
              <input
                required
                type="email"
                name="email"
                placeholder="Email address"
                className={inputClass}
              />
              <input type="tel" name="phone" placeholder="Phone (optional)" className={inputClass} />
              <select required name="interest" defaultValue="" className={`${inputClass} appearance-none`}>
                <option value="" disabled className="bg-bone">
                  I&rsquo;m interested in&hellip;
                </option>
                <option className="bg-bone">Buying a home</option>
                <option className="bg-bone">Selling a home</option>
                <option className="bg-bone">A market valuation</option>
                <option className="bg-bone">Something else</option>
              </select>
              <textarea
                rows={4}
                name="message"
                placeholder="Tell me a little about what you're looking for"
                className={`${inputClass} resize-none`}
              />

              {/* Honeypot. Hidden from people, irresistible to naive bots. */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label>
                  Company
                  <input name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              {SITE_KEY && <div ref={widgetRef} className="min-h-[65px]" />}

              {/* Press and hold to send. The hold is the interaction; Turnstile
                  above is what actually keeps bots out. */}
              <div>
                <button
                  type="button"
                  disabled={status === "sending"}
                  onPointerDown={startHold}
                  onPointerUp={cancelHold}
                  onPointerLeave={cancelHold}
                  onPointerCancel={cancelHold}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !e.repeat) startHold();
                  }}
                  onKeyUp={cancelHold}
                  className="relative w-full select-none overflow-hidden bg-ink py-4 text-xs uppercase tracking-[0.25em] text-bone transition-colors duration-300 hover:bg-ink/90 disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:px-12"
                >
                  <span
                    className="absolute inset-y-0 left-0 bg-gold transition-none"
                    style={{ width: `${progress * 100}%` }}
                    aria-hidden="true"
                  />
                  <span className="relative">
                    {status === "sending"
                      ? "Sending…"
                      : progress > 0
                        ? "Keep holding…"
                        : "Press and hold to send"}
                  </span>
                </button>
                <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-ink/72">
                  Hold the button for a moment to confirm you&rsquo;re human
                </p>
              </div>

              {status === "error" && error && (
                <p className="border-l-2 border-gold pl-4 text-sm text-ink/75">{error}</p>
              )}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
