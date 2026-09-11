"use client";

import { useActionState } from "react";
import { generateCodingPromptAction } from "@/actions/tasks";
import { Button } from "@/components/ui/button";

const initialState = { error: null };

export function GeneratePromptButton({
  taskId,
  projectId,
}: {
  taskId: string;
  projectId: string;
}) {
  const [state, formAction, pending] = useActionState(
    generateCodingPromptAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="taskId" value={taskId} />
      <input type="hidden" name="projectId" value={projectId} />
      <Button type="submit" disabled={pending} size="sm" className="w-fit">
        {pending ? "생성 중..." : "AI 코딩 프롬프트 생성"}
      </Button>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
