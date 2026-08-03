import Image from "next/image";

/**
 * Brokerage identification — Howard Hanna Real Estate Services.
 *
 * North Carolina requires a licensee's advertising to identify the firm they're
 * affiliated with, so this is a compliance element, not decoration. Keep it on
 * the page — in the nav and the footer.
 *
 * public/images/howard-hanna-mark.png is the firm's own monogram + wordmark,
 * white on a transparent background, cropped from their co-branded agent
 * lockup (the other agent's name was cropped out — this file has never
 * contained it). Native size 530x171.
 *
 * The source art is white-only. `dark` renders it over light backgrounds by
 * flattening every opaque pixel to black (alpha untouched) instead of needing
 * a second exported asset — used in the nav once it switches to its light
 * (scrolled / solid) state.
 *
 * @param {{ className?: string, dark?: boolean }} props
 */
export default function BrokerageMark({ className = "w-[168px] lg:w-[196px]", dark = false }) {
  return (
    <Image
      src="/images/howard-hanna-mark.png"
      alt="Howard Hanna Real Estate Services"
      width={530}
      height={171}
      className={`h-auto object-contain transition-[filter] duration-500 ${dark ? "brightness-0" : ""} ${className}`}
    />
  );
}
