"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authSchema, type AuthActionState } from "@/lib/validators/auth";

function assertSupabaseConfigured(): string | null {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return "Supabase is not configured yet. Add your project keys to .env.local.";
  }
  return null;
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const configError = assertSupabaseConfigured();
  if (configError) return { error: configError, message: null };

  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, message: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message, message: null };
  }

  redirect("/dashboard");
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const configError = assertSupabaseConfigured();
  if (configError) return { error: configError, message: null };

  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, message: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    return { error: error.message, message: null };
  }

  if (!data.session) {
    return {
      error: null,
      message: "Check your email to confirm your account before logging in.",
    };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
