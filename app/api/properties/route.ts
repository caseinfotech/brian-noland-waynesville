export const runtime = "nodejs";

function escapeODataString(value: string) {
  return value.replace(/'/g, "''");
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
      Authorization: `Bearer ${accessToken}`,
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
