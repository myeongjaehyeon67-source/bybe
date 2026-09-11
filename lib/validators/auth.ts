import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("올바른 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 해요."),
});

export type AuthInput = z.infer<typeof authSchema>;

export interface AuthActionState {
  error: string | null;
  message: string | null;
}

export const initialAuthState: AuthActionState = { error: null, message: null };
