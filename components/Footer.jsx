import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-12">
        <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left">
          {/* Single combined lockup — same graphic as the nav, so the name
              and the Howard Hanna mark stay in the same fixed proportion to
              each other everywhere on the site. Required firm identification
              lives inside it. */}
          <Image
            src="/images/brian-noland-howard-hanna-lockup.png"
            alt="Brian Noland | Howard Hanna Real Estate Services"
            width={2660}
            height={469}
            className="h-auto w-[280px] object-contain sm:w-[340px] lg:w-[400px]"
          />
          {/* Was "Asheville · Blue Ridge · Western NC", which didn't match
              the rest of the site's Waynesville / Haywood County positioning. */}
          <p className="text-[10px] uppercase tracking-widest2 text-gold">
            Waynesville &middot; Haywood County &middot; Western NC
          </p>
          <div className="space-y-1.5 text-[11px] font-light text-mist">
            <p>
              <a href="tel:+18287345201" className="transition-colors hover:text-bone">
                (828) 734-5201
              </a>
            </p>
          </div>

          <div className="flex items-center gap-5 text-[10px] uppercase tracking-widest2 text-mist">
            <a
              href="https://www.facebook.com/BrianKNolandRealEstate"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold"
            >
              Facebook
            </a>
            <span className="text-mist/40">&middot;</span>
            <a
              href="https://www.instagram.com/bknoland/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold"
            >
              Instagram
            </a>
            <span className="text-mist/40">&middot;</span>
            <a
              href="https://www.zillow.com/profile/brianknoland"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold"
            >
              Zillow
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-bone/10 pt-8">
          <p className="mx-auto max-w-3xl text-center text-[11px] font-light leading-relaxed text-mist lg:text-left">
            {/* CONFIRM the exact firm name required on advertising. His email
                is @beverly-hanks.com and his commercial profile reads NAI
                Beverly-Hanks, while the supplied logo is Howard Hanna Real
                Estate Services. NC requires the affiliated firm to be named
                correctly on licensee advertising. */}
            &copy; {new Date().getFullYear()} Brian Noland. Residential and
            Commercial Broker Associate, Howard Hanna Real Estate Services.
            Licensed in North Carolina. Equal Housing Opportunity. All
            information deemed reliable but not guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
}
