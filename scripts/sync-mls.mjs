#!/usr/bin/env node
/**
 * MLS Grid → Supabase replication.
 *
 *   npm run sync            incremental (since the stored cursor)
 *   npm run sync -- --full  ignore the cursor and re-pull everything
 *   npm run sync -- --dry   fetch and report, write nothing
 *
 * Why this exists
 * ---------------
 * MLS Grid's replication API only accepts five searchable fields
 * (ModificationTimestamp, OriginatingSystemName, StandardStatus, ListingId,
 * MlgCanView). Real property search — city, price, beds, square footage —
 * is impossible against it directly. So we replicate into Postgres and query
 * that instead.
 *
 * Rules this script observes
 * --------------------------
 *  - 2 req/sec ceiling: requests are spaced ≥550ms apart.
 *  - MlgCanView === false means DELETE the record locally, not store it.
 *  - Media URLs are download-only; we persist the URL for server-side fetching
 *    but the site never renders it directly.
 *  - $top is capped at 5000 by the server; we page via @odata.nextLink.
 *
 * Requires (in .env.local):
 *   MLS_GRID_API_TOKEN
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   <- server-only, never NEXT_PUBLIC_
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// --- minimal .env loader (plain node doesn't read .env.local) --------------
for (const file of [".env", ".env.local"]) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (process.env[k] === undefined) process.env[k] = v;
  }
}

const argv = process.argv.slice(2);
const FULL = argv.includes("--full");
const DRY = argv.includes("--dry");

const TOKEN = process.env.MLS_GRID_API_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ORIGINATING = process.env.MLS_GRID_ORIGINATING_SYSTEM_NAME || "carolina";
const BASE = process.env.MLS_GRID_BASE_URL || "https://api-demo.mlsgrid.com/v2";
const STATUSES = (process.env.MLS_GRID_STATUSES || "Active")
  .split(",").map((s) => s.trim()).filter(Boolean);
const MAX_PAGES = Number(process.env.MLS_GRID_MAX_PAGES || 20);
const PAGE_SIZE = Number(process.env.MLS_GRID_PAGE_SIZE || 1000);

for (const [k, v] of Object.entries({ MLS_GRID_API_TOKEN: TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY })) {
  if (!v) {
    console.error(`✗ ${k} is not set. See .env.example.`);
    process.exit(1);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MIN_GAP_MS = 550; // < 2 req/sec
let lastReq = 0;

async function mlsFetch(url) {
  const wait = lastReq + MIN_GAP_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastReq = Date.now();

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
        "Accept-Encoding": "gzip,deflate",
      },
    });
    if (res.ok) return res.json();

    // 429 means throttled or suspended. Back off hard; never hammer.
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      const backoff = Math.min(60_000, 2 ** attempt * 3000);
      console.warn(`  ! HTTP ${res.status} — waiting ${backoff / 1000}s`);
      await sleep(backoff);
      continue;
    }
    throw new Error(`MLS Grid HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

// --- Supabase REST helpers (no SDK dependency) -----------------------------
async function sb(pathname, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    method,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      // Target the mls schema rather than public.
      "Accept-Profile": "mls",
      "Content-Profile": "mls",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`Supabase ${method} ${pathname} → ${res.status}: ${(await res.text()).slice(0, 400)}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const upsert = (table, rows, onConflict) =>
  sb(`${table}?on_conflict=${onConflict}`, {
    method: "POST",
    body: rows,
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
  });

// --- mapping ---------------------------------------------------------------
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);

function buildAddress(p) {
  return [p.StreetNumber, p.StreetDirPrefix, p.StreetName, p.StreetSuffix, p.UnitNumber ? `#${p.UnitNumber}` : null]
    .filter(Boolean).join(" ").trim() || null;
}

function toListingRow(p) {
  return {
    listing_key: p.ListingKey || p.ListingId,
    listing_id: p.ListingId ?? null,
    originating_system_name: p.OriginatingSystemName || ORIGINATING,
    standard_status: p.StandardStatus ?? null,
    property_type: p.PropertyType ?? null,
    property_sub_type: p.PropertySubType ?? null,
    street_number: p.StreetNumber ?? null,
    street_dir_prefix: p.StreetDirPrefix ?? null,
    street_name: p.StreetName ?? null,
    street_suffix: p.StreetSuffix ?? null,
    unit_number: p.UnitNumber ?? null,
    address: buildAddress(p),
    city: p.City ?? null,
    state_or_province: p.StateOrProvince ?? null,
    postal_code: p.PostalCode ?? null,
    subdivision_name: p.SubdivisionName ?? null,
    county_or_parish: p.CountyOrParish ?? null,
    list_price: num(p.ListPrice),
    bedrooms_total: num(p.BedroomsTotal),
    bathrooms_total: num(p.BathroomsTotalInteger) ?? num(p.BathroomsFull),
    living_area: num(p.LivingArea),
    lot_size_acres: num(p.LotSizeAcres),
    year_built: num(p.YearBuilt),
    days_on_market: num(p.DaysOnMarket),
    latitude: num(p.Latitude),
    longitude: num(p.Longitude),
    public_remarks: p.PublicRemarks ?? null,
    list_agent_mls_id: p.ListAgentMlsId ?? null,
    co_list_agent_mls_id: p.CoListAgentMlsId ?? null,
    list_agent_full_name: p.ListAgentFullName ?? null,
    list_office_name: p.ListOfficeName ?? null,
    modification_timestamp: p.ModificationTimestamp ?? null,
    mlg_can_view: p.MlgCanView !== false,
    raw: p,
    synced_at: new Date().toISOString(),
  };
}

function toMediaRows(p) {
  const key = p.ListingKey || p.ListingId;
  return (p.Media || [])
    .filter((m) => m.MlgCanView !== false && m.MediaURL &&
      (!m.MediaCategory || /photo|image/i.test(m.MediaCategory)))
    .sort((a, b) => (a.Order ?? 999) - (b.Order ?? 999))
    .map((m, i) => ({
      media_key: m.MediaKey || `${key}-${i}`,
      listing_key: key,
      media_url: m.MediaURL,
      media_category: m.MediaCategory ?? null,
      short_description: m.ShortDescription ?? null,
      sort_order: m.Order ?? i,
      synced_at: new Date().toISOString(),
    }));
}

// --- main ------------------------------------------------------------------
async function main() {
  console.log(`MLS      : ${ORIGINATING}  (${BASE})`);
  console.log(`Statuses : ${STATUSES.join(", ")}`);

  const state = FULL ? [] : await sb("sync_state?resource=eq.Property&select=*");
  const cursor = FULL ? null : state?.[0]?.last_modification_timestamp || null;
  console.log(`Cursor   : ${cursor || "(none — full pull)"}`);
  if (DRY) console.log("Mode     : DRY RUN (no writes)\n");

  const filters = [
    `OriginatingSystemName eq '${ORIGINATING.replace(/'/g, "''")}'`,
    "MlgCanView eq true",
    `(${STATUSES.map((s) => `StandardStatus eq '${s.replace(/'/g, "''")}'`).join(" or ")})`,
  ];
  if (cursor) filters.push(`ModificationTimestamp gt ${new Date(cursor).toISOString()}`);

  const first = new URL(`${BASE}/Property`);
  first.searchParams.set("$filter", filters.join(" and "));
  first.searchParams.set("$top", String(Math.min(PAGE_SIZE, 5000)));
  first.searchParams.set("$expand", "Media");
  first.searchParams.set("$orderby", "ModificationTimestamp asc");

  let url = first.toString();
  let page = 0, totalSeen = 0, upserted = 0, deleted = 0, newest = cursor;

  while (url && page < MAX_PAGES) {
    const json = await mlsFetch(url);
    const records = json.value || [];
    page++;
    totalSeen += records.length;
    if (!records.length) break;

    const removable = records.filter((p) => p.MlgCanView === false)
      .map((p) => p.ListingKey || p.ListingId);
    const keep = records.filter((p) => p.MlgCanView !== false);

    for (const p of records) {
      const ts = p.ModificationTimestamp;
      if (ts && (!newest || ts > newest)) newest = ts;
    }

    if (!DRY) {
      if (keep.length) {
        await upsert("listings", keep.map(toListingRow), "listing_key");
        const media = keep.flatMap(toMediaRows);
        // Chunked: a single request with thousands of rows can time out.
        for (let i = 0; i < media.length; i += 500) {
          await upsert("listing_media", media.slice(i, i + 500), "media_key");
        }
        upserted += keep.length;
      }
      // MlgCanView=false → remove from our store entirely.
      for (const k of removable) {
        await sb(`listings?listing_key=eq.${encodeURIComponent(k)}`, { method: "DELETE" });
        deleted++;
      }
    }

    console.log(`  page ${page}: ${records.length} records (${upserted} upserted, ${deleted} deleted)`);
    url = json["@odata.nextLink"] || null;
  }

  if (url) console.warn(`  ! Stopped at MAX_PAGES=${MAX_PAGES}; more data remains. Re-run to continue.`);

  if (!DRY) {
    await upsert("sync_state", [{
      resource: "Property",
      last_modification_timestamp: newest,
      last_run_at: new Date().toISOString(),
      records_seen: totalSeen,
      last_error: null,
    }], "resource");
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`Seen     : ${totalSeen}`);
  console.log(`Upserted : ${upserted}`);
  console.log(`Deleted  : ${deleted}`);
  console.log(`Cursor   : ${newest || "(unchanged)"}`);
}

main().catch((err) => {
  console.error(`\n✗ ${err.message}`);
  process.exit(1);
});
