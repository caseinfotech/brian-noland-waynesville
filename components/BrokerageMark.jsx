import Image from "next/image";

/**
 * Brokerage identification — Howard Hanna Real Estate Services.
 *
 * North Carolina requires a licensee's advertising to identify the firm they're
 * affiliated with, so this is a compliance element, not decoration. Keep it on
 * the page — in the nav and the footer.
 *
 * public/images/howard-hanna-mark-v2.png is the monogram + wordmark cropped
 * out of the newer combined "Brian Noland | Howard Hanna" lockup, white on a
 * transparent background. It replaces the previous crop at Jeremy's request.
 * The name itself stays live text elsewhere on the site rather than baked
 * into this image, so it's one accessible string instead of a raster of it.
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
      src="/images/howard-hanna-mark-v2.png"
      alt="Howard Hanna Real Estate Services"
      width={1357}
      height={427}
      className={`h-auto object-contain transition-[filter] duration-500 ${dark ? "brightness-0" : ""} ${className}`}
    />
  );
}
