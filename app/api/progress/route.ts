import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getServerSupabase } from "@/lib/supabase";
import type { Progress } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const sb = getServerSupabase();
  const { data, error } = await sb
    .from("progress")
    .select("data, updated_at")
    .eq("email", email)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    progress: (data?.data as Progress | null) ?? null,
    updatedAt: data?.updated_at ?? null,
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as { progress: Progress };
  if (!body?.progress) {
    return NextResponse.json({ error: "missing progress" }, { status: 400 });
  }

  const sb = getServerSupabase();
  const { error } = await sb
    .from("progress")
    .upsert(
      { email, data: body.progress, updated_at: new Date().toISOString() },
      { onConflict: "email" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
