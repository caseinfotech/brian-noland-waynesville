/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import {
  fetchProperties,
  isAllowedMediaUrl,
  LISTINGS_CACHE_CONTROL,
  MEDIA_CACHE_CONTROL,
  DEFAULT_ORIGINATING_SYSTEM,
} from "../lib/mlsgrid";

interface Env {
  // ASSETS and IMAGES are Cloudflare bindings that only exist in a deployed
  // Worker. `vite.config.ts` does not declare them for local dev, so they are
  // optional here and guarded at the call site below.
  ASSETS?: Fetcher;
  DB: D1Database;
  MLS_GRID_API_TOKEN?: string;
  MLS_GRID_ORIGINATING_SYSTEM_NAME?: string;
  MLS_GRID_AGENT_MLS_ID?: string;
  MLS_GRID_LISTING_IDS?: string;
  IMAGES?: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

async function serveProperties(request: Request, env: Env): Promise<Response> {
  if (!env.MLS_GRID_API_TOKEN) {
    return Response.json(
      { error: "The MLS listing connection is not configured yet." },
      { status: 503 },
    );
  }

  const requestUrl = new URL(request.url);
  const propertyType =
    requestUrl.searchParams.get("propertyType")?.trim() || null;

  const listingIds = (env.MLS_GRID_LISTING_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const result = await fetchProperties(env.MLS_GRID_API_TOKEN, {
    propertyType,
    top: 12,
    originatingSystemName:
      env.MLS_GRID_ORIGINATING_SYSTEM_NAME || DEFAULT_ORIGINATING_SYSTEM,
    agentMlsId: env.MLS_GRID_AGENT_MLS_ID || null,
    listingIds: listingIds.length ? listingIds : null,
  });

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.json(
    {
      properties: result.properties,
      filteredByAgent: result.filteredByAgent ?? false,
    },
    { headers: { "Cache-Control": LISTINGS_CACHE_CONTROL } },
  );
}

/**
 * Media proxy (Worker edition). Uses the Cloudflare edge cache so repeat
 * views never re-pull bytes from MLS Grid — important for the 4 GB/hour cap.
 */
async function serveMedia(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const target = new URL(request.url).searchParams.get("url");
  if (!target || !isAllowedMediaUrl(target)) {
    return new Response("Invalid media URL", { status: 400 });
  }

  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(request.url, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      headers: env.MLS_GRID_API_TOKEN
        ? { Authorization: `Bearer ${env.MLS_GRID_API_TOKEN}` }
        : {},
    });
  } catch {
    return new Response("Upstream image unavailable", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream image unavailable", { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  if (!contentType.startsWith("image/")) {
    return new Response("Not an image", { status: 415 });
  }

  const response = new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": MEDIA_CACHE_CONTROL,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });

  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/properties") {
      return serveProperties(request, env);
    }

    if (url.pathname === "/api/media") {
      return serveMedia(request, env, ctx);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const images = env.IMAGES;
      const assets = env.ASSETS;

      return handleImageOptimization(
        request,
        {
          // `path` is always root-relative (vinext validates this), so in local
          // dev — where the ASSETS binding is absent — we can fetch it straight
          // off the dev server instead of crashing on `undefined.fetch`.
          fetchAsset: (path) =>
            assets
              ? assets.fetch(new Request(new URL(path, request.url)))
              : fetch(new URL(path, request.url)),
          // Without the Images binding, vinext falls back to serving the
          // original file unoptimized — correct behaviour for local dev.
          transformImage: images
            ? async (body, { width, format, quality }) => {
                const result = await images
                  .input(body)
                  .transform(width > 0 ? { width } : {})
                  .output({ format, quality });
                return result.response();
              }
            : undefined,
        },
        allowedWidths,
      );
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
