/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  MLS_GRID_API_TOKEN?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

function escapeODataString(value: string) {
  return value.replace(/'/g, "''");
}

async function serveProperties(request: Request, env: Env): Promise<Response> {
  if (!env.MLS_GRID_API_TOKEN) {
    return Response.json(
      { error: "The MLS listing connection is not configured yet." },
      { status: 503 },
    );
  }

  const requestUrl = new URL(request.url);
  const propertyType = requestUrl.searchParams.get("propertyType")?.trim();
  const filters = [
    "OriginatingSystemName eq 'carolina'",
    "MlgCanView eq true",
    "StandardStatus eq 'Active'",
  ];

  if (propertyType) filters.push(`PropertyType eq '${escapeODataString(propertyType)}'`);

  const upstreamUrl = new URL("https://api-demo.mlsgrid.com/v2/Property");
  upstreamUrl.searchParams.set("$filter", filters.join(" and "));
  upstreamUrl.searchParams.set("$top", "12");
  upstreamUrl.searchParams.set(
    "$select",
    "ListingKey,ListingId,ListPrice,City,StateOrProvince,StreetNumber,StreetDirPrefix,StreetName,StreetSuffix,BedroomsTotal,BathroomsTotalInteger,LivingArea,PropertyType,PropertySubType,StandardStatus",
  );

  const upstream = await fetch(upstreamUrl, {
    headers: {
      Authorization: `Bearer ${env.MLS_GRID_API_TOKEN}`,
      "Accept-Encoding": "gzip,deflate",
    },
  });

  if (!upstream.ok) {
    return Response.json(
      { error: "The MLS service could not return listings at this time." },
      { status: 502 },
    );
  }

  const payload = (await upstream.json()) as { value?: unknown[] };
  return Response.json(
    { properties: payload.value ?? [] },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
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

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
