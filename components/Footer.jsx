import BrokerageMark from "./BrokerageMark";

export default function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-12">
        <div className="flex flex-col items-center gap-10 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:text-left">
          <div>
            <p className="font-serif text-2xl text-bone lg:text-3xl">
              Brian K. Noland<span className="text-gold">.</span>
            </p>
            {/* Was "Asheville · Blue Ridge · Western NC", which didn't match
                the rest of the site's Waynesville / Haywood County positioning. */}
            <p className="mt-1.5 text-[10px] uppercase tracking-widest2 text-gold">
              Waynesville &middot; Haywood County &middot; Western NC
            </p>
            <div className="mt-5 space-y-1.5 text-[11px] font-light text-mist">
              <p>
                <a href="tel:+18287345201" className="transition-colors hover:text-bone">
                  (828) 734-5201
                </a>
              </p>
              <p>
                <a
                  href="mailto:bknoland@beverly-hanks.com"
                  className="transition-colors hover:text-bone"
                >
                  bknoland@beverly-hanks.com
                </a>
              </p>
            </div>
          </div>

          {/* Firm identification — required on licensee advertising in NC. */}
          <BrokerageMark />
        </div>

        <div className="mt-12 border-t border-bone/10 pt-8">
          <p className="mx-auto max-w-3xl text-center text-[11px] font-light leading-relaxed text-mist lg:text-left">
            {/* CONFIRM the exact firm name required on advertising. His email
                is @beverly-hanks.com and his commercial profile reads NAI
                Beverly-Hanks, while the supplied logo is Howard Hanna Real
                Estate Services. NC requires the affiliated firm to be named
                correctly on licensee advertising. */}
            &copy; {new Date().getFullYear()} Brian K. Noland. Residential and
            Commercial Broker Associate, Howard Hanna Real Estate Services.
            Licensed in North Carolina. Equal Housing Opportunity. All
            information deemed reliable but not guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
}
