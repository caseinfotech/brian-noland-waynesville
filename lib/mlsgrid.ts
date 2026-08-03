/**
 * Shared MLS Grid query + normalization.
 *
 * Imported by BOTH `app/api/properties/route.ts` (Node runtime) and
 * `worker/index.ts` (Cloudflare Worker), so the two entry points can never
 * drift apart.
 *
 * MLS Grid rules this file exists to respect (docs.mlsgrid.com):
 *  - Rate limits: 2 req/sec, 7,200/hr, 4 GB/hr, 40,000/day. Exceeding them
 *    suspends the token automatically, so responses are cached aggressively
 *    and $top is capped.
 *  - `MlgCanView eq true` — records where this is false must not be shown.
 *  - Media URLs are DOWNLOAD-ONLY. They must never be handed to a browser,
 *    so `normalizeProperty` rewrites them to our own `/api/media` proxy.
 */

export const MLS_GRID_BASE = "https://api-demo.mlsgrid.com/v2";

/** Demo/test feed is the Carolina system. Override via env when going live. */
export const DEFAULT_ORIGINATING_SYSTEM = "carolina";

/** Hosts we are willing to proxy images from. Keeps /api/media from
 *  becoming an open redirect/proxy for arbitrary URLs. */
export const ALLOWED_MEDIA_HOSTS = [
  "api-demo.mlsgrid.com",
  "api.mlsgrid.com",
  "mlsgrid.com",
  "s3.amazonaws.com",
  "amazonaws.com",
];

export function isAllowedMediaUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return false;
    return ALLOWED_MEDIA_HOSTS.some(
      (h) => url.hostname === h || url.hostname.endsWith(`.${h}`),
    );
  } catch {
    return false;
  }
}

export function escapeODataString(value: string): string {
  return value.replace(/'/g, "''");
}

export interface RawMedia {
  MediaKey?: string;
  MediaURL?: string;
  Order?: number;
  MediaCategory?: string;
  ShortDescription?: string;
  MlgCanView?: boolean;
}

export interface RawProperty {
  ListingKey?: string;
  ListingId?: string;
  ListPrice?: number;
  City?: string;
  StateOrProvince?: string;
  StreetNumber?: string;
  StreetDirPrefix?: string;
  StreetName?: string;
  StreetSuffix?: string;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  LivingArea?: number;
  PropertyType?: string;
  PropertySubType?: string;
  StandardStatus?: string;
  ListOfficeName?: string;
  ListAgentFullName?: string;
  ListAgentMlsId?: string;
  CoListAgentMlsId?: string;
  MlgCanView?: boolean;
  Media?: RawMedia[];
}

export interface NormalizedPhoto {
  /** Points at our own /api/media proxy, never at MLS Grid. */
  src: string;
  alt: string;
}

export interface NormalizedProperty {
  listingKey: string;
  listingId: string | null;
  address: string;
  city: string | null;
  state: string | null;
  price: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  propertyType: string | null;
  propertySubType: string | null;
  status: string | null;
  listOfficeName: string | null;
  listAgentName: string | null;
  photos: NormalizedPhoto[];
}

const SELECT_FIELDS = [
  "ListingKey",
  "ListingId",
  "ListPrice",
  "City",
  "StateOrProvince",
  "StreetNumber",
  "StreetDirPrefix",
  "StreetName",
  "StreetSuffix",
  "BedroomsTotal",
  "BathroomsTotalInteger",
  "LivingArea",
  "PropertyType",
  "PropertySubType",
  "StandardStatus",
  "ListOfficeName",
  "ListAgentFullName",
  // Needed for the client-side agent filter (not server-searchable).
  "ListAgentMlsId",
  "CoListAgentMlsId",
].join(",");

export interface BuildQueryOptions {
  propertyType?: string | null;
  /** Server caps this — see rate limits. */
  top?: number;
  originatingSystemName?: string;
  /**
   * Restrict results to one agent's listings.
   *
   * IMPORTANT: `ListAgentMlsId` is NOT one of MLS Grid's searchable fields
   * (only ModificationTimestamp, OriginatingSystemName, StandardStatus,
   * ListingId and MlgCanView are). So this cannot go in `$filter` — it is
   * applied client-side in `fetchProperties` after the response comes back.
   *
   * Consequence: we must over-fetch and then narrow. `agentFetchMultiplier`
   * controls how much wider the upstream page is when this is set.
   */
  agentMlsId?: string | null;
  /**
   * Alternative to agentMlsId: name his listings explicitly. `ListingId` IS
   * searchable, so this filters server-side and is far cheaper. Preferred once
   * you know the listing numbers.
   */
  listingIds?: string[] | null;
}

/** How much wider to fetch when filtering by agent client-side. */
const AGENT_FETCH_MULTIPLIER = 4;

export function buildPropertiesUrl({
  propertyType,
  top = 12,
  originatingSystemName = DEFAULT_ORIGINATING_SYSTEM,
  agentMlsId,
  listingIds,
}: BuildQueryOptions): URL {
  const filters = [
    `OriginatingSystemName eq '${escapeODataString(originatingSystemName)}'`,
    "MlgCanView eq true",
    "StandardStatus eq 'Active'",
  ];

  if (propertyType) {
    filters.push(`PropertyType eq '${escapeODataString(propertyType)}'`);
  }

  // ListingId IS searchable — use it server-side when we have it.
  if (listingIds?.length) {
    const clause = listingIds
      .map((id) => `ListingId eq '${escapeODataString(id)}'`)
      .join(" or ");
    filters.push(`(${clause})`);
  }

  const url = new URL(`${MLS_GRID_BASE}/Property`);
  url.searchParams.set("$filter", filters.join(" and "));
  // Filtering by agent happens after the fetch, so pull a wider page to make
  // it likely his listings are in it.
  const effectiveTop =
    agentMlsId && !listingIds?.length ? top * AGENT_FETCH_MULTIPLIER : top;
  // Hard cap: never let a query string blow past the data cap.
  url.searchParams.set("$top", String(Math.min(Math.max(effectiveTop, 1), 50)));
  url.searchParams.set("$select", SELECT_FIELDS);
  // Photos live on the expanded Media resource.
  url.searchParams.set("$expand", "Media");
  return url;
}

function buildAddress(p: RawProperty): string {
  return [p.StreetNumber, p.StreetDirPrefix, p.StreetName, p.StreetSuffix]
    .filter(Boolean)
    .join(" ")
    .trim();
}

/** Rewrite an MLS media URL to our own proxy so it never leaves our domain. */
export function toProxyUrl(mediaUrl: string): string {
  return `/api/media?url=${encodeURIComponent(mediaUrl)}`;
}

export function normalizeProperty(
  p: RawProperty,
  maxPhotos = 6,
): NormalizedProperty {
  const address = buildAddress(p);

  const photos = (p.Media ?? [])
    .filter(
      (m) =>
        m.MlgCanView !== false &&
        typeof m.MediaURL === "string" &&
        isAllowedMediaUrl(m.MediaURL) &&
        (!m.MediaCategory || /photo|image/i.test(m.MediaCategory)),
    )
    .sort((a, b) => (a.Order ?? 999) - (b.Order ?? 999))
    .slice(0, maxPhotos)
    .map((m) => ({
      src: toProxyUrl(m.MediaURL as string),
      alt: m.ShortDescription || address || "MLS listing photo",
    }));

  return {
    listingKey: p.ListingKey ?? p.ListingId ?? address,
    listingId: p.ListingId ?? null,
    address,
    city: p.City ?? null,
    state: p.StateOrProvince ?? null,
    price: typeof p.ListPrice === "number" ? p.ListPrice : null,
    beds: p.BedroomsTotal ?? null,
    baths: p.BathroomsTotalInteger ?? null,
    sqft: p.LivingArea ?? null,
    propertyType: p.PropertyType ?? null,
    propertySubType: p.PropertySubType ?? null,
    status: p.StandardStatus ?? null,
    listOfficeName: p.ListOfficeName ?? null,
    listAgentName: p.ListAgentFullName ?? null,
    photos,
  };
}

export interface FetchResult {
  ok: boolean;
  status: number;
  properties: NormalizedProperty[];
  error?: string;
  /** True when an agent filter was applied to the results. */
  filteredByAgent?: boolean;
  /** How many records came back before the agent filter narrowed them. */
  totalBeforeAgentFilter?: number;
}

/**
 * One upstream call, normalized. Callers add their own caching.
 */
export async function fetchProperties(
  token: string,
  options: BuildQueryOptions,
): Promise<FetchResult> {
  const url = buildPropertiesUrl(options);

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Accept-Encoding": "gzip,deflate",
      },
    });
  } catch {
    return {
      ok: false,
      status: 502,
      properties: [],
      error: "Could not reach the MLS service.",
    };
  }

  if (upstream.status === 429) {
    // Token throttled or suspended — say so plainly rather than retrying,
    // since retrying is what causes suspension in the first place.
    return {
      ok: false,
      status: 429,
      properties: [],
      error: "MLS request limit reached. Please try again shortly.",
    };
  }

  if (upstream.status === 401 || upstream.status === 403) {
    return {
      ok: false,
      status: 502,
      properties: [],
      error: "The MLS connection is not authorized.",
    };
  }

  if (!upstream.ok) {
    return {
      ok: false,
      status: 502,
      properties: [],
      error: "The MLS service could not return listings at this time.",
    };
  }

  const payload = (await upstream.json()) as { value?: RawProperty[] };
  const visible = (payload.value ?? []).filter((p) => p.MlgCanView !== false);

  // Agent narrowing happens here, not in $filter — ListAgentMlsId is not a
  // searchable field on the replication server.
  const agentMlsId = options.agentMlsId?.trim();
  const narrowed = agentMlsId
    ? visible.filter(
        (p) =>
          p.ListAgentMlsId === agentMlsId || p.CoListAgentMlsId === agentMlsId,
      )
    : visible;

  return {
    ok: true,
    status: 200,
    properties: narrowed.map((p) => normalizeProperty(p)),
    filteredByAgent: Boolean(agentMlsId),
    totalBeforeAgentFilter: visible.length,
  };
}

/**
 * Cache policy. Listings change slowly and the rate limits are strict, so
 * serve stale while revalidating rather than hitting upstream per request.
 */
export const LISTINGS_CACHE_CONTROL =
  "public, max-age=900, s-maxage=900, stale-while-revalidate=3600";

export const MEDIA_CACHE_CONTROL =
  "public, max-age=604800, s-maxage=604800, immutable";
