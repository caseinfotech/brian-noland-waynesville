/**
 * Media proxy.
 *
 * MLS Grid media URLs are download-only — they must never appear in markup
 * served to a visitor. This route fetches the image server-side (with our
 * bearer token, which also never leaves the server) and streams it back from
 * our own domain, cached hard so we don't re-pull the same bytes and burn
 * through the 4 GB/hour data cap.
 *
 * `?url=` is validated against an allow-list in lib/mlsgrid so this cannot be
 * turned into an open proxy.
 *
 * NOTE: for full MLS Grid compliance you are expected to keep your OWN copy of
 * media, not proxy on demand. This is the correct shape for the demo feed and
 * for launch; when the production feed is connected, back this route with R2
 * (or run a sync job) so images are genuinely persisted rather than cached.
 */
import { isAllowedMediaUrl, MEDIA_CACHE_CONTROL } from "@/lib/mlsgrid";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const target = requestUrl.searchParams.get("url");

  if (!target || !isAllowedMediaUrl(target)) {
    return new Response("Invalid media URL", { status: 400 });
  }

  // MLS Grid media URLs are PRE-SIGNED (they carry their own token= and
  // expires= values). Sending an Authorization header alongside that signature
  // gets the request rejected by the media CDN — so we deliberately send none.
  let upstream: Response;
  try {
    upstream = await fetch(target);
  } catch {
    return new Response("Upstream image unavailable", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    console.error(
      `[media] upstream ${upstream.status} for ${new URL(target).hostname}`,
    );
    return new Response("Upstream image unavailable", { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  if (!contentType.startsWith("image/")) {
    return new Response("Not an image", { status: 415 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": MEDIA_CACHE_CONTROL,
      // Belt and braces: never let this response be interpreted as markup.
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
