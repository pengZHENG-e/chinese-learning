import { NextResponse } from "next/server";
import { createMagicToken } from "@/lib/session";
import { sendMagicLink, emailEnabled } from "@/lib/email";
import { kvEnabled } from "@/lib/kv";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!kvEnabled() || !emailEnabled()) {
    return NextResponse.json(
      { error: "Sign-in is not configured on this deployment." },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const token = await createMagicToken(email);

  const origin =
    req.headers.get("origin") ||
    (req.headers.get("host") ? `https://${req.headers.get("host")}` : "");
  const link = `${origin}/api/auth/verify?token=${token}`;

  try {
    await sendMagicLink(email, link);
  } catch (e) {
    console.error("sendMagicLink failed", e);
    return NextResponse.json(
      { error: "Couldn't send email. Try again in a minute." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
