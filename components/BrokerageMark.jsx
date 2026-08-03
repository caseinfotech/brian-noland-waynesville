import Image from "next/image";

/**
 * Brokerage identification — Howard Hanna Real Estate Services.
 *
 * North Carolina requires a licensee's advertising to identify the firm they're
 * affiliated with, so this is a compliance element, not decoration. Keep it on
 * the page.
 *
 * public/images/howard-hanna-mark.png is the firm's own monogram + wordmark,
 * white on a transparent background, cropped from their co-branded agent
 * lockup (the other agent's name was cropped out — this file has never
 * contained it). Native size 530x171, so it reads at a real size next to the
 * name instead of shrinking into an afterthought badge.
 */
export default function BrokerageMark({ className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-2 lg:items-start ${className}`}>
      <p className="text-[9px] uppercase tracking-[0.25em] text-mist">
        Brokered by
      </p>
      <Image
        src="/images/howard-hanna-mark.png"
        alt="Howard Hanna Real Estate Services"
        width={530}
        height={171}
        className="h-auto w-[168px] object-contain lg:w-[196px]"
      />
    </div>
  );
}
