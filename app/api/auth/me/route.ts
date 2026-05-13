import { NextResponse } from "next/server";
import { getSessionEmail } from "@/lib/session";
import { kvEnabled } from "@/lib/kv";
import { emailEnabled } from "@/lib/email";

export const runtime = "nodejs";

export async function GET() {
  const configured = kvEnabled() && emailEnabled();
  const email = await getSessionEmail();
  return NextResponse.json({ configured, email });
}
