"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authSchema, type AuthActionState } from "@/lib/validators/auth";

function assertSupabaseConfigured(): string | null {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return "Supabase가 아직 설정되지 않았어요. .env.local에 프로젝트 키를 추가해주세요.";
  }
  return null;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않아요.",
  "Email not confirmed": "이메일 확인이 필요해요. 받은편지함을 확인해주세요.",
  "User already registered": "이미 가입된 이메일이에요.",
  "email rate limit exceeded":
    "이메일 발송 한도를 초과했어요. 잠시 후 다시 시도해주세요.",
};

function translateAuthError(message: string): string {
  return AUTH_ERROR_MESSAGES[message] ?? message;
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
    return { error: translateAuthError(error.message), message: null };
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
    return { error: translateAuthError(error.message), message: null };
  }

  if (!data.session) {
    return {
      error: null,
      message: "로그인 전에 이메일을 확인해서 계정을 인증해주세요.",
    };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
