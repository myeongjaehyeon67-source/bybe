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
          {isLogin ? "Log in to your account" : "Create an account"}
        </p>
      </div>

      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
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
          {pending ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => setMode(isLogin ? "signup" : "login")}
        className="text-center text-sm text-muted-foreground hover:text-foreground"
      >
        {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
      </button>
    </div>
  );
}
