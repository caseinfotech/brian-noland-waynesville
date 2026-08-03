import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * Brokerage identification — Howard Hanna | Beverly-Hanks.
 *
 * North Carolina requires a licensee's advertising to identify the firm they're
 * affiliated with, so this is a compliance element, not decoration. Keep it on
 * the page.
 *
 * Drop the official artwork at one of these paths and it's used automatically:
 *
 *     public/images/howard-hanna-beverly-hanks.svg     (preferred — scales cleanly)
 *     public/images/howard-hanna-beverly-hanks.png     (transparent background)
 *
 * Until then a clean type lockup stands in, so the firm is still identified and
 * nothing renders broken.
 *
 * Use the brokerage's supplied artwork — don't redraw or recolour it. Most
 * brands specify minimum size and clear space; the wrapper below leaves room.
 * A light/reversed version is what you want here, since this sits on `ink`.
 */

// First match wins. Reversed (light-on-green) artwork is preferred because this
// sits on the dark footer; a green-on-white version would need a white plate
// behind it to stay legible.
const CANDIDATES = [
  "/images/howard-hanna.svg",
  "/images/howard-hanna.png",
  "/images/howard-hanna-allen-tate.png",
  "/images/howard-hanna-stacked.png",
];

function findLogo() {
  for (const p of CANDIDATES) {
    if (fs.existsSync(path.join(process.cwd(), "public", p.replace(/^\//, "")))) {
      return p;
    }
  }
  return null;
}

export default function BrokerageMark({ className = "" }) {
  const logo = findLogo();

  return (
    <div className={`flex flex-col items-center gap-2 lg:items-start ${className}`}>
      <p className="text-[9px] uppercase tracking-[0.25em] text-mist">
        Brokered by
      </p>

      {logo ? (
        /* Rendered as supplied — not recoloured, cropped, or redrawn. The
           artwork carries its own background, so it reads as a brand tile. */
        <Image
          src={logo}
          alt="Howard Hanna Real Estate Services"
          width={447}
          height={447}
          className="h-auto w-[88px] object-contain lg:w-[96px]"
        />
      ) : (
        /* Type lockup fallback — identifies the firm correctly while the
           official artwork is pending. */
        <div className="leading-tight">
          <p className="font-serif text-lg text-bone">Howard Hanna</p>
          <p className="mt-0.5 text-[9px] uppercase tracking-[0.22em] text-mist">
            Real Estate Services &middot; Waynesville
          </p>
        </div>
      )}
    </div>
  );
}
