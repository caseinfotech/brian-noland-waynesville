import Image from "next/image";

const social = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/BrianKNolandRealEstate",
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21.75v-8.44h2.83l.42-3.29h-3.25V7.9c0-.95.26-1.6 1.63-1.6h1.74V3.38C16.24 3.28 15.29 3.2 14.18 3.2c-2.32 0-3.9 1.42-3.9 4.02v2.8H7.44v3.29h2.84v8.44Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/bknoland/",
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" />
        <circle cx="12" cy="12" r="3.9" />
        <circle cx="17.15" cy="6.85" r="0.55" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Zillow",
    href: "https://www.zillow.com/profile/brianknoland",
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10v9.25h12V10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 19.25v-5h4v5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12">
        {/* Was a single column that stayed narrow and left-hugging even on
            wide desktop viewports, leaving most of the footer's width empty.
            Now splits into a left identity block and a right contact/social
            block so it actually spans the full container at lg+. */}
        <div className="flex flex-col items-center gap-10 text-center lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:text-left">
          <div className="flex flex-col items-center gap-5 lg:items-start">
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
            <p className="text-[10px] uppercase tracking-widest2 text-gold">
              Waynesville &middot; Haywood County &middot; Western NC
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 lg:items-end">
            <a
              href="tel:+18287345201"
              className="text-[11px] font-light text-mist transition-colors hover:text-bone"
            >
              (828) 734-5201
            </a>

            {/* Icon links instead of plain text — reads as a real social
                row rather than an afterthought, and stays legible at the
                footer's small type scale. */}
            <div className="flex items-center gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Brian Noland on ${s.label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-mist/25 text-mist transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-bone/10 pt-8">
          <p className="mx-auto max-w-3xl text-center text-[11px] font-light leading-relaxed text-mist lg:mx-0 lg:text-left">
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
