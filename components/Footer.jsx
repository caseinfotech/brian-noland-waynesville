export default function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-ink">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-6 py-12 text-center lg:flex-row lg:justify-between lg:px-12 lg:text-left">
        <div>
          <p className="font-serif text-xl text-bone">Brian K. Noland<span className="text-gold">.</span></p>
          <p className="mt-1 text-[10px] uppercase tracking-widest2 text-gold">
            Asheville &middot; Blue Ridge &middot; Western NC
          </p>
        </div>
        <p className="max-w-md text-[11px] font-light leading-relaxed text-mist">
          &copy; {new Date().getFullYear()} Brian K. Noland. Residential and
          Commercial Broker Associate. Equal Housing Opportunity. All
          information deemed reliable but not guaranteed.
        </p>
      </div>
    </footer>
  );
}
