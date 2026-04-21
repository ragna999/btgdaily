import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { articleId } = await req.json();
  if (!articleId || typeof articleId !== "number") {
    return NextResponse.json({ error: "Invalid articleId" }, { status: 400 });
  }
  await supabase.rpc("increment_article_views", { article_id: articleId });
  return NextResponse.json({ ok: true });
}
