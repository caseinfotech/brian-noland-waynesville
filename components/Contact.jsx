"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const inputClass =
  "w-full border-b border-ink/25 bg-transparent py-3 text-sm font-light text-ink placeholder:text-ink/45 focus:border-gold focus:outline-none transition-colors";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire to your form backend (Formspree, Resend, API route, etc.)
    setSent(true);
  }

  return (
    <section id="contact" className="bg-[#d9cfbf] px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <p className="text-[11px] uppercase tracking-widest2 text-gold">
            Begin the Conversation
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-tight text-ink lg:text-6xl">
            Let&rsquo;s find your place
            <br />
            <em className="text-gold-dim">in the mountains.</em>
          </h2>
          <div className="hairline mt-8 mb-8 w-24" />
          <p className="max-w-md font-light leading-relaxed text-ink/65">
            Whether buying, selling, or simply curious about your
            property&rsquo;s position in today&rsquo;s market, every inquiry is
            held in strict confidence.
          </p>
          <div className="mt-10 space-y-4 text-sm font-light text-ink/70">
            <p>
              <span className="mr-4 text-[10px] uppercase tracking-[0.25em] text-gold">
                Tel
              </span>
              <a href="tel:+18287345201">(828) 734-5201</a>
            </p>
            <p>
              <span className="mr-4 text-[10px] uppercase tracking-[0.25em] text-gold">
                Email
              </span>
              <a href="mailto:bknoland@beverly-hanks.com">bknoland@beverly-hanks.com</a>
            </p>
            <p>
              <span className="mr-4 text-[10px] uppercase tracking-[0.25em] text-gold">
                Office
              </span>
              (828) 452-5809
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center border border-gold/20 p-12 text-center">
              <p className="font-serif text-3xl text-gold-light">Thank you.</p>
              <p className="mt-4 max-w-sm font-light text-mist">
                Your message has been received. Briand will be in touch
                personally within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <input required placeholder="First name" className={inputClass} />
                <input required placeholder="Last name" className={inputClass} />
              </div>
              <input
                required
                type="email"
                placeholder="Email address"
                className={inputClass}
              />
              <input type="tel" placeholder="Phone (optional)" className={inputClass} />
              <select required defaultValue="" className={`${inputClass} appearance-none`}>
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
                placeholder="Tell me a little about what you're looking for"
                className={`${inputClass} resize-none`}
              />
              <button
                type="submit"
                className="w-full bg-ink py-4 text-xs uppercase tracking-[0.25em] text-bone transition-all duration-300 hover:bg-gold sm:w-auto sm:px-12"
              >
                Send Inquiry
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
