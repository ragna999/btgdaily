import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { articleId } = await req.json();
  if (!articleId || typeof articleId !== "number") {
    return NextResponse.json({ error: "Invalid articleId" }, { status: 400 });
  }
  const { error } = await supabase.rpc("increment_article_views", { p_article_id: articleId });
  if (error) console.error("RPC error:", error);
  return NextResponse.json({ ok: true, error: error?.message });
}
