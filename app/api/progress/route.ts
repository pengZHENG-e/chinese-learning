import { NextResponse } from "next/server";
import { getSessionEmail } from "@/lib/session";
import { getKV } from "@/lib/kv";
import type { Progress } from "@/lib/types";

export const runtime = "nodejs";

const progressKey = (email: string) => `progress:${email}`;

export async function GET() {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const kv = getKV()!;
  const data = await kv.get<Progress>(progressKey(email));
  return NextResponse.json({ progress: data ?? null });
}

export async function PUT(req: Request) {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { progress?: Progress } | null;
  if (!body?.progress) return NextResponse.json({ error: "missing progress" }, { status: 400 });
  const kv = getKV()!;
  await kv.set(progressKey(email), body.progress);
  return NextResponse.json({ ok: true });
}
