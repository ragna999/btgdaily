import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./supabase-server";

export const verifySession = cache(async () => {
  const client = await createClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) redirect("/admin/login");

  // Try to get role from users table, but don't block if it fails
  const { data: profile } = await client
    .from("users")
    .select("id, name, role, is_active")
    .eq("email", user.email!)
    .maybeSingle();

  if (profile?.is_active === false) redirect("/admin/login");

  return {
    user,
    profile: profile ?? {
      id: 0,
      name: user.email!,
      role: "admin" as const,
      is_active: true,
    },
  };
});
