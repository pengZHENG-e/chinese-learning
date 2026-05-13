import { NextResponse } from "next/server";
import { consumeMagicToken, createSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const home = new URL("/", url.origin);

  if (!token) {
    home.searchParams.set("auth", "missing");
    return NextResponse.redirect(home);
  }

  const email = await consumeMagicToken(token);
  if (!email) {
    home.searchParams.set("auth", "expired");
    return NextResponse.redirect(home);
  }

  await createSession(email);
  home.searchParams.set("auth", "ok");
  return NextResponse.redirect(home);
}
