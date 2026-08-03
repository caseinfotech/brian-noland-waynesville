/**
 * Contact form endpoint.
 *
 * Order of operations matters here:
 *   1. Honeypot  — free, catches naive bots before any network call.
 *   2. Turnstile — server-side verification. The client-side widget alone
 *                  proves nothing; a bot can POST here directly, so the token
 *                  MUST be validated here or the CAPTCHA is decorative.
 *   3. Validate  — never trust field contents.
 *   4. Send      — via Resend.
 *
 * Env:
 *   RESEND_API_KEY        server-only
 *   CONTACT_TO_EMAIL      where inquiries go
 *   CONTACT_FROM_EMAIL    must be on a domain verified in Resend
 *   TURNSTILE_SECRET_KEY  server-only (paired with NEXT_PUBLIC_TURNSTILE_SITE_KEY)
 */

export const runtime = "nodejs";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface ContactPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
  turnstileToken?: string;
  /** Honeypot — must stay empty. Real users never see this field. */
  company?: string;
}

const clean = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}

/** Strip CR/LF so user input can't inject email headers. */
const headerSafe = (v: string) => v.replace(/[\r\n]+/g, " ");

function escapeHtml(v: string) {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function verifyTurnstile(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Not configured — allow through rather than blocking every inquiry, but
  // make it loud in the logs so it isn't silently unprotected in production.
  if (!secret) {
    console.warn("[contact] TURNSTILE_SECRET_KEY not set — skipping CAPTCHA check");
    return true;
  }
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body });
    const json = (await res.json()) as { success?: boolean };
    return Boolean(json.success);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // 1. Honeypot. Silently accept so bots don't learn they were caught.
  if (clean(payload.company)) {
    return Response.json({ ok: true });
  }

  // 2. CAPTCHA
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null;

  if (!(await verifyTurnstile(clean(payload.turnstileToken, 4096), ip))) {
    return Response.json(
      { error: "Verification failed. Please try again." },
      { status: 400 },
    );
  }

  // 3. Validate
  const firstName = clean(payload.firstName, 100);
  const lastName = clean(payload.lastName, 100);
  const email = clean(payload.email, 254);
  const phone = clean(payload.phone, 40);
  const interest = clean(payload.interest, 100);
  const message = clean(payload.message, 4000);

  if (!firstName || !lastName || !isEmail(email)) {
    return Response.json(
      { error: "Please provide your name and a valid email address." },
      { status: 400 },
    );
  }

  // 4. Send
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error("[contact] Resend is not configured; inquiry NOT delivered", {
      from: firstName + " " + lastName,
      email,
    });
    return Response.json(
      { error: "The contact form is not configured yet. Please call or email directly." },
      { status: 503 },
    );
  }

  const name = `${firstName} ${lastName}`;
  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Interest", interest || "—"],
  ];

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;color:#12231d;line-height:1.6">
      <h2 style="font-family:Georgia,serif;color:#12231d;margin:0 0 4px">New website inquiry</h2>
      <p style="color:#6b6b62;margin:0 0 20px;font-size:13px">brian-noland-waynesville.vercel.app</p>
      <table cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:20px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#855b3f;font-size:11px;text-transform:uppercase;letter-spacing:.1em">${k}</td>` +
              `<td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
          )
          .join("")}
      </table>
      ${
        message
          ? `<div style="border-left:3px solid #b9784b;padding:4px 0 4px 14px;white-space:pre-wrap">${escapeHtml(
              message,
            )}</div>`
          : ""
      }
    </div>`;

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    (message ? `\n\n${message}` : "");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: headerSafe(from),
        to: [headerSafe(to)],
        // So Brian can hit Reply and reach the enquirer directly.
        reply_to: headerSafe(email),
        subject: `Website inquiry — ${headerSafe(name)}`,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[contact] Resend ${res.status}: ${detail.slice(0, 300)}`);
      return Response.json(
        { error: "Your message could not be sent. Please call or email directly." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] send failed", err);
    return Response.json(
      { error: "Your message could not be sent. Please call or email directly." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
