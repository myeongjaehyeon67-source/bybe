"use client";

import { useActionState, useState } from "react";
import { signIn, signUp } from "@/actions/auth";
import { initialAuthState } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginState, loginAction, loginPending] = useActionState(
    signIn,
    initialAuthState,
  );
  const [signupState, signupAction, signupPending] = useActionState(
    signUp,
    initialAuthState,
  );

  const isLogin = mode === "login";
  const state = isLogin ? loginState : signupState;
  const action = isLogin ? loginAction : signupAction;
  const pending = isLogin ? loginPending : signupPending;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Project OS</h1>
        <p className="text-sm text-muted-foreground">
          {isLogin ? "계정에 로그인하세요" : "계정을 만드세요"}
        </p>
      </div>

      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={6}
            required
          />
        </div>

        {state.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        {state.message && (
          <p className="text-sm text-muted-foreground">{state.message}</p>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => setMode(isLogin ? "signup" : "login")}
        className="text-center text-sm text-muted-foreground hover:text-foreground"
      >
        {isLogin ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
      </button>
    </div>
  );
}
