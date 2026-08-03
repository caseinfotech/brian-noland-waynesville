import {
  fetchProperties,
  LISTINGS_CACHE_CONTROL,
  DEFAULT_ORIGINATING_SYSTEM,
} from "@/lib/mlsgrid";

export const runtime = "nodejs";

function parseListingIds(raw: string | undefined): string[] | null {
  if (!raw) return null;
  const ids = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return ids.length ? ids : null;
}

export async function GET(request: Request) {
  const accessToken = process.env.MLS_GRID_API_TOKEN;
  if (!accessToken) {
    return Response.json(
      { error: "The MLS listing connection is not configured yet." },
      { status: 503 },
    );
  }

  const requestUrl = new URL(request.url);
  const propertyType =
    requestUrl.searchParams.get("propertyType")?.trim() || null;

  const result = await fetchProperties(accessToken, {
    propertyType,
    top: 12,
    originatingSystemName:
      process.env.MLS_GRID_ORIGINATING_SYSTEM_NAME || DEFAULT_ORIGINATING_SYSTEM,
    agentMlsId: process.env.MLS_GRID_AGENT_MLS_ID || null,
    listingIds: parseListingIds(process.env.MLS_GRID_LISTING_IDS),
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
