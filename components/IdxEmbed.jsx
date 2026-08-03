"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Framed IDX slot.
 *
 * Canopy MLS approves several IDX vendors (IDX Broker, Showcase IDX,
 * Buying Buddy / UltimateIDX, Web4Realty, AgentWebsite). Each hands you either
 * an iframe URL or a script snippet. Configure whichever you're given:
 *
 *   NEXT_PUBLIC_IDX_EMBED_URL     → rendered as an iframe (most vendors)
 *   NEXT_PUBLIC_IDX_SCRIPT_SRC    → script injected into a container div
 *   NEXT_PUBLIC_IDX_WIDGET_ID     → optional container id some vendors require
 *
 * When none are set, the caller renders the MLS Grid API search instead, so
 * the page is never empty.
 *
 * Why an iframe is acceptable here: the vendor is responsible for IDX display
 * compliance, disclaimers, and media hosting. That is the entire reason to
 * choose framed IDX over the API — do not try to scrape or restyle their
 * output, as that breaks the compliance they're providing.
 */
export default function IdxEmbed({ embedUrl, scriptSrc, widgetId }) {
  const containerRef = useRef(null);
  const [scriptFailed, setScriptFailed] = useState(false);

  useEffect(() => {
    if (!scriptSrc || !containerRef.current) return;
    const el = containerRef.current;

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.onerror = () => setScriptFailed(true);
    el.appendChild(script);

    return () => {
      // Clear the container so React and the vendor script don't fight over
      // the same DOM on route changes / fast refresh.
      el.innerHTML = "";
    };
  }, [scriptSrc]);

  if (embedUrl) {
    return (
      <div className="border border-ink/15 bg-bone">
        <iframe
          src={embedUrl}
          title="Property search"
          loading="lazy"
          // Vendor IDX needs scripts, forms, and its own navigation. Keep
          // top-navigation locked so the frame can't hijack the page.
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-[1400px] w-full lg:h-[1100px]"
        />
      </div>
    );
  }

  if (scriptSrc) {
    return (
      <div className="border border-ink/15 bg-bone p-4">
        <div ref={containerRef} id={widgetId || "idx-widget"} />
        {scriptFailed && (
          <p className="border-l-2 border-gold pl-4 text-sm text-ink/70">
            The property search could not be loaded. Please refresh, or contact
            Brian directly and he&apos;ll send matching listings personally.
          </p>
        )}
      </div>
    );
  }

  return null;
}
